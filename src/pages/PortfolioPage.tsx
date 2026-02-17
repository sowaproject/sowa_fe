import { useMemo, useState } from "react";
import ProjectCard from "../components/common/ProjectCard";
import Button from "../components/ui/Button";
import { mockFeaturedProjects } from "../mocks/mockProjects";

const categories = ["전체", "주거", "상업", "오피스"] as const;

export default function PortfolioPage() {
  const [selectedCategory, setSelectedCategory] =
    useState<(typeof categories)[number]>("전체");

  const filteredItems = useMemo(() => {
    if (selectedCategory === "전체") {
      return mockFeaturedProjects;
    }

    return mockFeaturedProjects.filter(
      (item) => item.category === selectedCategory,
    );
  }, [selectedCategory]);

  return (
    <div className="bg-surface-muted">
      <section className="border-y border-line px-6 py-8 text-center md:py-10">
        <h1 className="text-2xl font-medium tracking-[-0.01em] text-text-main md:text-4xl">
          포트폴리오
        </h1>
      </section>

      <section className="mx-auto w-full max-w-310 px-6 py-14 md:py-16">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-text-muted">
            총 {filteredItems.length}개의 프로젝트
          </p>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                shape="pill"
                variant={selectedCategory === category ? "brand" : "outline"}
                className="h-10 px-5"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              category={project.category}
              area={project.area}
              year={project.year}
              image={project.image}
              summary={project.summary}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
