document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.getElementById('inputText');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const loading = document.getElementById('loading');
    const errorBox = document.getElementById('errorBox');
    const resultCard = document.getElementById('resultCard');
    const sentimentBadge = document.getElementById('sentimentBadge');
    const confidenceBar = document.getElementById('confidenceBar');
    const confidenceText = document.getElementById('confidenceText');
    const reasonText = document.getElementById('reasonText');

    const sentimentMap = {
        'positive': { text: '긍정', class: 'badge-positive' },
        'negative': { text: '부정', class: 'badge-negative' },
        'neutral': { text: '중립', class: 'badge-neutral' }
    };

    analyzeBtn.addEventListener('click', async () => {
        const text = inputText.value.trim();

        // Validate input
        if (!text) {
            showError('분석할 문장을 입력해 주세요.');
            return;
        }

        // Reset UI
        hideError();
        hideResult();
        setLoading(true);

        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || '분석 중 오류가 발생했습니다.');
            }

            showResult(data);
        } catch (err) {
            console.error('Fetch error:', err);
            showError(err.message);
        } finally {
            setLoading(false);
        }
    });

    function setLoading(isLoading) {
        analyzeBtn.disabled = isLoading;
        analyzeBtn.textContent = isLoading ? '분석 중...' : '분석하기';
        loading.classList.toggle('hidden', !isLoading);
    }

    function showError(message) {
        errorBox.textContent = message;
        errorBox.classList.remove('hidden');
    }

    function hideError() {
        errorBox.classList.add('hidden');
    }

    function showResult(data) {
        const sentimentInfo = sentimentMap[data.sentiment] || sentimentMap['neutral'];
        
        sentimentBadge.textContent = sentimentInfo.text;
        sentimentBadge.className = `badge ${sentimentInfo.class}`;
        
        confidenceBar.style.width = `${data.confidence}%`;
        confidenceText.textContent = `${data.confidence}%`;
        
        reasonText.textContent = data.reason;
        
        resultCard.classList.remove('hidden');
        
        // Scroll to result
        resultCard.scrollIntoView({ behavior: 'smooth' });
    }

    function hideResult() {
        resultCard.classList.add('hidden');
    }
});
