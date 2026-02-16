import { NavLink, Outlet } from "react-router";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium tracking-[0.02em] transition-colors ${
    isActive ? "text-slate-900" : "text-slate-500 hover:text-slate-900"
  }`;

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-[#f6f5f3] text-slate-800">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/70 backdrop-blur-sm">
        <div className="mx-auto flex h-20 w-full max-w-310 items-center justify-between px-6">
          <NavLink
            to="/"
            className="text-xl font-bold tracking-[0.13em] text-[#1f2d3d] md:text-[2rem]"
          >
            SOWA
          </NavLink>

          <nav className="flex items-center gap-8 md:gap-11">
            <NavLink to="/" end className={linkClass}>
              홈
            </NavLink>
            <NavLink to="/portfolio" className={linkClass}>
              포트폴리오
            </NavLink>
            <NavLink to="/inquiry" className={linkClass}>
              문의하기
            </NavLink>
          </nav>
        </div>
      </header>

      <Outlet />

      <footer className="bg-[#2f4359] py-7 text-center text-sm text-slate-200">
        © 2024 SOWA INTERIOR. All rights reserved.
      </footer>
    </div>
  );
}
