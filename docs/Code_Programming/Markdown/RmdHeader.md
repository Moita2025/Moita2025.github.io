# RMD 文件标头

<button onclick="BackToTop('2')"  class="BackToTop">返回 “编程”</button>

---

`md` 文件在修改后缀名为 `rmd` 以后，需要手动添加以下标头：

```md
---
title: "标题"
author: "作者"
date: "`r format(Sys.Date())`"
output:
  html_document:
    toc: true
    toc_depth: 3
    toc_float: true
  word_document: default
  pdf_document: default
---
```