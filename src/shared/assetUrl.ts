const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

const apiOrigin = (() => {
  if (!rawApiBaseUrl) {
    return "";
  }

  try {
    return new URL(rawApiBaseUrl).origin;
  } catch {
    return "";
  }
})();

export const resolveAssetUrl = (value?: string | null) => {
  const src = value?.trim();
  if (!src) {
    return "";
  }

  if (/^(https?:|data:|blob:)/i.test(src)) {
    return src;
  }

  if (src.startsWith("//")) {
    return `https:${src}`;
  }

  if (!apiOrigin) {
    return src;
  }

  try {
    return new URL(src, `${apiOrigin}/`).toString();
  } catch {
    return src;
  }
};
