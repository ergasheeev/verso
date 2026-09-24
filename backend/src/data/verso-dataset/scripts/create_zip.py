import os
import zipfile
import shutil
import sys

sys.stdout.reconfigure(encoding='utf-8')

src_dir = r"D:\LoneFoundry-projects\verso-dataset"
desktop_zip = r"C:\Users\User\Desktop\verso-dataset.zip"
local_zip = r"D:\LoneFoundry-projects\verso-dataset.zip"

print(f"Zipping {src_dir} ...")

with zipfile.ZipFile(local_zip, 'w', zipfile.ZIP_DEFLATED, compresslevel=6) as zipf:
    for root, dirs, files in os.walk(src_dir):
        # Do not include the zip file itself if created inside
        for f in files:
            if f.endswith('.zip'): continue
            fp = os.path.join(root, f)
            arcname = os.path.relpath(fp, os.path.dirname(src_dir))
            zipf.write(fp, arcname)

print(f"Created: {local_zip} ({round(os.path.getsize(local_zip)/(1024*1024), 2)} MB)")

# Copy to Desktop
shutil.copy2(local_zip, desktop_zip)
print(f"Copied to Desktop: {desktop_zip} ({round(os.path.getsize(desktop_zip)/(1024*1024), 2)} MB)")

print("ZIP archive created successfully in both locations!")
