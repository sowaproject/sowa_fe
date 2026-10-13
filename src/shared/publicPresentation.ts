export function parsePortfolioId(id: string | undefined): number | null {
  if (!id || !/^\d+$/.test(id)) return null;
  const value = Number(id);
  return Number.isSafeInteger(value) && value > 0 ? value : null;
}

export function splitHeroTitle(title: string): string[] {
  const phrase = "채워지는 바탕";
  const index = title.indexOf(phrase);
  if (index <= 0) return [title];
  return [title.slice(0, index).trimEnd(), title.slice(index)];
}
