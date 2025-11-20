import json
import os

def define_env(env):
    @env.macro
    def load_json(path):
        """
        从 docs/ 目录加载 JSON 文件。
        例如调用： load_json('data/四级词汇_字母顺序版.json')
        """
        docs_dir = env.conf['docs_dir']
        full_path = os.path.join(docs_dir, path)

        with open(full_path, 'r', encoding='utf-8') as f:
            return json.load(f)