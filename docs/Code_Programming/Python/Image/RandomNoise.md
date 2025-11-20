# 随机噪声位图生成

<button onclick="BackToTop('2')"  class="BackToTop">返回 “Python”</button>

---

生成指定尺寸、颜色固定、透明度随机的 PNG 位图

```py
import numpy as np
from PIL import Image

# 图像尺寸
width, height = 500, 500

# 生成随机透明度 (alpha 通道)，范围 0-255
alpha_channel = np.random.randint(0, 256, (height, width), dtype=np.uint8)

# 固定 RGB 为白色 (255, 255, 255)
rgb_channels = np.ones((height, width, 3), dtype=np.uint8) * 255

# 合并 RGB 和 Alpha
rgba_image = np.dstack((rgb_channels, alpha_channel))

# 创建图片并保存
img = Image.fromarray(rgba_image, 'RGBA')
file_path = './random_alpha_noise.png'
img.save(file_path)
```