import { Link } from "react-router";

const featuredProjects = [
  {
    id: 1,
    title: "모던 펜트하우스",
    category: "주거공간",
    area: "150m²",
    year: "2024",
    image:
      "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    title: "미니멀 카페",
    category: "상업공간",
    area: "120m²",
    year: "2024",
    image:
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    title: "스칸디나비안 하우스",
    category: "주거공간",
    area: "160m²",
    year: "2023",
    image:
      "https://images.unsplash.com/photo-1616594039964-3c8f6f1aa307?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 4,
    title: "럭셔리 오피스",
    category: "사무공간",
    area: "300m²",
    year: "2023",
    image:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 5,
    title: "부티크 호텔 로비",
    category: "상업공간",
    area: "260m²",
    year: "2023",
    image:
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 6,
    title: "컨템포러리 아파트",
    category: "주거공간",
    area: "130m²",
    year: "2024",
    image:
      "https://images.unsplash.com/photo-1617104551722-3b2d51366400?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="mx-auto w-full max-w-310 px-6 pb-24 pt-12 md:pt-14">
        <div className="grid items-center gap-10 lg:grid-cols-[0.44fr_0.56fr]">
          <div>
            <span className="inline-flex rounded-full bg-[#c8a062] px-4 py-2 text-xs font-semibold text-white">
              Interior Design Studio
            </span>
            <h1 className="mt-8 text-5xl font-medium leading-[1.1] tracking-tight text-slate-900 md:text-4xl">
              당신의 공간을 특별하게
            </h1>
            <p className="mt-7 max-w-105 text-base leading-relaxed text-slate-500">
              감각적인 레이아웃과 균형 잡힌 디테일로 당신의 라이프스타일에 맞는
              공간을 제안합니다.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link
                to="/portfolio"
                className="inline-flex h-11 items-center rounded-full bg-[#c8a062] px-6 text-sm font-semibold text-white transition hover:brightness-95"
              >
                포트폴리오 보기
              </Link>
              <Link
                to="/inquiry"
                className="inline-flex h-11 items-center rounded-full border border-[#c8a062] px-6 text-sm font-semibold text-[#8e6b35] transition hover:bg-[#fff7ea]"
              >
                문의하기
              </Link>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80"
              alt="SOWA hero"
              className="h-135 w-full rounded-tl-[56px] rounded-br-xl object-cover"
            />
            <div className="absolute bottom-6 left-6 rounded-2xl bg-white px-6 py-5 shadow-lg">
              <p className="text-3xl font-bold text-[#c8a062]">10+</p>
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
                Projects
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-310 px-6 pb-28">
        <div className="mb-9 flex items-center justify-between">
          <div>
            <span className="inline-flex rounded-full bg-[#c8a062] px-4 py-2 text-xs font-semibold text-white">
              Featured Projects
            </span>
            <h2 className="mt-5 text-5xl font-medium tracking-tight text-slate-900 md:text-5xl">
              주요 프로젝트
            </h2>
          </div>
          <Link
            to="/portfolio"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            전체 보기 →
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featuredProjects.map((project) => (
            <article
              key={project.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <img
                src={project.image}
                alt={project.title}
                className="h-52 w-full object-cover"
              />
              <div className="p-5">
                <p className="text-xs font-semibold tracking-[0.08em] text-slate-500">
                  {project.category}
                </p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
                  {project.title}
                </h3>
                <div className="mt-4 flex gap-3 text-sm text-slate-500">
                  <span>{project.area}</span>
                  <span>•</span>
                  <span>{project.year}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-11 text-center">
          <Link
            to="/portfolio"
            className="inline-flex h-11 items-center rounded-full border border-[#c8a062] px-7 text-sm font-semibold text-[#8e6b35] transition hover:bg-[#fff7ea]"
          >
            모든 프로젝트 보기
          </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-310 px-6 pb-32">
        <div className="grid gap-10 lg:grid-cols-[0.47fr_0.53fr]">
          <div className="pt-4">
            <span className="inline-flex rounded-full bg-[#c8a062] px-4 py-2 text-xs font-semibold text-white">
              Get In Touch
            </span>
            <h2 className="mt-6 text-5xl font-medium tracking-tight text-slate-900 md:text-6xl">
              인테리어 문의
            </h2>
            <p className="mt-6 max-w-117.5 text-base leading-relaxed text-slate-500">
              새로운 공간 인테리어를 계획하고 계신가요? 원하는 스타일과 예산,
              일정에 맞춰 상담을 도와드리겠습니다.
            </p>
            <ul className="mt-8 space-y-2 text-sm text-slate-600">
              <li>contact@sowainterior.com</li>
              <li>+82 2-1234-5678</li>
              <li>서울특별시 강남구 테헤란로 123</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm md:p-8">
            <form className="space-y-4">
              <label className="block text-xs font-medium text-[#2f4359]">
                이름 <span className="text-red-500">*</span>
                <input
                  type="text"
                  placeholder="이름을 입력해주세요."
                  className="mt-2 h-11 w-full rounded-md border border-slate-300 bg-white px-4 text-sm text-slate-800 placeholder:text-slate-400"
                />
              </label>

              <label className="block text-xs font-medium text-[#2f4359]">
                연락처 <span className="text-red-500">*</span>
                <input
                  type="text"
                  placeholder="연락처를 입력해주세요."
                  className="mt-2 h-11 w-full rounded-md border border-slate-300 bg-white px-4 text-sm text-slate-800 placeholder:text-slate-400"
                />
              </label>

              <div>
                <label className="block text-xs font-medium text-[#2f4359]">
                  비밀번호 <span className="text-red-500">*</span>
                  <input
                    type="password"
                    placeholder="글 조회 시 필요한 비밀번호입니다."
                    className="mt-2 h-11 w-full rounded-md border border-slate-300 bg-white px-4 text-sm text-slate-800 placeholder:text-slate-400"
                  />
                </label>
                <p className="mt-2 text-xs text-slate-500">
                  문의 내용 확인 시 필요합니다.
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-[#2f4359]">연령대</p>
                <div className="mt-2 flex flex-wrap gap-5 text-sm text-slate-700">
                  <label className="inline-flex items-center gap-2">
                    <input type="radio" name="home-age" className="h-4 w-4" />
                    <span>20대</span>
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input type="radio" name="home-age" className="h-4 w-4" />
                    <span>30대</span>
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input type="radio" name="home-age" className="h-4 w-4" />
                    <span>40대</span>
                  </label>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-[#2f4359]">
                  인테리어 종류
                </p>
                <div className="mt-2 flex flex-wrap gap-5 text-sm text-slate-700">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      name="home-interior-type"
                      className="h-4 w-4"
                    />
                    <span>주거</span>
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      name="home-interior-type"
                      className="h-4 w-4"
                    />
                    <span>상업</span>
                  </label>
                </div>
              </div>

              <label className="block text-xs font-medium text-[#2f4359]">
                평수
                <input
                  type="text"
                  placeholder="예: 32평"
                  className="mt-2 h-11 w-full rounded-md border border-slate-300 bg-white px-4 text-sm text-slate-800 placeholder:text-slate-400"
                />
              </label>

              <label className="block text-xs font-medium text-[#2f4359]">
                입주 예상 날짜
                <input
                  type="text"
                  placeholder="예: 2025년 3월"
                  className="mt-2 h-11 w-full rounded-md border border-slate-300 bg-white px-4 text-sm text-slate-800 placeholder:text-slate-400"
                />
              </label>

              <label className="block text-xs font-medium text-[#2f4359]">
                원하는 공사
                <textarea
                  placeholder="원하시는 공사 내용을 입력해주세요."
                  className="mt-2 min-h-28 w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400"
                />
              </label>

              <label className="block text-xs font-medium text-[#2f4359]">
                기타 요구사항
                <textarea
                  placeholder="기타 요구사항을 입력해주세요."
                  className="mt-2 min-h-28 w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400"
                />
              </label>

              <button
                type="button"
                className="mt-2 inline-flex h-12 w-full items-center justify-center rounded-lg bg-[#c8a062] text-sm font-semibold text-white transition hover:brightness-95 cursor-pointer"
              >
                문의 등록
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
