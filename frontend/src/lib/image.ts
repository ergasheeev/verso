/**
 * Resizes a picked file to a square JPEG data URL small enough to store
 * directly on the User row (no object storage is wired up yet — see the
 * schema comment on User.avatarUrl). Cover-crops to a square first so an
 * arbitrary photo doesn't get squashed into an oval avatar circle, then
 * re-encodes at decreasing quality until it fits under `maxBytes`.
 */
export async function fileToAvatarDataUrl(
  file: File,
  { size = 256, maxBytes = 300_000 }: { size?: number; maxBytes?: number } = {}
): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const side = Math.min(bitmap.width, bitmap.height);
  const sx = (bitmap.width - side) / 2;
  const sy = (bitmap.height - side) / 2;

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");
  ctx.drawImage(bitmap, sx, sy, side, side, 0, 0, size, size);

  let quality = 0.85;
  let dataUrl = canvas.toDataURL("image/jpeg", quality);
  // toDataURL has no size target of its own — step quality down until the
  // encoded result actually fits the server's cap, rather than gambling
  // on one fixed quality working for every photo.
  while (dataUrl.length > maxBytes && quality > 0.4) {
    quality -= 0.1;
    dataUrl = canvas.toDataURL("image/jpeg", quality);
  }
  return dataUrl;
}
