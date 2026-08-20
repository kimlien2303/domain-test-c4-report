# HTTP Test Tool

Lightweight Node.js + Express website for HTTP/CDN/proxy testing.

## Requirements

- Node.js 18+ (20+ recommended)
- npm

## Run locally

```bash
npm install
npm start
```

Open:

http://localhost:3000

## Pages

- `/` - Home
- `/request.html` - enter a URL and send a server-side request
- `/proxy.html` - proxy request and inspect response
- `/response.html` - controlled response endpoint
- `/image-1.html` ... `/image-5.html` - image test pages

## API

### Server-side request

`POST /api/request`

Body:

```json
{
  "url": "https://example.com",
  "method": "GET"
}
```

### Controlled response

Examples:

- `/api/test-response?status=200`
- `/api/test-response?status=404`
- `/api/test-response?delay=1000`
- `/api/test-response?sizeKb=100`
- `/api/test-response?cache=public%2C%20max-age%3D60`

## Deploy

This project can be deployed on any service that runs Node.js.

For a platform that provides a Git-connected Node.js web service:

1. Push this folder to GitHub.
2. Create a Node.js web service.
3. Build/install command: `npm install`
4. Start command: `npm start`
5. The app uses `PORT` from the environment.

## Security note

The `/api/request` endpoint is intentionally a server-side fetcher. If this service is deployed publicly, add SSRF protections before exposing it to untrusted users. In particular, consider blocking localhost, private IP ranges, cloud metadata endpoints, and internal DNS targets, plus authentication/rate limiting.
