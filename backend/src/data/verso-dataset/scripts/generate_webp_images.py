import os
from PIL import Image

# Dataset ildizi shu faylning joylashuvidan hisoblanadi — qattiq yozilgan
# yo'l boshqa kompyuterda ishlamaydi.
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

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
