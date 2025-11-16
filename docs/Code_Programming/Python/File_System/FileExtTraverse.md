# 查询指定路径下的所有文件后缀名

<button onclick="BackToTop('2')"  class="BackToTop">返回 “Python”</button>

---

- 使用 Python 自带的集合数据结构
- 统一将后缀名转化为小写字母

```py
import os

def collect_extensions(directory):
    extensions = set()

    for root, dirs, files in os.walk(directory):
        for file in files:
            _, ext = os.path.splitext(file)
            if ext:
                extensions.add(ext.lower())  # 加入后缀名，统一小写
    return extensions

# 示例路径
dir_path = "......"

exts = collect_extensions(dir_path)

print("找到的文件后缀名集合：")
print(exts)
```