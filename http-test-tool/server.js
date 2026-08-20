const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

function safeHeaders(headers) {
  const out = {};
  for (const [key, value] of headers.entries()) out[key] = value;
  return out;
}

function renderProxyPage() {
  return path.join(__dirname, "public", "proxy.html");
}

// Server-side request endpoint.
// This avoids browser CORS restrictions for the target URL.
app.post("/api/request", async (req, res) => {
  const { url, method = "GET" } = req.body || {};

  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "URL is required." });
  }

  let target;
  try {
    target = new URL(url);
  } catch {
    return res.status(400).json({ error: "Invalid URL." });
  }

  if (!["http:", "https:"].includes(target.protocol)) {
    return res.status(400).json({ error: "Only HTTP and HTTPS URLs are allowed." });
  }

  const started = performance.now();

  try {
    const response = await fetch(target, {
      method: String(method).toUpperCase(),
      redirect: "follow",
      signal: AbortSignal.timeout(30000)
    });

    const body = await response.text();
    const elapsed = Math.round(performance.now() - started);

    res.json({
      request: {
        url: target.toString(),
        method: String(method).toUpperCase()
      },
      response: {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        timeMs: elapsed,
        headers: safeHeaders(response.headers),
        body
      }
    });
  } catch (error) {
    const elapsed = Math.round(performance.now() - started);
    res.status(502).json({
      request: {
        url: target.toString(),
        method: String(method).toUpperCase()
      },
      error: error.message || "Request failed.",
      timeMs: elapsed
    });
  }
});

// A simple direct response endpoint for header/response testing.
app.get("/api/test-response", (req, res) => {
  const status = Number.parseInt(req.query.status || "200", 10);
  const delay = Math.min(Math.max(Number.parseInt(req.query.delay || "0", 10), 0), 10000);
  const sizeKb = Math.min(Math.max(Number.parseInt(req.query.sizeKb || "1", 10), 0), 10240);

  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", req.query.cache || "no-store");
  res.setHeader("X-Test-Page", "http-test-tool");
  res.setHeader("X-Test-Status", String(Number.isFinite(status) ? status : 200));
  res.setHeader("X-Test-Delay-Ms", String(delay));
  res.setHeader("X-Test-Size-Kb", String(sizeKb));

  const send = () => {
    const payload = {
      message: "HTTP Test Response",
      timestamp: new Date().toISOString(),
      request: {
        method: req.method,
        path: req.path,
        query: req.query
      },
      response: {
        status: Number.isFinite(status) ? status : 200,
        delayMs: delay,
        sizeKb
      }
    };

    let body = JSON.stringify(payload, null, 2);
    if (sizeKb > 1) {
      body += "\n" + "x".repeat(Math.max(0, sizeKb * 1024 - body.length));
    }

    res.status(Number.isFinite(status) && status >= 100 && status <= 599 ? status : 200).send(body);
  };

  setTimeout(send, delay);
});

// Convenience endpoint to inspect request headers.
app.get("/api/inspect", (req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Test-Page", "http-test-tool");
  res.json({
    method: req.method,
    url: req.originalUrl,
    headers: req.headers,
    ip: req.ip,
    timestamp: new Date().toISOString()
  });
});

app.get("/proxy", (_req, res) => res.sendFile(renderProxyPage()));

app.get("*splat", (req, res, next) => {
  if (req.path.startsWith("/api/")) return next();
  if (req.path.includes(".")) return next();
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`HTTP Test Tool running on http://localhost:${PORT}`);
});