# 阅读文章 单词

<button onclick="BackToTop('2')" class="BackToTop">返回 “托福”</button>

---

<div class="toefl-vocab-header"></div>
<div id="paginator">
    <button class="ui-btn prev-page">上一页</button>
    <button class="ui-btn next-page">下一页</button>
    <input
        id="page-input" type="number"
        min="1" value="1"
        class="ui-int-input page-input"
    />
    <button class="ui-btn go-page">跳转</button>
    <button class="ui-btn" id="switch-dict"></button>
</div>
<div id="words-table-container" style="text-align:center;"></div>

<script src="/assets/javascripts/utils.js"></script>
<script src="/assets/javascripts/init_toefl_reading_vocab.js"></script>