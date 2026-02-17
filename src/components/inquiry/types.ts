export interface InquiryFormValues {
  name: string;
  phone: string;
  password: string;
  age: "" | "20" | "30" | "40";
  interiorType: "" | "residential" | "commercial";
  area: string;
  moveInDate: string;
  workRequest: string;
  content: string;
}

export interface InquiryItem {
  id: number;
  title: string;
  name: string;
  createdAt: string;
  hasReply: boolean;
}

export const initialForm: InquiryFormValues = {
  name: "",
  phone: "",
  password: "",
  age: "",
  interiorType: "",
  area: "",
  moveInDate: "",
  workRequest: "",
  content: "",
};

export interface PortfolioItem {
  id: number;
  title: string;
  category: "주거" | "상업" | "오피스";
  year: string;
  area: string;
  summary: string;
  image: string;
}
