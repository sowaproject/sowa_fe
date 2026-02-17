import ProjectCard from "../components/common/ProjectCard";
import Button from "../components/ui/Button";
import ButtonLink from "../components/ui/ButtonLink";
import Chip from "../components/ui/Chip";
import FieldLabel from "../components/ui/FieldLabel";
import RadioOption from "../components/ui/RadioOption";
import TextArea from "../components/ui/TextArea";
import TextInput from "../components/ui/TextInput";

import { mockFeaturedProjects } from "../mocks/mockProjects.js";

export default function HomePage() {
  return (
    <>
      <section className="mx-auto w-full max-w-310 px-6 pb-24 pt-12 md:pt-14 h-screen">
        <div className="grid items-center gap-10 lg:grid-cols-[0.44fr_0.56fr]">
          <div>
            <Chip>Interior Design Studio</Chip>
            <h1 className="mt-8 text-5xl font-medium leading-[1.1] tracking-tight text-text-main md:text-4xl">
              당신의 공간을 특별하게
            </h1>
            <p className="mt-7 max-w-105 text-base leading-relaxed text-text-muted">
              감각적인 레이아웃과 균형 잡힌 디테일로 당신의 라이프스타일에 맞는
              공간을 제안합니다.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <ButtonLink to="/portfolio" shape="pill" className="h-11 px-6">
                포트폴리오 보기
              </ButtonLink>
              <ButtonLink
                to="/inquiry"
                variant="outline"
                shape="pill"
                className="h-11 px-6"
              >
                문의하기
              </ButtonLink>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80"
              alt="SOWA hero"
              className="h-135 w-full rounded-tl-[56px] rounded-br-xl object-cover"
            />
            <div className="absolute bottom-6 left-6 rounded-2xl bg-card px-6 py-5 shadow-lg">
              <p className="text-3xl font-bold text-accent">10+</p>
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-text-muted">
                Projects
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-310 px-6 pb-28">
        <Chip>Featured Projects</Chip>
        <div className="mb-9 flex items-baseline justify-between">
          <div>
            <h2 className="mt-5 text-5xl font-medium tracking-tight text-text-main md:text-4xl">
              주요 프로젝트
            </h2>
          </div>
          <ButtonLink to="/portfolio" variant="ghost">
            전체 보기 →
          </ButtonLink>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {mockFeaturedProjects.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              category={project.category}
              area={project.area}
              year={project.year}
              image={project.image}
            />
          ))}
        </div>

        <div className="mt-11 text-center">
          <ButtonLink
            to="/portfolio"
            variant="outline"
            shape="pill"
            className="h-11 px-7"
          >
            모든 프로젝트 보기
          </ButtonLink>
        </div>
      </section>

      <section className="mx-auto w-full max-w-310 px-6 pb-32">
        <div className="grid gap-10 lg:grid-cols-[0.47fr_0.53fr]">
          <div className="pt-4">
            <Chip>Get In Touch</Chip>
            <h2 className="mt-6 text-5xl font-medium tracking-tight text-text-main md:text-4xl">
              인테리어 문의
            </h2>
            <p className="mt-6 max-w-117.5 text-base leading-relaxed text-text-muted">
              새로운 공간 인테리어를 계획하고 계신가요? 원하는 스타일과 예산,
              일정에 맞춰 상담을 도와드리겠습니다.
            </p>
            <ul className="mt-8 space-y-2 text-sm text-text-muted">
              <li>contact@sowainterior.com</li>
              <li>+82 2-1234-5678</li>
              <li>서울특별시 강남구 테헤란로 123</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-line bg-card p-7 shadow-sm md:p-8">
            <form className="space-y-4">
              <FieldLabel required>이름</FieldLabel>
              <TextInput
                type="text"
                placeholder="이름을 입력해주세요."
                className="mt-2 h-11 px-4"
              />

              <FieldLabel required>연락처</FieldLabel>
              <TextInput
                type="text"
                placeholder="연락처를 입력해주세요."
                className="mt-2 h-11 px-4"
              />

              <div>
                <FieldLabel required>비밀번호</FieldLabel>
                <TextInput
                  type="password"
                  placeholder="글 조회 시 필요한 비밀번호입니다."
                  className="mt-2 h-11 px-4"
                />
                <p className="mt-2 text-xs text-text-muted">
                  문의 내용 확인 시 필요합니다.
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-text-main">연령대</p>
                <div className="mt-2 flex flex-wrap gap-5 text-sm text-text-main">
                  <RadioOption
                    checked={false}
                    name="home-age"
                    onChange={() => {}}
                    label="20대"
                  />
                  <RadioOption
                    checked={false}
                    name="home-age"
                    onChange={() => {}}
                    label="30대"
                  />
                  <RadioOption
                    checked={false}
                    name="home-age"
                    onChange={() => {}}
                    label="40대"
                  />
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-text-main">
                  인테리어 종류
                </p>
                <div className="mt-2 flex flex-wrap gap-5 text-sm text-text-main">
                  <RadioOption
                    checked={false}
                    name="home-interior-type"
                    onChange={() => {}}
                    label="주거"
                  />
                  <RadioOption
                    checked={false}
                    name="home-interior-type"
                    onChange={() => {}}
                    label="상업"
                  />
                </div>
              </div>

              <FieldLabel>평수</FieldLabel>
              <TextInput
                type="text"
                placeholder="예: 32평"
                className="mt-2 h-11 px-4"
              />

              <FieldLabel>입주 예상 날짜</FieldLabel>
              <TextInput
                type="text"
                placeholder="예: 2025년 3월"
                className="mt-2 h-11 px-4"
              />

              <FieldLabel>원하는 공사</FieldLabel>
              <TextArea
                placeholder="원하시는 공사 내용을 입력해주세요."
                className="mt-2 min-h-28 px-4 py-3"
              />

              <FieldLabel>기타 요구사항</FieldLabel>
              <TextArea
                placeholder="기타 요구사항을 입력해주세요."
                className="mt-2 min-h-28 px-4 py-3"
              />

              <Button type="button" full className="mt-2 h-12 rounded-lg">
                문의 등록
              </Button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
