import { NavLink, Outlet } from "react-router";
import logoImage from "../../assets/sowa_icon.png";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium tracking-[0.02em] transition-colors ${
    isActive ? "text-text-main" : "text-text-subtle hover:text-text-main"
  }`;

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-surface text-text-main">
      <header className="sticky top-0 z-20 border-b border-line bg-card/75 backdrop-blur-sm">
        <div className="mx-auto flex h-20 w-full max-w-310 items-center justify-between px-6">
          <NavLink to="/" className="inline-flex items-center">
            <img src={logoImage} alt="SOWA" className="h-9 w-auto md:h-10" />
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

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-footer py-7 text-center text-sm text-footer-text">
        © 2024 SOWA INTERIOR. All rights reserved.
      </footer>
    </div>
  );
}
