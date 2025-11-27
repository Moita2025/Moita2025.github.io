class TOEFLVocabViewer {
    constructor(config = {}) {
        const {
            containerId = 'words-table-container',
            pageSize = 36,
            columns = 3
        } = config;

        this.containerId = containerId;
        this.pageSize = pageSize;
        this.columns = columns;  // 每行显示几个单词（colFactor）

        this.words = [];
        this.articleName = '';
        this.collection = 'toefl';
        
        this.init();
    }

    async init() {
        this.readURLParams();
        await this.loadArticleWords();
        if (this.words.length > 0) {
            this.setupPaginationAndRender();
        } else if (this.words.length === 0 && this.articleName) {
            // 即使没词也显示空表格 + 提示
            this.setupPaginationAndRender();
        }
    }

    readURLParams() {
        this.articleName = Utils.url.getSearchParam({ 
            paramName: "article",
            defaultParam: "timberline_vegetation_on_mountains"
        });
        this.collection = Utils.url.getSearchParam({ 
            paramName: "collection", 
            defaultParam: 'toefl'
        });
    }

    async loadArticleWords() {
        if (!this.articleName) {
            this.showError('未指定文章参数：?article=xxx');
            return;
        }

        let articleTitle = this.articleName;
        try {
            // 1. 查索引获取真实标题
            const idxRes = await fetch('/assets/data/toefl_data/toefl_reading_articles_index.json');
            if (idxRes.ok) {
                const index = await idxRes.json();
                const match = index.find(i => i.ParamName === this.articleName);
                if (match) articleTitle = match.Article || match.KeyName;
            }

            // 2. 加载所有文章生词数据
            const res = await fetch('/assets/data/toefl_data/toefl_reading_articles_words.json');
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const allData = await res.json();

            const articleData = allData.find(item => item.Article === articleTitle);
            if (!articleData) throw new Error(`未找到文章数据：${articleTitle}`);

            const collectionMap = { 
                junior: 'Junior', 
                senior: 'Senior', 
                cet4: 'CET4', 
                cet6: 'CET6', 
                toefl: 'TOEFL' 
            };
            const key = collectionMap[this.collection] || 'TOEFL';
            const wordArray = articleData.Words[key] || [];

            this.words = wordArray.map(w => ({ word: w }));
        } catch (err) {
            this.showError(`加载生词失败<br>文章：${this.articleName}<br>错误：${err.message}`);
            console.error(err);
            this.words = [];
        }
    }

    setupPaginationAndRender() {
        Utils.ui.pagination.init({
            totalItems: 0,
            pageSize: this.pageSize,
            onChange: (page) => {
                this.currentPage = page;
                this.render();
                window.scrollTo(0, 0);
            }
        });

        Utils.ui.pagination.updateTotalPages(this.words.length, this.pageSize);
        Utils.ui.pagination.updateUrl();
        Utils.ui.pagination.updateUI();

        this.render();
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        const currentPage = Utils.ui.pagination.currentPage;
        const collectionDisplayName = window.Utils.vocab.WORD_NAME_MAP[this.collection] || this.collection.toUpperCase();

        const header = document.querySelector(".toefl-vocab-header");
        if (header) {
            header.innerHTML = `
                <h2>${this.getDisplayTitle()} </h2>
                <h2>
                    ${collectionDisplayName}（第 ${currentPage}/${Utils.ui.pagination.totalPages} 
                    页，共 ${this.words.length} 词）
                </h2>
            `;
        }

        // 关键：传完整 this.words + 当前页码，让 renderTable 自己切片！
        window.Utils.ui.renderTable(this.words, currentPage, {
            containerId: this.containerId,
            pageSize: this.pageSize,           // 36
            colFactor: this.columns,           // 3
            headerTitles: ["单词"],
            isColArrange: false,
            emptyCell: '<td></td>',
            renderCell: (item) => `
                <td>
                    ${window.Utils.vocab.getWordLink(item.word, this.collection)}
                </td>
            `
        });

        this.bindSwitchDictButton();
    }

    bindSwitchDictButton() {
        const btn = document.getElementById('switch-dict');
        if (!btn) return;

        const displayName = window.Utils.vocab.WORD_NAME_MAP[this.collection] || this.collection.toUpperCase();
        btn.textContent = `切换词库（当前：${displayName})`;

        btn.onclick = async () => {
            const allKeys = Object.keys(window.Utils.vocab.WORD_NAME_MAP);
            const validKeys = allKeys.filter(k => !['pg', 'sat'].includes(k));
            const currentIdx = validKeys.indexOf(this.collection);
            const next = validKeys[(currentIdx + 1) % validKeys.length];

            Utils.url.updateSearchParams({
                collection: next,
                page: null  // 回到第一页
            });

            this.collection = next;
            Utils.ui.pagination.currentPage = 1;
            await this.loadArticleWords();
            this.setupPaginationAndRender();
        };
    }

    getDisplayTitle() {
        const map = {
            'groundwater_tpo01': 'Groundwater (TPO01)',
            'groundwater_tpo28': 'Groundwater (TPO28)',
        };
        const raw = map[this.articleName] || this.articleName;
        return raw.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    }

    showError(msg) {
        const container = document.getElementById(this.containerId);
        if (container) {
            container.innerHTML = `
                <div style="text-align:center;padding:4rem;color:var(--md-default-fg-color--light)">
                    <h3>加载失败</h3>
                    <p>${msg}</p>
                    <p><a href="../ArtiSubjClasList/">返回分类表</a></p>
                </div>`;
        }
    }
}

// 启动
document.addEventListener("DOMContentLoaded", () => {
    window.toeflViewer = new TOEFLVocabViewer({
        pageSize: 36,
        columns: 3
    });
});