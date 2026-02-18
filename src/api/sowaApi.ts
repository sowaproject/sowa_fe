import { apiClient, toFormData } from "./client";
import type {
  Category,
  CategoryRequest,
  Comment,
  DashboardStats,
  InquiryCreateRequest,
  InquiryDetail,
  InquiryListItem,
  InquiryPasswordRequest,
  LoginRequest,
  MessageResponse,
  PaginatedResponse,
  PortfolioImage,
  PortfolioImageRequest,
  SiteSettings,
  SiteSettingsRequest,
} from "./types";

interface PortfolioListParams {
  category?: number;
  is_featured?: "true" | "false";
  page?: number;
}

const publicApi = {
  getSettings: async () => {
    const { data } = await apiClient.get<SiteSettings>("/api/settings/");
    return data;
  },

  getCategories: async () => {
    const { data } = await apiClient.get<Category[]>("/api/portfolio/categories/");
    return data;
  },

  getCategory: async (id: number) => {
    const { data } = await apiClient.get<Category>(`/api/portfolio/categories/${id}/`);
    return data;
  },

  getPortfolioImages: async (params?: PortfolioListParams) => {
    const { data } = await apiClient.get<PaginatedResponse<PortfolioImage>>(
      "/api/portfolio/images/",
      { params },
    );
    return data;
  },

  getPortfolioImage: async (id: number) => {
    const { data } = await apiClient.get<PortfolioImage>(`/api/portfolio/images/${id}/`);
    return data;
  },

  getInquiryList: async () => {
    const { data } = await apiClient.get<InquiryListItem[]>("/api/inquiry/");
    return data;
  },

  createInquiry: async (payload: InquiryCreateRequest) => {
    const { data } = await apiClient.post<InquiryDetail>("/api/inquiry/create/", payload);
    return data;
  },

  verifyInquiry: async (id: number, payload?: InquiryPasswordRequest) => {
    const { data } = await apiClient.post<InquiryDetail>(`/api/inquiry/${id}/verify/`, payload ?? {});
    return data;
  },
};

const adminApi = {
  getStats: async () => {
    const { data } = await apiClient.get<DashboardStats>("/api/dashboard-sowa/stats/");
    return data;
  },

  login: async (payload: LoginRequest) => {
    const { data } = await apiClient.post<MessageResponse>("/api/dashboard-sowa/login/", payload);
    return data;
  },

  logout: async () => {
    const { data } = await apiClient.post<MessageResponse>("/api/dashboard-sowa/logout/");
    return data;
  },

  listCategories: async () => {
    const { data } = await apiClient.get<Category[]>("/api/dashboard-sowa/category/");
    return data;
  },

  createCategory: async (payload: CategoryRequest) => {
    const { data } = await apiClient.post<Category>("/api/dashboard-sowa/category/", payload);
    return data;
  },

  updateCategory: async (id: number, payload: CategoryRequest) => {
    const { data } = await apiClient.put<Category>(`/api/dashboard-sowa/category/${id}/`, payload);
    return data;
  },

  deleteCategory: async (id: number) => {
    await apiClient.delete(`/api/dashboard-sowa/category/${id}/`);
  },

  listPortfolio: async () => {
    const { data } = await apiClient.get<PortfolioImage[]>("/api/dashboard-sowa/portfolio/");
    return data;
  },

  getPortfolio: async (id: number) => {
    const { data } = await apiClient.get<PortfolioImage>(`/api/dashboard-sowa/portfolio/${id}/`);
    return data;
  },

  createPortfolio: async (payload: PortfolioImageRequest) => {
    const body = toFormData(payload);
    const { data } = await apiClient.post<PortfolioImage>("/api/dashboard-sowa/portfolio/", body, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  updatePortfolio: async (id: number, payload: PortfolioImageRequest) => {
    const body = toFormData(payload);
    const { data } = await apiClient.put<PortfolioImage>(`/api/dashboard-sowa/portfolio/${id}/`, body, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  deletePortfolio: async (id: number) => {
    await apiClient.delete(`/api/dashboard-sowa/portfolio/${id}/`);
  },

  listInquiry: async () => {
    const { data } = await apiClient.get<InquiryListItem[]>("/api/dashboard-sowa/inquiry/");
    return data;
  },

  getInquiry: async (id: number) => {
    const { data } = await apiClient.get<InquiryDetail>(`/api/dashboard-sowa/inquiry/${id}/`);
    return data;
  },

  deleteInquiry: async (id: number) => {
    await apiClient.delete(`/api/dashboard-sowa/inquiry/${id}/`);
  },

  createComment: async (id: number, content: string) => {
    const { data } = await apiClient.post<Comment>(`/api/dashboard-sowa/inquiry/${id}/comment/`, {
      content,
    });
    return data;
  },

  deleteComment: async (id: number) => {
    await apiClient.delete(`/api/dashboard-sowa/comment/${id}/`);
  },

  getSettings: async () => {
    const { data } = await apiClient.get<SiteSettings>("/api/dashboard-sowa/settings/");
    return data;
  },

  updateSettings: async (payload: SiteSettingsRequest) => {
    const body = toFormData(payload);
    const { data } = await apiClient.put<SiteSettings>("/api/dashboard-sowa/settings/", body, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },
};

export const sowaApi = {
  public: publicApi,
  admin: adminApi,
};
