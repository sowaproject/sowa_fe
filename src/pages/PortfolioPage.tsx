import { useMemo, useState } from "react";

interface PortfolioItem {
  id: number;
  title: string;
  category: "주거" | "상업" | "오피스";
  year: string;
  area: string;
  summary: string;
  image: string;
}

const categories = ["전체", "주거", "상업", "오피스"] as const;

const portfolioItems: PortfolioItem[] = [
  {
    id: 1,
    title: "모던 펜트하우스",
    category: "주거",
    year: "2024",
    area: "150m²",
    summary: "도심 전망을 살린 개방형 레이아웃과 차분한 우드톤의 조화",
    image: "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    title: "미니멀 카페",
    category: "상업",
    year: "2024",
    area: "120m²",
    summary: "동선 최적화를 고려한 바 동선과 따뜻한 간접조명 구성",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    title: "스칸디 하우스",
    category: "주거",
    year: "2023",
    area: "160m²",
    summary: "내추럴 톤 중심의 거실 확장형 설계와 수납 디테일 강화",
    image: "https://images.unsplash.com/photo-1616594039964-3c8f6f1aa307?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 4,
    title: "럭셔리 오피스",
    category: "오피스",
    year: "2023",
    area: "300m²",
    summary: "클라이언트 라운지와 업무 공간의 밸런스를 맞춘 고급형 설계",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 5,
    title: "부티크 호텔 로비",
    category: "상업",
    year: "2023",
    area: "260m²",
    summary: "아트월과 대형 조명을 활용한 브랜드 아이덴티티 강화",
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 6,
    title: "컨템포러리 아파트",
    category: "주거",
    year: "2024",
    area: "130m²",
    summary: "거실-다이닝 일체형 배치와 무드 조명 중심의 공간 연출",
    image: "https://images.unsplash.com/photo-1617104551722-3b2d51366400?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 7,
    title: "브랜드 쇼룸",
    category: "상업",
    year: "2022",
    area: "180m²",
    summary: "제품 전시 존과 체험 존을 분리한 체류형 쇼룸 구조",
    image: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 8,
    title: "프리미엄 업무공간",
    category: "오피스",
    year: "2024",
    area: "210m²",
    summary: "팀 협업 구역과 집중 부스를 조합한 하이브리드 오피스",
    image: "https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 9,
    title: "내추럴 리빙룸",
    category: "주거",
    year: "2022",
    area: "110m²",
    summary: "우드/패브릭 텍스처를 활용한 가족 중심 리빙 인테리어",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function PortfolioPage() {
  const [selectedCategory, setSelectedCategory] = useState<(typeof categories)[number]>("전체");

  const filteredItems = useMemo(() => {
    if (selectedCategory === "전체") {
      return portfolioItems;
    }

    return portfolioItems.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="bg-[#ececec]">
      <section className="border-y border-slate-200 px-6 py-16 text-center md:py-20">
        <h1 className="text-[56px] font-medium tracking-[-0.01em] text-[#2f4359] md:text-[62px]">포트폴리오</h1>
      </section>

      <section className="mx-auto w-full max-w-[1240px] px-6 py-14 md:py-16">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-600">총 {filteredItems.length}개의 프로젝트</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`inline-flex h-10 items-center rounded-full px-5 text-sm font-semibold transition ${
                  selectedCategory === category
                    ? "bg-[#c8a062] text-white"
                    : "border border-[#c8a062] bg-transparent text-[#8e6b35] hover:bg-[#fff7ea]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map((project) => (
            <article key={project.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <img src={project.image} alt={project.title} className="h-52 w-full object-cover" />
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold tracking-[0.08em] text-slate-500">{project.category}</p>
                  <p className="text-xs text-slate-400">{project.year}</p>
                </div>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{project.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{project.summary}</p>
                <p className="mt-4 text-sm text-slate-500">{project.area}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
