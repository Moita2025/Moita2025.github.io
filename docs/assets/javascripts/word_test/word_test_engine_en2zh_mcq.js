window.blogStatusDict["testReady"]  = false;

// ============ 抽题核心状态 ============
window.TestEngine = {
    core: window.Utils.vocab.testEngineCore,

    startEngToZhTest(words) {
        try {
            window.Utils.vocab.QuestionType.EngToZhMultipleChoice.generate(words, 50, 200);
            window.blogStatusDict["testReady"] = true;
            window.dispatchEvent(new CustomEvent("testReady"));
            console.log("【中英互选】试题已生成，共 50 题");
        } catch (err) {
            console.error(err.message);
        }
    },

    answer(...args) { return this.core.answer(...args); },
    hasNext() { return this.core.hasNext(); },
    getCurrent() { return this.core.getCurrent(); },
    getResult() { return this.core.getResult(); },
    getCurrentIdx() {return this.core.currentIndex;},
    reset() { this.core.reset(); },
    get ready() { return this.core.ready; },
    get questions() { return this.core.questions; }
};

if (window.blogStatusDict["wordsReady"])
{
    const words = window.words;
    if (words && words.length >= 200) {
        console.log("生成测试题目...");
        TestEngine.startEngToZhTest(words);

        window.blogStatusDict["testReady"]  = true;

        // 通知 UI：试题准备好了
        const evt = new CustomEvent("testReady");
        window.dispatchEvent(evt);
    }
}

// ============ 事件：收到 wordsReady 后开始生成试题 ============
window.addEventListener("wordsReady", (e) => {
    const words = e.detail.words;
    if (words && words.length >= 200) {
        console.log("生成测试题目...");
        TestEngine.startEngToZhTest(words);

        window.blogStatusDict["testReady"]  = true;

        // 通知 UI：试题准备好了
        const evt = new CustomEvent("testReady");
        window.dispatchEvent(evt);
    }
});
