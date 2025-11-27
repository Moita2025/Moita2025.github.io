class TOEFLVocabViewer {
    constructor(options = {}) {
        this.containerId = options.containerId || 'toefl-vocab-container';
        this.pageSize = options.pageSize || 36;
        this.columns = options.columns || 3;
        this.articleParam = options.articleParam || 'article';
        this.dictParam = options.dictParam || 'dict';

        this.words = [];
        this.articleName = '';
        this.collection = 'toefl';
        
        this.init();
    }

    async init() {
        this.readURLParams();

        // 配置通用分页器
        Utils.ui.pagination.init({
            totalItems: 0, // 先占位，加载完再更新
            pageSize: this.pageSize,
            onChange: (page) => {
                this.currentPage = page;
                this.render();
                window.scrollTo(0, 0);
            }
        });

        await this.loadArticleWords();
        if (this.words.length > 0) {
            this.setupPaginationAndRender();
        }
    }

    readURLParams() {
        this.articleName = Utils.url.getSearchParam({ paramName: this.articleParam }) || 'timberline_vegetation_on_mountains';
        this.collection = Utils.url.getSearchParam({ 
            paramName: this.dictParam, 
            map: window.Utils.vocab.WORD_NAME_MAP,
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

            const collectionMap = { junior: 'Junior', senior: 'Senior', cet4: 'CET4', cet6: 'CET6', toefl: 'TOEFL' };
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
        // 更新分页器总页数（自动处理 currentPage 越界）
        Utils.ui.pagination.updateTotalPages(this.words.length, this.pageSize);

        // 同步 URL 中的 page（如果不是第一页）
        Utils.ui.pagination.updateUrl();

        // 强制同步一次输入框和按钮状态
        Utils.ui.pagination.updateUI();

        this.render(); // 首次渲染
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        const pageWords = this.words.slice(
            (Utils.ui.pagination.currentPage - 1) * this.pageSize,
            Utils.ui.pagination.currentPage * this.pageSize
        );

        const collectionDisplayName = window.Utils.vocab.WORD_NAME_MAP[this.collection] || this.collection.toUpperCase();

        let html = `
        <div class="toefl-vocab-header">
            <h2>${this.getDisplayTitle()} <br> ${collectionDisplayName}（第 ${Utils.ui.pagination.currentPage}/${Utils.ui.pagination.totalPages} 页，共 ${this.words.length} 词）</h2>
        </div>
        <div id="paginator">
            <button class="ui-btn prev-page">上一页</button>
            <button class="ui-btn next-page">下一页</button>

            <input
                id="page-input"
                type="number"
                min="1"
                value="1"
                class="ui-int-input page-input"
            />

            <button class="ui-btn go-page">跳转</button>
        </div>
        <button class="ui-btn" id="switch-dict"></button>
        `;

        // 复用你原来超好的表格渲染逻辑（水平填充）
        html += this.renderTable(pageWords);
        container.innerHTML = html;

        // 切换词库按钮
        this.bindSwitchDictButton();
    }

    renderTable(pageWords) {
        const totalRows = Math.ceil(pageWords.length / this.columns);
        let table = `<div class="md-typeset__scrollwrap"><div class="md-typeset__table"><table>
            <thead><tr>${'<th>单词</th>'.repeat(this.columns)}</tr></thead>
            <tbody>`;

        for (let r = 0; r < totalRows; r++) {
            table += `<tr>`;
            for (let c = 0; c < this.columns; c++) {
                const item = pageWords[r * this.columns + c];
                if (item) {
                    const link = `/Languages/English_Vocab/WordDetail/?word=${encodeURIComponent(item.word)}&collection=${this.collection}`;
                    table += `<td><a href="${link}" class="vocab-word-link" target="_blank"><strong>${item.word}</strong></a></td>`;
                } else {
                    table += `<td></td>`;
                }
            }
            table += `</tr>`;
        }
        table += `</tbody></table></div></div>`;
        return table;
    }

    bindSwitchDictButton() {
        const btn = document.getElementById('switch-dict');
        if (!btn) return;
        btn.textContent = `切换词库（当前：${window.Utils.vocab.WORD_NAME_MAP[this.collection] || this.collection.toUpperCase()})`;
        btn.onclick = async () => {
            const keys = Object.keys(window.Utils.vocab.WORD_NAME_MAP);
            const next = keys[(keys.indexOf(this.collection) + 1) % keys.length];

            // 更新 URL + 跳转到第一页
            Utils.url.updateSearchParams({
                dict: next,
                page: null
            }, { usePush: true });

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
        return map[this.articleName] || this.articleName.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    }

    showError(msg) {
        document.getElementById(this.containerId).innerHTML = `
            <div class="md-typeset" style="text-align:center;padding:4rem;color:var(--md-default-fg-color--light)">
                <h3>加载失败</h3>
                <p>${msg}</p>
                <p><a href="../ArtiSubjClasList/">返回分类表</a></p>
            </div>`;
    }
}

// 启动
document.addEventListener("DOMContentLoaded", () => {
    window.toeflViewer = new TOEFLVocabViewer({
        pageSize: 36,
        columns: 3
    });
});