import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { sowaApi } from "../api/sowaApi";
import type { DashboardStats, InquiryDetail, SiteSettings } from "../api/types";
import { parseErrorMessage } from "../shared/error";

interface AdminPageProps {
  onError: (message: string) => void;
  onOk: (message: string) => void;
}

const toList = <T,>(value: unknown): T[] => {
  if (Array.isArray(value)) {
    return value as T[];
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "results" in value &&
    Array.isArray((value as { results?: unknown }).results)
  ) {
    return (value as { results: T[] }).results;
  }

  return [];
};

const isStats = (value: unknown): value is DashboardStats => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const target = value as Record<string, unknown>;
  return (
    typeof target.total_inquiries === "number" &&
    typeof target.pending_inquiries === "number" &&
    typeof target.replied_inquiries === "number" &&
    typeof target.total_portfolio === "number"
  );
};

export default function AdminPage({ onError, onOk }: AdminPageProps) {
  const queryClient = useQueryClient();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [categoryForm, setCategoryForm] = useState({ name: "", order: "0", editId: "" });
  const [portfolioForm, setPortfolioForm] = useState({
    id: "",
    category_id: "",
    title: "",
    description: "",
    is_featured: false,
    order: "0",
    image: null as File | null,
  });
  const [selectedAdminInquiryId, setSelectedAdminInquiryId] = useState("");
  const [commentText, setCommentText] = useState("");
  const [settingsForm, setSettingsForm] = useState({
    site_title: "",
    hero_title: "",
    hero_subtitle: "",
    logo_image: null as File | null,
    hero_image: null as File | null,
  });

  const sessionCheckQuery = useQuery({
    queryKey: ["admin-session-check"],
    queryFn: sowaApi.admin.getStats,
    retry: false,
  });

  useEffect(() => {
    if (sessionCheckQuery.isSuccess) {
      setIsAuthenticated(true);
    }

    if (sessionCheckQuery.isError) {
      setIsAuthenticated(false);
    }
  }, [sessionCheckQuery.isError, sessionCheckQuery.isSuccess]);

  const statsQuery = useQuery({
    queryKey: ["admin-stats"],
    queryFn: sowaApi.admin.getStats,
    enabled: isAuthenticated,
  });

  const categoryQuery = useQuery({
    queryKey: ["admin-categories"],
    queryFn: sowaApi.admin.listCategories,
    enabled: isAuthenticated,
  });

  const portfolioQuery = useQuery({
    queryKey: ["admin-portfolio"],
    queryFn: sowaApi.admin.listPortfolio,
    enabled: isAuthenticated,
  });

  const adminInquiryQuery = useQuery({
    queryKey: ["admin-inquiry"],
    queryFn: sowaApi.admin.listInquiry,
    enabled: isAuthenticated,
  });

  const adminInquiryDetailQuery = useQuery({
    queryKey: ["admin-inquiry-detail", selectedAdminInquiryId],
    queryFn: () => sowaApi.admin.getInquiry(Number(selectedAdminInquiryId)),
    enabled: isAuthenticated && selectedAdminInquiryId.trim().length > 0,
  });

  const settingsQuery = useQuery<SiteSettings>({
    queryKey: ["admin-settings"],
    queryFn: sowaApi.admin.getSettings,
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (!settingsQuery.data) {
      return;
    }

    setSettingsForm((prev) => ({
      ...prev,
      site_title: settingsQuery.data.site_title ?? "",
      hero_title: settingsQuery.data.hero_title ?? "",
      hero_subtitle: settingsQuery.data.hero_subtitle ?? "",
    }));
  }, [settingsQuery.data]);

  const loginMutation = useMutation({
    mutationFn: sowaApi.admin.login,
    onSuccess: (data) => {
      setIsAuthenticated(true);
      onOk(data.detail || "로그인 성공");
      queryClient.invalidateQueries({ queryKey: ["admin-session-check"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      queryClient.invalidateQueries({ queryKey: ["admin-portfolio"] });
      queryClient.invalidateQueries({ queryKey: ["admin-inquiry"] });
      queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
    },
    onError: (error) => onError(parseErrorMessage(error)),
  });

  const logoutMutation = useMutation({
    mutationFn: sowaApi.admin.logout,
    onSuccess: (data) => {
      setIsAuthenticated(false);
      onOk(data.detail || "로그아웃 성공");
      queryClient.removeQueries({ queryKey: ["admin-stats"] });
      queryClient.removeQueries({ queryKey: ["admin-categories"] });
      queryClient.removeQueries({ queryKey: ["admin-portfolio"] });
      queryClient.removeQueries({ queryKey: ["admin-inquiry"] });
      queryClient.removeQueries({ queryKey: ["admin-settings"] });
    },
    onError: (error) => onError(parseErrorMessage(error)),
  });

  const createCategoryMutation = useMutation({
    mutationFn: sowaApi.admin.createCategory,
    onSuccess: () => {
      onOk("카테고리 생성 완료");
      categoryQuery.refetch();
    },
    onError: (error) => onError(parseErrorMessage(error)),
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, name, order }: { id: number; name: string; order?: number }) =>
      sowaApi.admin.updateCategory(id, { name, order }),
    onSuccess: () => {
      onOk("카테고리 수정 완료");
      categoryQuery.refetch();
    },
    onError: (error) => onError(parseErrorMessage(error)),
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: sowaApi.admin.deleteCategory,
    onSuccess: () => {
      onOk("카테고리 삭제 완료");
      categoryQuery.refetch();
    },
    onError: (error) => onError(parseErrorMessage(error)),
  });

  const createPortfolioMutation = useMutation({
    mutationFn: sowaApi.admin.createPortfolio,
    onSuccess: () => {
      onOk("포트폴리오 생성 완료");
      portfolioQuery.refetch();
    },
    onError: (error) => onError(parseErrorMessage(error)),
  });

  const updatePortfolioMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Parameters<typeof sowaApi.admin.updatePortfolio>[1] }) =>
      sowaApi.admin.updatePortfolio(id, payload),
    onSuccess: () => {
      onOk("포트폴리오 수정 완료");
      portfolioQuery.refetch();
    },
    onError: (error) => onError(parseErrorMessage(error)),
  });

  const deletePortfolioMutation = useMutation({
    mutationFn: sowaApi.admin.deletePortfolio,
    onSuccess: () => {
      onOk("포트폴리오 삭제 완료");
      portfolioQuery.refetch();
    },
    onError: (error) => onError(parseErrorMessage(error)),
  });

  const deleteInquiryMutation = useMutation({
    mutationFn: sowaApi.admin.deleteInquiry,
    onSuccess: () => {
      onOk("문의 삭제 완료");
      adminInquiryQuery.refetch();
      setSelectedAdminInquiryId("");
    },
    onError: (error) => onError(parseErrorMessage(error)),
  });

  const addCommentMutation = useMutation({
    mutationFn: ({ inquiryId, content }: { inquiryId: number; content: string }) =>
      sowaApi.admin.createComment(inquiryId, content),
    onSuccess: () => {
      onOk("답변 등록 완료");
      setCommentText("");
      adminInquiryDetailQuery.refetch();
      adminInquiryQuery.refetch();
    },
    onError: (error) => onError(parseErrorMessage(error)),
  });

  const deleteCommentMutation = useMutation({
    mutationFn: sowaApi.admin.deleteComment,
    onSuccess: () => {
      onOk("답변 삭제 완료");
      adminInquiryDetailQuery.refetch();
      adminInquiryQuery.refetch();
    },
    onError: (error) => onError(parseErrorMessage(error)),
  });

  const updateSettingsMutation = useMutation({
    mutationFn: sowaApi.admin.updateSettings,
    onSuccess: () => {
      onOk("사이트 설정 수정 완료");
      settingsQuery.refetch();
    },
    onError: (error) => onError(parseErrorMessage(error)),
  });

  const submitLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!loginForm.username || !loginForm.password) {
      onError("관리자 로그인은 username/password 모두 필수입니다.");
      return;
    }

    loginMutation.mutate(loginForm);
  };

  const submitCategory = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!categoryForm.name.trim()) {
      onError("카테고리 name은 필수입니다.");
      return;
    }

    const orderValue = Number(categoryForm.order || "0");

    if (categoryForm.editId) {
      updateCategoryMutation.mutate({ id: Number(categoryForm.editId), name: categoryForm.name, order: orderValue });
      return;
    }

    createCategoryMutation.mutate({ name: categoryForm.name, order: orderValue });
  };

  const submitPortfolioCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!portfolioForm.title || !portfolioForm.image) {
      onError("포트폴리오 생성은 title/image가 필수입니다.");
      return;
    }

    createPortfolioMutation.mutate({
      category_id: portfolioForm.category_id ? Number(portfolioForm.category_id) : null,
      title: portfolioForm.title,
      image: portfolioForm.image,
      description: portfolioForm.description,
      is_featured: portfolioForm.is_featured,
      order: Number(portfolioForm.order || "0"),
    });
  };

  const submitPortfolioUpdate = () => {
    if (!portfolioForm.id) {
      onError("수정할 포트폴리오 ID를 입력해주세요.");
      return;
    }

    updatePortfolioMutation.mutate({
      id: Number(portfolioForm.id),
      payload: {
        category_id: portfolioForm.category_id ? Number(portfolioForm.category_id) : null,
        title: portfolioForm.title,
        image: portfolioForm.image ?? undefined,
        description: portfolioForm.description,
        is_featured: portfolioForm.is_featured,
        order: Number(portfolioForm.order || "0"),
      },
    });
  };

  const submitSettings = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    updateSettingsMutation.mutate({
      site_title: settingsForm.site_title,
      hero_title: settingsForm.hero_title,
      hero_subtitle: settingsForm.hero_subtitle,
      logo_image: settingsForm.logo_image,
      hero_image: settingsForm.hero_image,
    });
  };

  const categoryList = toList<{ id: number; name: string; order?: number }>(categoryQuery.data);
  const portfolioList = toList<{
    id: number;
    title: string;
    category?: { name?: string };
    is_featured?: boolean;
  }>(portfolioQuery.data);
  const inquiryList = toList<{ id: number; name: string; has_reply: boolean }>(adminInquiryQuery.data);

  const statsData = isStats(statsQuery.data) ? statsQuery.data : undefined;
  const inquiryDetail =
    typeof adminInquiryDetailQuery.data === "object" && adminInquiryDetailQuery.data !== null
      ? (adminInquiryDetailQuery.data as InquiryDetail)
      : undefined;
  const inquiryComments = Array.isArray(inquiryDetail?.comments) ? inquiryDetail.comments : [];

  if (!isAuthenticated) {
    return (
      <section className="rounded border border-slate-300 bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold">관리자 로그인</h2>
        <p className="mb-3 text-sm text-slate-600">/admin 접근 시 로그인 후에만 관리 페이지를 표시합니다.</p>
        <form className="flex flex-wrap gap-2" onSubmit={submitLogin}>
          <input
            className="rounded border px-3 py-2"
            placeholder="username"
            value={loginForm.username}
            onChange={(event) => setLoginForm((prev) => ({ ...prev, username: event.target.value }))}
          />
          <input
            className="rounded border px-3 py-2"
            placeholder="password"
            type="password"
            value={loginForm.password}
            onChange={(event) => setLoginForm((prev) => ({ ...prev, password: event.target.value }))}
          />
          <button className="rounded bg-slate-900 px-4 py-2 text-white" type="submit">
            로그인
          </button>
        </form>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded border border-slate-300 bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold">B-2. 관리자 인증</h2>
        <div className="flex gap-2">
          <button className="rounded border px-4 py-2" onClick={() => logoutMutation.mutate()} type="button">
            로그아웃
          </button>
        </div>
      </section>

      <section className="rounded border border-slate-300 bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold">B-1. 대시보드 통계</h2>
        <button className="mb-3 rounded border px-3 py-2" onClick={() => statsQuery.refetch()} type="button">
          통계 새로고침
        </button>
        <StatsGrid stats={statsData} />
      </section>

      <section className="rounded border border-slate-300 bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold">B-3. 카테고리 관리</h2>
        <form className="mb-3 flex flex-wrap gap-2" onSubmit={submitCategory}>
          <input className="rounded border px-3 py-2" placeholder="editId(비우면 생성)" value={categoryForm.editId} onChange={(event) => setCategoryForm((prev) => ({ ...prev, editId: event.target.value }))} />
          <input className="rounded border px-3 py-2" placeholder="name *" value={categoryForm.name} onChange={(event) => setCategoryForm((prev) => ({ ...prev, name: event.target.value }))} />
          <input className="rounded border px-3 py-2" placeholder="order" value={categoryForm.order} onChange={(event) => setCategoryForm((prev) => ({ ...prev, order: event.target.value }))} />
          <button className="rounded bg-slate-900 px-3 py-2 text-white" type="submit">저장</button>
        </form>

        <ul className="space-y-2">
          {categoryList.map((category) => (
            <li key={category.id} className="flex items-center justify-between rounded border p-2 text-sm">
              <span>#{category.id} {category.name} (order: {category.order ?? 0})</span>
              <div className="flex gap-2">
                <button className="rounded border px-2 py-1" onClick={() => setCategoryForm({ editId: String(category.id), name: category.name, order: String(category.order ?? 0) })} type="button">편집값 채우기</button>
                <button className="rounded border px-2 py-1 text-rose-700" onClick={() => deleteCategoryMutation.mutate(category.id)} type="button">삭제</button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded border border-slate-300 bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold">B-4. 포트폴리오 관리 (multipart)</h2>
        <form className="grid gap-2 md:grid-cols-2" onSubmit={submitPortfolioCreate}>
          <input className="rounded border px-3 py-2" placeholder="id(수정시에만 사용)" value={portfolioForm.id} onChange={(event) => setPortfolioForm((prev) => ({ ...prev, id: event.target.value }))} />
          <input className="rounded border px-3 py-2" placeholder="category_id" value={portfolioForm.category_id} onChange={(event) => setPortfolioForm((prev) => ({ ...prev, category_id: event.target.value }))} />
          <input className="rounded border px-3 py-2" placeholder="title *" value={portfolioForm.title} onChange={(event) => setPortfolioForm((prev) => ({ ...prev, title: event.target.value }))} />
          <input className="rounded border px-3 py-2" placeholder="order" value={portfolioForm.order} onChange={(event) => setPortfolioForm((prev) => ({ ...prev, order: event.target.value }))} />
          <textarea className="rounded border px-3 py-2 md:col-span-2" placeholder="description" value={portfolioForm.description} onChange={(event) => setPortfolioForm((prev) => ({ ...prev, description: event.target.value }))} />

          <label className="flex items-center gap-2 text-sm">
            <input checked={portfolioForm.is_featured} onChange={(event) => setPortfolioForm((prev) => ({ ...prev, is_featured: event.target.checked }))} type="checkbox" />
            is_featured
          </label>

          <input className="rounded border px-3 py-2" onChange={(event) => setPortfolioForm((prev) => ({ ...prev, image: event.target.files?.[0] ?? null }))} type="file" />

          <div className="flex gap-2 md:col-span-2">
            <button className="rounded bg-slate-900 px-3 py-2 text-white" type="submit">생성</button>
            <button className="rounded border px-3 py-2" onClick={submitPortfolioUpdate} type="button">수정(부분수정)</button>
            <button className="rounded border px-3 py-2 text-rose-700" onClick={() => {
              if (!portfolioForm.id) {
                onError("삭제할 포트폴리오 ID를 입력해주세요.");
                return;
              }
              deletePortfolioMutation.mutate(Number(portfolioForm.id));
            }} type="button">삭제</button>
          </div>
        </form>

        <ul className="mt-4 space-y-2">
          {portfolioList.map((item) => (
            <li key={item.id} className="rounded border p-2 text-sm">
              #{item.id} {item.title} / category: {item.category?.name ?? "-"} / featured: {String(Boolean(item.is_featured))}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded border border-slate-300 bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold">B-5. 문의/답변 관리</h2>

        <div className="mb-3 flex flex-wrap gap-2">
          <input className="rounded border px-3 py-2" placeholder="문의 ID" value={selectedAdminInquiryId} onChange={(event) => setSelectedAdminInquiryId(event.target.value)} />
          <button className="rounded border px-3 py-2" onClick={() => adminInquiryDetailQuery.refetch()} type="button">상세 조회</button>
          <button className="rounded border px-3 py-2 text-rose-700" onClick={() => {
            if (!selectedAdminInquiryId) {
              onError("삭제할 문의 ID를 입력해주세요.");
              return;
            }
            deleteInquiryMutation.mutate(Number(selectedAdminInquiryId));
          }} type="button">문의 삭제</button>
        </div>

        <div className="mb-4 grid gap-4 md:grid-cols-2">
          <ul className="space-y-2">
            {inquiryList.map((item) => (
              <li key={item.id} className="rounded border p-2 text-sm">
                #{item.id} {item.name} / reply: {String(item.has_reply)}
              </li>
            ))}
          </ul>

          <div>
            {inquiryDetail ? (
              <>
                <InquiryDetailCard inquiry={inquiryDetail} />
                <form className="mt-2 space-y-2" onSubmit={(event) => {
                  event.preventDefault();
                  if (!selectedAdminInquiryId || !commentText.trim()) {
                    onError("답변 등록에는 문의 ID와 내용이 필요합니다.");
                    return;
                  }
                  addCommentMutation.mutate({ inquiryId: Number(selectedAdminInquiryId), content: commentText });
                }}>
                  <textarea className="w-full rounded border px-3 py-2" placeholder="답변 내용" value={commentText} onChange={(event) => setCommentText(event.target.value)} />
                  <button className="rounded bg-slate-900 px-3 py-2 text-white" type="submit">답변 등록</button>
                </form>

                <div className="mt-2 space-y-1 text-sm">
                  {inquiryComments.map((comment) => (
                    <div key={comment.id} className="flex items-center justify-between rounded border px-2 py-1">
                      <span>#{comment.id} {comment.content}</span>
                      <button className="rounded border px-2 py-1 text-rose-700" onClick={() => deleteCommentMutation.mutate(comment.id)} type="button">답변 삭제</button>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-sm text-slate-600">문의 ID를 입력하고 상세 조회를 실행하세요.</div>
            )}
          </div>
        </div>
      </section>

      <section className="rounded border border-slate-300 bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold">B-6. 사이트 설정 (multipart)</h2>

        <form className="grid gap-2 md:grid-cols-2" onSubmit={submitSettings}>
          <input className="rounded border px-3 py-2" placeholder="site_title" value={settingsForm.site_title} onChange={(event) => setSettingsForm((prev) => ({ ...prev, site_title: event.target.value }))} />
          <input className="rounded border px-3 py-2" placeholder="hero_title" value={settingsForm.hero_title} onChange={(event) => setSettingsForm((prev) => ({ ...prev, hero_title: event.target.value }))} />
          <input className="rounded border px-3 py-2 md:col-span-2" placeholder="hero_subtitle" value={settingsForm.hero_subtitle} onChange={(event) => setSettingsForm((prev) => ({ ...prev, hero_subtitle: event.target.value }))} />
          <input className="rounded border px-3 py-2" onChange={(event: ChangeEvent<HTMLInputElement>) => setSettingsForm((prev) => ({ ...prev, logo_image: event.target.files?.[0] ?? null }))} type="file" />
          <input className="rounded border px-3 py-2" onChange={(event: ChangeEvent<HTMLInputElement>) => setSettingsForm((prev) => ({ ...prev, hero_image: event.target.files?.[0] ?? null }))} type="file" />
          <button className="rounded bg-slate-900 px-3 py-2 text-white md:col-span-2" type="submit">설정 저장</button>
        </form>

        <SettingsCard settings={settingsQuery.data} />
      </section>
    </div>
  );
}

function StatsGrid({ stats }: { stats: DashboardStats | undefined }) {
  if (!stats) {
    return <div className="text-sm text-slate-600">통계 데이터 없음</div>;
  }

  return (
    <div className="grid gap-2 md:grid-cols-4">
      <StatItem label="전체 문의" value={stats.total_inquiries} />
      <StatItem label="미답변" value={stats.pending_inquiries} />
      <StatItem label="답변완료" value={stats.replied_inquiries} />
      <StatItem label="포트폴리오" value={stats.total_portfolio} />
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded border p-3">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  );
}

function InquiryDetailCard({ inquiry }: { inquiry: InquiryDetail }) {
  const comments = Array.isArray(inquiry.comments) ? inquiry.comments : [];

  return (
    <div className="mt-2 rounded border p-3 text-sm">
      <div className="font-medium">#{inquiry.id} {inquiry.name}</div>
      <div>phone: {inquiry.phone}</div>
      <div>age: {inquiry.age || "-"}</div>
      <div>interior_type: {inquiry.interior_type || "-"}</div>
      <div>area: {inquiry.area || "-"}</div>
      <div>move_in_date: {inquiry.move_in_date || "-"}</div>
      <div>work_request: {inquiry.work_request || "-"}</div>
      <div>content: {inquiry.content || "-"}</div>
      <div>comments: {comments.length}건</div>
    </div>
  );
}

function SettingsCard({ settings }: { settings: SiteSettings | undefined }) {
  if (!settings) {
    return <div className="mt-3 text-sm text-slate-600">설정 데이터 없음</div>;
  }

  return (
    <div className="mt-3 rounded border p-3 text-sm">
      <div>site_title: {settings.site_title}</div>
      <div>hero_title: {settings.hero_title}</div>
      <div>hero_subtitle: {settings.hero_subtitle}</div>
      <div>logo_image: {settings.logo_image || "-"}</div>
      <div>hero_image: {settings.hero_image || "-"}</div>
      <div>updated_at: {settings.updated_at}</div>
    </div>
  );
}
