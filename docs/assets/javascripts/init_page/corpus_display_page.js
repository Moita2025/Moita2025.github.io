// ==================== 配置 ====================
const CORPUS_DATA_URL = '/assets/data/en_general_speak_write_samples_20.json'; 

let corpusListData = []; 
let currentType = "";
const elesPerPage = 6;

const TYPE_NAME_MAP = {
    "education": "教育",
    "work": "工作",
    "planning": "规划",
    "friends": "朋友",
    "travel": "旅行",
    "environment": "环境",
    "clubs": "俱乐部",
    "exercise": "锻炼",
    "employment": "就业",
    "teacher": "教师",
    "museum": "博物馆",
    "future": "未来",
    "health": "健康",
    "art": "艺术",
    "technology": "技术",
    "earth": "地球",
    "influence": "影响力",
    "games": "游戏",
    "residence": "住所",
    "advertising": "广告"
};

// ==================== 工具函数 ====================
const $ = (tag, text = '', className = '') => {
    const el = document.createElement(tag);
    if (text) el.textContent = text;
    if (className) el.className = className;
    return el;
};

// ==================== 渲染核心 ====================
const renderCorpusEle = (ele, container) => {
    container.appendChild($('h2', `主题： ${ele.topic} `));

    var keywords = $("p");
    for (const keyword of ele.keywords)
    {
        keywords.innerHTML += `
        <span class="mdx-badge">
            <span class="mdx-badge__icon">
                <span class="twemoji">
                    🏷
                </span>
            </span>
            <span class="mdx-badge__text">${keyword}</span>
        </span>`;
    }
    container.appendChild(keywords);

};

const renderPage = (pageIndex, container) => {
    container.innerHTML = '';

    const start = pageIndex * elesPerPage;
    const end = Math.min(start + elesPerPage, corpusListData[0].length);
    const itemsToShow = corpusListData[0].slice(start, end);

    itemsToShow.forEach(item => renderCorpusEle(item, container));

    // 更新分页器标题（可选）
    window.Utils?.mkdocsRewrite?.rewriteMainTitle({
        label: `素材分类展示（${TYPE_NAME_MAP[currentType]}）：第 ${pageIndex + 1} 页`,
        append: false,
        brackets: false
    });

    window.Utils.mkdocsRewrite.rewriteToc();
};

// ==================== 初始化 ====================
async function initCorpusPage() {
    const container = document.getElementById('render-area');
    if (!container) return;

    try {
        const corpusResp = await fetch(CORPUS_DATA_URL);

        if (!corpusResp.ok) throw new Error('fetch failed');

        const rawCorpus = await corpusResp.json();

        currentType = window.Utils.url.getSearchParam({
            paramName: "type",
            defaultParam: "education"
        });

        currentType = Object.keys(TYPE_NAME_MAP).includes(currentType) ?
            currentType : "education";

        corpusListData =  rawCorpus
            .filter(item => item.category.toLowerCase() === currentType.toLowerCase())
            .map(item => item.corpus)
            .filter(Boolean);

        if (corpusListData.length === 0) throw new Error('corpus data empty');

        window.Utils.ui.pagination.init({
            totalItems: corpusListData[0].length,
            pageSize: elesPerPage,
            onChange: (page) => {
                renderPage(page - 1, container);
                scrollTo(0, 0);
            }
        });

        renderPage(0, container);

    } catch (err) {
        console.error('加载数据失败', err);
        container.innerHTML = '<p style="color:red">加载失败，请检查网络或数据文件</p>';
    }
}

document.addEventListener('DOMContentLoaded', initCorpusPage);