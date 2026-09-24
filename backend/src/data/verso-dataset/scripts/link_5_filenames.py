import os
import shutil
import sys

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = r"D:\LoneFoundry-projects\verso-dataset"
places_dir = os.path.join(BASE_DIR, "C_images", "places")
credits_file = os.path.join(BASE_DIR, "C_images", "credits.csv")
download_list_file = os.path.join(BASE_DIR, "C_images", "download-list.txt")

pairs = [
    ('az-lahij-coppersmith', 'az-lahij'),
    ('in-pushkar-fair', 'in-pushkar'),
    ('vn-ba-dinh-square', 'vn-ba-dinh'),
    ('vn-ben-thanh-market', 'vn-ben-thanh'),
    ('vn-my-son-sanctuary', 'vn-my-son'),
]

for src_name, dst_name in pairs:
    # copy jpg
    src_jpg = os.path.join(places_dir, f"{src_name}.jpg")
    dst_jpg = os.path.join(places_dir, f"{dst_name}.jpg")
    if os.path.exists(src_jpg):
        shutil.copy2(src_jpg, dst_jpg)
        print(f"Copied {src_name}.jpg -> {dst_name}.jpg")

    # copy webp
    src_webp = os.path.join(places_dir, f"{src_name}.webp")
    dst_webp = os.path.join(places_dir, f"{dst_name}.webp")
    if os.path.exists(src_webp):
        shutil.copy2(src_webp, dst_webp)
        print(f"Copied {src_name}.webp -> {dst_name}.webp")

# Update credits.csv
with open(credits_file, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for l in lines:
    new_lines.append(l)
    for src_name, dst_name in pairs:
        if l.startswith(f"{src_name}.jpg,"):
            replaced = l.replace(f"{src_name}.jpg,", f"{dst_name}.jpg,")
            new_lines.append(replaced)

with open(credits_file, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

# Update download-list.txt
with open(download_list_file, 'r', encoding='utf-8') as f:
    dl_lines = f.readlines()

new_dl = []
for l in dl_lines:
    new_dl.append(l)
    for src_name, dst_name in pairs:
        if l.startswith(f"{src_name}.jpg |"):
            replaced = l.replace(f"{src_name}.jpg |", f"{dst_name}.jpg |")
            new_dl.append(replaced)

with open(download_list_file, 'w', encoding='utf-8') as f:
    f.writelines(new_dl)

print("Linked and updated credits and download-list!")
