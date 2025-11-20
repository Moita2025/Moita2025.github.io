// 全局状态记录器
window.blogStatusDict = window.blogStatusDict || {};

/**
 * 通用初始化 JSON 单词表
 * @param {string} containerId - 放置 data-json 的 DOM 元素的 id
 * @param {string} eventName - 载入完成后要派发的事件名称
 * @param {function(words):void} onLoaded - 可选回调，用于执行文件特定逻辑
 */
async function initWordsGeneric(containerId, eventName, onLoaded = null) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`找不到 id 为 ${containerId} 的元素`);
        return;
    }

    const jsonFile = container.getAttribute('data-json');
    if (!jsonFile) {
        console.error(`${containerId} 上缺少 data-json 属性`);
        return;
    }

    try {
        const response = await fetch(jsonFile);
        const words = await response.json();

        // 更新全局变量，也可以只在回调中用
        window.words = words;

        // 标记当前事件名对应的数据已加载
        window.blogStatusDict[eventName] = true;

        // 触发事件
        const event = new CustomEvent(eventName, { detail: { words }});
        window.dispatchEvent(event);

        // 回调（如果需要）
        if (typeof onLoaded === 'function') {
            onLoaded(words);
        }

    } catch (err) {
        console.error(`加载 ${jsonFile} 时出错：`, err);
    }
}