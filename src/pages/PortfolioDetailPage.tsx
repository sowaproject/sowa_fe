import { Link, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { sowaApi } from "../api/sowaApi";
import { resolveAssetUrl } from "../shared/assetUrl";
import Skeleton from "../components/ui/Skeleton";
import { parsePortfolioId } from "../shared/publicPresentation";
import { getStoryParagraphs } from "../shared/storyText";

export default function PortfolioDetailPage() {
  const { id } = useParams<{ id: string }>();
  const portfolioId = parsePortfolioId(id);

  const query = useQuery({
    queryKey: ["public-work", id],
    queryFn: () => {
      if (portfolioId === null) throw new Error("Invalid portfolio ID");
      return sowaApi.public.getWork(portfolioId);
    },
    enabled: portfolioId !== null,
    retry: (failureCount, error) => {
      const status = isAxiosError(error) ? error.response?.status : undefined;
      if (status !== undefined && status >= 400 && status < 500) return false;
      return failureCount < 1;
    },
  });

  const work = query.data;
  const storyParagraphs = getStoryParagraphs(work?.description ?? "");
  const notFound = portfolioId === null ||
    (isAxiosError(query.error) && query.error.response?.status === 404);

  return (
    <div className="min-h-screen bg-surface-muted">
      <section className="mx-auto w-full max-w-310 px-5 py-8 sm:px-6 md:py-16">
        <Link
          to="/works"
          className="mb-8 inline-flex items-center gap-2 text-sm text-text-muted transition-colors hover:text-text-main md:mb-12"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          목록으로
        </Link>

        {query.isLoading && (
          <div className="flex flex-col gap-8 md:flex-row md:gap-12">
            <div className="w-full space-y-4 md:w-56 md:shrink-0">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-20 w-full" />
            </div>
            <div className="flex-1 space-y-4">
              {Array.from({ length: 3 }, (_, i) => (
                <Skeleton key={i} className="h-56 w-full rounded-lg md:h-80" />
              ))}
            </div>
          </div>
        )}

        {(notFound || query.isError) && (
          <div role="alert" className="border-t border-line py-10">
            <h1 data-ui-heading className="text-xl font-medium text-text-main">
              {notFound ? "프로젝트를 찾을 수 없습니다." : "프로젝트를 불러오지 못했습니다."}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-text-muted">
              {notFound
                ? "주소가 잘못되었거나 더 이상 공개되지 않는 프로젝트입니다. 목록에서 다른 프로젝트를 확인해 주세요."
                : "잠시 후 다시 시도해 주세요. 문제가 계속되면 프로젝트 목록으로 돌아가 주세요."}
            </p>
            {!notFound && (
              <button
                type="button"
                disabled={query.isFetching}
                onClick={() => void query.refetch()}
                className="mt-5 rounded-md border border-line-strong px-4 py-2 text-sm text-text-main disabled:opacity-50"
              >
                {query.isFetching ? "불러오는 중…" : "다시 시도"}
              </button>
            )}
          </div>
        )}

        {work && (
          <div className="flex flex-col gap-8 md:flex-row md:gap-16">
            {/* 왼쪽: 개요 */}
            <aside className="md:w-56 md:shrink-0">
              <div className={storyParagraphs.length === 0 ? "md:sticky md:top-24" : undefined}>
                <h1 className="text-xl font-medium tracking-[-0.01em] text-text-main md:text-2xl">
                  {work.title}
                </h1>
                <p className="mt-2 text-sm text-text-muted">
                  {work.category?.name ?? "미분류"}
                </p>
                {work.year || work.location || work.area ? (
                  <dl className="mt-6 space-y-3 border-t border-line pt-5 text-sm">
                    {work.year ? (
                      <div>
                        <dt className="text-xs font-semibold tracking-[0.08em] text-text-subtle">
                          YEAR
                        </dt>
                        <dd className="mt-1 text-text-main">{work.year}</dd>
                      </div>
                    ) : null}
                    {work.location ? (
                      <div>
                        <dt className="text-xs font-semibold tracking-[0.08em] text-text-subtle">
                          LOCATION
                        </dt>
                        <dd className="mt-1 break-words text-text-main">{work.location}</dd>
                      </div>
                    ) : null}
                    {work.area ? (
                      <div>
                        <dt className="text-xs font-semibold tracking-[0.08em] text-text-subtle">
                          AREA
                        </dt>
                        <dd className="mt-1 text-text-main">{work.area}</dd>
                      </div>
                    ) : null}
                  </dl>
                ) : null}
                {storyParagraphs.length > 0 && (
                  <section aria-labelledby="project-story-title" className="mt-6">
                    <h2 data-ui-heading id="project-story-title" className="text-xs font-medium tracking-[0.05em] text-text-subtle">
                      공간 이야기
                    </h2>
                    <div className="mt-3 space-y-4">
                      {storyParagraphs.map((paragraph, index) => (
                        <p key={index} className="story-copy text-sm leading-[1.85] text-text-muted">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </aside>

            {/* 오른쪽: 이미지 목록 */}
            <div className="flex-1 space-y-4">
              {work.images.length > 0
                ? work.images.map((img) => (
                    <img
                      key={img.id}
                      src={resolveAssetUrl(img.image)}
                      alt={work.title}
                      className="w-full rounded-lg object-cover"
                    />
                  ))
                : work.thumbnail && (
                    <img
                      src={resolveAssetUrl(work.thumbnail)}
                      alt={work.title}
                      className="w-full rounded-lg object-cover"
                    />
                  )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
