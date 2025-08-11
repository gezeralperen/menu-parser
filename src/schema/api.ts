export type ApiError = {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export function isDev() {
  return process.env.NODE_ENV !== "production";
}

interface ProviderErrorResponse {
  error?: {
    message?: string;
    type?: string;
    code?: string;
    param?: string | null;
  };
}

export async function toApiErrorFromProvider(
  resp: Response
): Promise<ApiError> {
  let providerCode: string | undefined;
  let providerMessage = "";
  let details: unknown;

  // Prefer JSON if present; otherwise fallback to text
  const ct = resp.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    try {
      const j: ProviderErrorResponse = await resp.json();
      providerCode = j?.error?.code ?? j?.error?.type ?? "provider_error";
      providerMessage = j?.error?.message || "Provider returned an error.";
      details = j;
    } catch {
      // ignore JSON parse error, fall back to text below
    }
  }
  if (!providerMessage) {
    try {
      providerMessage = await resp.text();
    } catch {
      providerMessage = "Provider returned an error.";
    }
  }

  // Map provider codes to your API's stable codes
  let code = "LLM_ERROR";
  switch (providerCode) {
    case "insufficient_quota":
      code = "PROVIDER_QUOTA";
      break;
    case "rate_limit_exceeded":
    case "rate_limit":
      code = "PROVIDER_RATE_LIMIT";
      break;
    case "invalid_request_error":
      code = "PROVIDER_INVALID_REQUEST";
      break;
    default:
      code = "LLM_ERROR";
  }

  // DEV vs PROD message
  const message = isDev()
    ? `[${providerCode ?? "provider_error"}] ${providerMessage}`
    : code === "PROVIDER_QUOTA"
    ? "Service temporarily unavailable. Please try again later."
    : "We couldn't process the image right now. Please try again.";

  return { error: { code, message, details: isDev() ? details : undefined } };
}
