# 语料素材模糊搜索

<button onclick="BackToTop()" class="BackToTop">返回 “类别”</button>

---

<div class="search-box">
  <input id="word-search-input" class="ui-txt" type="text" placeholder="搜索单词..." />
  <button id="word-search-btn" class="ui-btn">搜索</button>
  <button id="word-clear-btn" class="ui-btn">清空</button>
</div>

<ul id="search-result-list"></ul>

<script src="/assets/javascripts/utils.js"></script>
<script src="/assets/javascripts/third_party/fuse.js"></script>
<script src="/assets/javascripts/init_page/corpus_search_page.js"></script>