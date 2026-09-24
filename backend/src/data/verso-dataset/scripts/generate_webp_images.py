import os
from PIL import Image

BASE_DIR = r"D:\LoneFoundry-projects\verso-dataset"

for sub in ["countries", "places"]:
    img_dir = os.path.join(BASE_DIR, "C_images", sub)
    if not os.path.exists(img_dir): continue
    count = 0
    for fn in os.listdir(img_dir):
        if fn.endswith('.jpg'):
            jpg_path = os.path.join(img_dir, fn)
            webp_path = os.path.join(img_dir, fn.replace('.jpg', '.webp'))
            with Image.open(jpg_path) as img:
                img.save(webp_path, "WEBP", quality=85, method=6)
            count += 1
    print(f"Generated {count} WebP images in C_images/{sub}")

print("All WebP conversions completed successfully!")
