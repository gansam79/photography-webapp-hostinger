const RAW_BASE_URL = typeof import.meta.env.VITE_API_URL === "string" ? import.meta.env.VITE_API_URL : "";
const HAS_ABSOLUTE_BASE = /^https?:\/\//i.test(RAW_BASE_URL);
const API_BASE_URL = HAS_ABSOLUTE_BASE ? RAW_BASE_URL.replace(/\/$/, "") : "";
const API_PREFIX = "/api";

const buildAbsoluteUrl = (path) => {
  if (!API_BASE_URL) return path;
  if (typeof path !== "string") return path;
  if (!path.startsWith(`${API_PREFIX}/`)) return path;

  const trimmedPath = path.replace(/^\/api/, "");
  return `${API_BASE_URL}${trimmedPath}`;
};

const patchFetch = () => {
  if (typeof window === "undefined") return;
  if (!API_BASE_URL) return;
  if (window.__API_FETCH_PATCHED__) return;

  const nativeFetch = window.fetch.bind(window);

  window.fetch = (input, init) => {
    if (typeof input === "string") {
      return nativeFetch(buildAbsoluteUrl(input), init);
    }

    if (input instanceof Request) {
      try {
        const relative = new URL(input.url, window.location.origin);
        if (relative.origin === window.location.origin && relative.pathname.startsWith(`${API_PREFIX}/`)) {
          const rewrittenUrl = buildAbsoluteUrl(relative.pathname + relative.search + relative.hash);
          const clonedRequest = new Request(rewrittenUrl, input);
          return nativeFetch(clonedRequest, init);
        }
      } catch (error) {
        console.warn("[apiFetch] Unable to rewrite Request: ", error);
      }
    }

    return nativeFetch(input, init);
  };

  window.__API_FETCH_PATCHED__ = true;

  if (import.meta.env.DEV) {
    console.info(`[apiFetch] Proxying "/api/*" requests to ${API_BASE_URL}`);
  }
};

patchFetch();

// Basic wrapper around native fetch that just ensures global fetch is patched
export const apiRequest = (input, init) => {
  return window.fetch(input, init);
};

export { };
