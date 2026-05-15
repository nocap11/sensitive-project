const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { OpenAI } = require('openai');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
// app.use(express.static(path.join(__dirname, '../public')));

// Initialize OpenAI
let openai = null;
try {
  if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
} catch (e) {
  console.error('OpenAI Initialization Error:', e);
}

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
let supabase = null;

if (supabaseUrl && supabaseKey && supabaseUrl !== 'your_supabase_url_here') {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
  } catch (e) {
    console.error('Supabase Initialization Error:', e);
  }
}

// API Endpoints
app.post('/api/analyze', async (req, res) => {
  try {
    const { text } = req.body;

    // Validation
    if (!text || typeof text !== 'string' || text.trim() === '') {
      return res.status(400).json({ error: '분석할 텍스트를 입력해주세요.' });
    }

    if (!openai) {
      return res.status(500).json({ 
        error: 'OpenAI API 설정이 완료되지 않았습니다. Vercel 환경 변수를 확인해주세요.',
        details: 'OPENAI_API_KEY is missing'
      });
    }

    // OpenAI Sentiment Analysis
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `너는 한국어 텍스트 감성 분석기다. 
사용자 텍스트를 positive, negative, neutral 중 하나로 분류한다. 
confidence는 0부터 100 사이의 정수로 작성한다. 
reason은 한국어로 한 문장만 작성한다. 
과장하지 말고 텍스트 근거만 사용한다. 
응답은 반드시 아래 JSON 형식을 따라야 한다:
{
  "sentiment": "positive | negative | neutral",
  "confidence": 0,
  "reason": "string"
}`,
        },
        {
          role: 'user',
          content: text,
        },
      ],
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(response.choices[0].message.content);

    // Save to Supabase (if available)
    if (supabase) {
      try {
        const { error: dbError } = await supabase.from('sentiment_logs').insert([
          {
            input_text: text,
            sentiment: result.sentiment,
            confidence: result.confidence,
            reason: result.reason,
          },
        ]);

        if (dbError) {
          console.error('Supabase save error:', dbError.message);
        }
      } catch (dbErr) {
        console.error('Supabase unexpected error:', dbErr);
      }
    }

    res.json(result);
  } catch (error) {
    console.error('Analysis error details:', error);
    res.status(500).json({ 
      error: '분석 중 문제가 발생했습니다.', 
      details: error.message 
    });
  }
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({ error: '서버 내부 오류가 발생했습니다.', details: err.message });
});

// Start server
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;
