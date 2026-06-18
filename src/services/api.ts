import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export type ContentType = "blog" | "social_media" | "product_description" | "seo";

export interface GenerateContentPayload {
  type: ContentType;
  topic?: string;
  tone?: string;
  keywords?: string;
  audience?: string;
  platform?: string;
  productName?: string;
  features?: string;
}

export const aiAPI = {
  generateAds: (productDescription: string, targetAudience: string) =>
    api.post("/api/ai/generate/ads", {
      productDescription,
      targetAudience,
      provider: "gemini",
    }),
  generateContent: (payload: GenerateContentPayload) =>
    api.post("/api/ai/generate/content", {
      ...payload,
      provider: "gemini",
    }),
  getHistory: () => api.get("/api/ai/history"),
  getQuota: () => api.get("/api/ai/quota"),
};
