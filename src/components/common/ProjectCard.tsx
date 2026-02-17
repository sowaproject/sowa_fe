interface ProjectCardProps {
  title: string;
  category: string;
  area: string;
  year: string;
  image: string;
  summary?: string;
}

export default function ProjectCard({ title, category, area, year, image, summary }: ProjectCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-line bg-card shadow-sm">
      <img src={image} alt={title} className="h-52 w-full object-cover" />
      <div className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold tracking-[0.08em] text-text-muted">{category}</p>
          <p className="text-xs text-text-subtle">{year}</p>
        </div>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight text-text-main">{title}</h3>
        {summary ? <p className="mt-2 text-sm leading-relaxed text-text-muted">{summary}</p> : null}
        <p className="mt-4 text-sm text-text-muted">{area}</p>
      </div>
    </article>
  );
}
