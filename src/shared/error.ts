const fieldLabels: Record<string, string> = {
  name: "이름",
  phone: "연락처",
  age: "연령대",
  interior_type: "인테리어 종류",
  area: "평수/면적",
  move_in_date: "입주 예상 날짜",
  desired_budget: "희망예산",
  construction_start_date: "공사 시작 희망일",
  referral_source: "알게 된 경로",
  referral_source_other: "기타 경로",
  work_request: "원하는 공사",
  content: "내용",
  year: "YEAR",
  location: "LOCATION",
  title: "제목",
  images: "이미지",
  category_id: "분류",
  education: "학력",
  career: "경력",
};

const firstErrorMessage = (value: unknown, depth = 0): string | null => {
  if (typeof value === "string") return value;
  if (depth > 4 || typeof value !== "object" || value === null) return null;
  for (const item of Object.values(value)) {
    const message = firstErrorMessage(item, depth + 1);
    if (message) return message;
  }
  return null;
};

const parseFieldError = (data: unknown): string | null => {
  if (Array.isArray(data)) return firstErrorMessage(data);
  if (typeof data !== "object" || data === null) {
    return null;
  }

  for (const [field, value] of Object.entries(data)) {
    const message = firstErrorMessage(value);
    if (typeof message === "string") {
      return `${fieldLabels[field] ?? field}: ${message}`;
    }
  }

  return null;
};

export const parseErrorMessage = (error: unknown): string => {
  if (typeof error === "object" && error !== null && "response" in error) {
    const maybeResponse = (error as { response?: { data?: unknown; status?: number } }).response;
    const responseData = maybeResponse?.data;

    if (
      typeof responseData === "object" &&
      responseData !== null &&
      "detail" in responseData &&
      typeof responseData.detail === "string"
    ) {
      return responseData.detail;
    }

    if (maybeResponse?.status === 400) {
      return parseFieldError(responseData) ?? "입력한 내용을 다시 확인해주세요.";
    }

    if (maybeResponse?.status === 413) {
      return "업로드 요청의 용량이 너무 큽니다. 사진을 나눠서 업로드해주세요.";
    }

    if (maybeResponse?.status === 401) {
      return "로그인이 필요하거나 로그인 정보가 올바르지 않습니다.";
    }

    if (maybeResponse?.status === 403) {
      return "로그인이 필요하거나 요청 권한이 없습니다.";
    }

    if (maybeResponse?.status === 404) {
      return "대상을 찾을 수 없습니다.";
    }
  }

  return "요청 처리 중 오류가 발생했습니다.";
};
