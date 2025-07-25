import { adviceData } from './data.js';

document.addEventListener('DOMContentLoaded', () => {
    const adviceEnElement = document.getElementById('advice-en');
    const adviceZhElement = document.getElementById('advice-zh');
    const newAdviceBtn = document.getElementById('new-advice-btn');
    const toggleEnBtn = document.getElementById('toggle-en-btn');
    const toggleZhBtn = document.getElementById('toggle-zh-btn');

    let lastIndex = -1;
    let showEn = true;
    let showZh = true;
    let historyStack = [];
    let forwardStack = [];

    function updateVisibility() {
        adviceEnElement.style.display = showEn ? '' : 'none';
        adviceZhElement.style.display = showZh ? '' : 'none';
        toggleEnBtn.textContent = showEn ? '隐藏英文 / Hide English' : '显示英文 / Show English';
        toggleZhBtn.textContent = showZh ? '隐藏中文 / Hide Chinese' : '显示中文 / Show Chinese';
    }

    function showAdviceByIndex(index) {
        lastIndex = index;
        const advice = adviceData[index];
        const adviceIdElement = document.getElementById('advice-id');
        adviceIdElement.textContent = `# ${advice.id}`;
        adviceEnElement.textContent = advice.en;
        adviceZhElement.textContent = advice.zh;
        updateVisibility();
    }

    function getNewAdvice() {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * adviceData.length);
        } while (adviceData.length > 1 && randomIndex === lastIndex);
        if (lastIndex !== -1) {
            historyStack.push(lastIndex);
            // 清空前进栈
            forwardStack = [];
        }
        showAdviceByIndex(randomIndex);
    }

    function getPrevAdvice() {
        if (historyStack.length > 0) {
            forwardStack.push(lastIndex);
            const prevIndex = historyStack.pop();
            showAdviceByIndex(prevIndex);
        }
    }

    function getForwardAdvice() {
        if (forwardStack.length > 0) {
            historyStack.push(lastIndex);
            const nextIndex = forwardStack.pop();
            showAdviceByIndex(nextIndex);
        }
    }

    newAdviceBtn.addEventListener('click', getNewAdvice);

    document.getElementById('prev-advice-btn').addEventListener('click', getPrevAdvice);

    toggleEnBtn.addEventListener('click', () => {
        showEn = !showEn;
        updateVisibility();
    });

    toggleZhBtn.addEventListener('click', () => {
        showZh = !showZh;
        updateVisibility();
    });

    // Show the first advice on page load
    getNewAdvice();
}); 