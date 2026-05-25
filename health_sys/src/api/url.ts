const DEFAULT_PRODUCTION_API_BASE_URL = "https://huoshanbei-api.vercel.app";

type ApiEnv = {
  PROD?: boolean;
  VITE_API_BASE_URL?: string;
};

export function buildApiUrl(path: string): string {
  const baseUrl = resolveApiBaseUrl(import.meta.env);
  const apiPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${apiPath}`;
}

export function resolveApiBaseUrl(env: ApiEnv): string {
  const configuredBaseUrl = env.VITE_API_BASE_URL || "";
  const baseUrl = configuredBaseUrl || (env.PROD ? DEFAULT_PRODUCTION_API_BASE_URL : "");
  return baseUrl.replace(/\/+$/, "");
}
