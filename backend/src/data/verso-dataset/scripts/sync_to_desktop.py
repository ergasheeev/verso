import os
import shutil

src_base = r"D:\LoneFoundry-projects\verso-dataset"
dst_base = r"C:\Users\User\Desktop\Yangi_Papka"

os.makedirs(dst_base, exist_ok=True)

# 1. Output files
out_dst = os.path.join(dst_base, "01_Output_Tayyor_Fayllar")
os.makedirs(out_dst, exist_ok=True)
for fn in os.listdir(os.path.join(src_base, "output")):
    s = os.path.join(src_base, "output", fn)
    if os.path.isfile(s):
        shutil.copy2(s, os.path.join(out_dst, fn))

# 2. Country Images
c_img_dst = os.path.join(dst_base, "02_Rasmlar_Mamlakatlar")
os.makedirs(c_img_dst, exist_ok=True)
for fn in os.listdir(os.path.join(src_base, "C_images", "countries")):
    shutil.copy2(os.path.join(src_base, "C_images", "countries", fn), os.path.join(c_img_dst, fn))

# 3. Place Images
p_img_dst = os.path.join(dst_base, "03_Rasmlar_Joylar")
os.makedirs(p_img_dst, exist_ok=True)
for fn in os.listdir(os.path.join(src_base, "C_images", "places")):
    shutil.copy2(os.path.join(src_base, "C_images", "places", fn), os.path.join(p_img_dst, fn))

# 4. License and Documentation
doc_dst = os.path.join(dst_base, "04_Litsenziyalar_Hujjatlar")
os.makedirs(doc_dst, exist_ok=True)
for fn in ["credits.csv", "download-list.txt", "naming-guide.txt"]:
    s = os.path.join(src_base, "C_images", fn)
    if os.path.isfile(s):
        shutil.copy2(s, os.path.join(doc_dst, fn))

for fn in ["README.md", "RULES.md", "PROGRESS.md"]:
    s = os.path.join(src_base, fn)
    if os.path.isfile(s):
        shutil.copy2(s, os.path.join(doc_dst, fn))

print(f"Successfully organized and populated Desktop folder: {dst_base}")
