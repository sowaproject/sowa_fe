import { Link } from "react-router";
import Skeleton from "../ui/Skeleton";
import { resolveAssetUrl } from "../../shared/assetUrl";
import { getStoryOpeningSentences } from "../../shared/storyText";

interface ProjectCardProps {
  title: string;
  category: string;
  area?: string;
  location?: string;
  year?: string;
  image: string;
  summary?: string;
  to?: string;
}

export default function ProjectCard({
  title,
  category,
  area,
  location,
  year,
  image,
  summary,
  to,
}: ProjectCardProps) {
  const imageSrc = resolveAssetUrl(image);
  const metadata = [location, area].filter(Boolean);
  const openingSentences = getStoryOpeningSentences(summary);
  const excerpt = openingSentences.join(" ");
  const actionLabel = excerpt ? "공간 이야기 읽기" : "프로젝트 보기";

  const inner = (
    <>
      <img
        src={imageSrc}
        alt={title}
        draggable={false}
        className="h-52 w-full shrink-0 object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold tracking-[0.08em] text-text-muted">{category}</p>
          {year ? <p className="text-xs text-text-subtle">{year}</p> : null}
        </div>
        <h3 className="project-card-title mt-2 line-clamp-2 min-h-[3.75rem] text-2xl font-semibold leading-tight tracking-tight text-text-main">
          {title}
        </h3>
        {excerpt ? (
          <p className="story-copy mt-3 line-clamp-3 text-sm leading-[1.8] text-text-muted">
            {openingSentences.map((sentence, index) => (
              <span key={index} className="story-opening-sentence">
                {index > 0 ? " " : ""}{sentence}
              </span>
            ))}
          </p>
        ) : null}
        <div className="mt-auto pt-5">
          {metadata.length > 0 ? (
            <p className="text-sm text-text-muted">{metadata.join(" · ")}</p>
          ) : null}
          {to ? (
            <span className={`${metadata.length > 0 ? "mt-5" : ""} inline-flex items-center gap-2 border-b border-line-strong pb-1 text-sm font-medium text-text-main transition-colors group-hover:text-accent`}>
              {actionLabel} <span aria-hidden="true">→</span>
            </span>
          ) : null}
        </div>
      </div>
    </>
  );

  if (to) {
    return (
      <Link to={to} aria-label={`${title} ${actionLabel}`} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-sm transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
        {inner}
      </Link>
    );
  }

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-sm">
      {inner}
    </article>
  );
}

export function ProjectCardSkeleton() {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-sm">
      <Skeleton className="h-52 w-full rounded-none" />
      <div className="flex flex-1 flex-col space-y-3 p-5">
        <div className="flex items-center justify-between gap-3">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-12" />
        </div>
        <Skeleton className="h-7 w-4/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </article>
  );
}
