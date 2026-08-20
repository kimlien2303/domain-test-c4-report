async function sendRequest(url, method = "GET") {
  const response = await fetch("/api/request", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, method })
  });
  const data = await response.json();
  if (!response.ok && !data.response) throw new Error(data.error || "Request failed.");
  return data;
}

function formatHeaders(headers) {
  return Object.entries(headers || {})
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
}

function prettyBody(body) {
  try { return JSON.stringify(JSON.parse(body), null, 2); }
  catch { return body || ""; }
}