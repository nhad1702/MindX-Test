const SHARE_PATH_PATTERN = /^\/s\/([A-Za-z0-9_-]{10})\/?$/

export function getSnippetIdFromLocation() {
  return window.location.pathname.match(SHARE_PATH_PATTERN)?.[1]
    || new URLSearchParams(window.location.search).get("id")
}

export function createShareUrl(id) {
  return `${window.location.origin}/s/${id}`
}

export function navigateToSnippet(id, { replace = false } = {}) {
  window.history[replace ? "replaceState" : "pushState"]({}, "", id ? `/s/${id}` : "/")
}
