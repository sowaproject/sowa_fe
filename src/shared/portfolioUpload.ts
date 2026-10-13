export const MAX_PORTFOLIO_IMAGE_BYTES = 100 * 1024 * 1024;
export const MAX_PORTFOLIO_UPLOAD_BYTES = 200 * 1024 * 1024;
export const MAX_PORTFOLIO_UPLOAD_COUNT = 20;

type UploadFile = Pick<File, "name" | "size" | "type">;
const imageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export function getPortfolioUploadError(files: readonly UploadFile[]): string | null {
  if (files.length > MAX_PORTFOLIO_UPLOAD_COUNT) {
    return "한 번에 최대 20장까지 업로드할 수 있습니다. 나눠서 업로드해주세요.";
  }
  let total = 0;
  for (const file of files) {
    if (file.size > MAX_PORTFOLIO_IMAGE_BYTES) {
      return `${file.name}: 사진 한 장은 100MB 이하여야 합니다.`;
    }
    if (!imageTypes.has(file.type.toLowerCase())) {
      return `${file.name}: JPEG, PNG, WEBP 이미지만 업로드할 수 있습니다.`;
    }
    total += file.size;
  }
  if (total > MAX_PORTFOLIO_UPLOAD_BYTES) {
    return "한 번에 업로드하는 사진 합계는 200MB 이하여야 합니다. 나눠서 업로드해주세요.";
  }
  return null;
}
