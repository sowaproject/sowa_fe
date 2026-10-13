interface ToFormDataOptions {
  preserveEmptyStringKeys?: string[];
  preserveNullKeys?: string[];
}

export const portfolioUpdateFormDataOptions: ToFormDataOptions = {
  preserveEmptyStringKeys: ["description", "year", "location", "area"],
  preserveNullKeys: ["category_id"],
};

export function toFormData(payload: object, options: ToFormDataOptions = {}): FormData {
  const formData = new FormData();
  const preserveEmptyStringKeys = new Set(options.preserveEmptyStringKeys ?? []);
  const preserveNullKeys = new Set(options.preserveNullKeys ?? []);

  Object.entries(payload as Record<string, unknown>).forEach(([key, value]) => {
    if (value === null && preserveNullKeys.has(key)) {
      // DRF converts an empty multipart value to null for allow_null fields.
      formData.append(key, "");
      return;
    }
    if (value === undefined || value === null || (value === "" && !preserveEmptyStringKeys.has(key))) {
      return;
    }
    if (value instanceof File) {
      formData.append(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((item) => formData.append(key, item instanceof File ? item : String(item)));
    } else {
      formData.append(key, String(value));
    }
  });
  return formData;
}
