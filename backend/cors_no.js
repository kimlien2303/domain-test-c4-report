const http = require('http');

const PORT = 5000;

const ALLOWED_ORIGIN ='https://taylor.lientestsit.onl.ac';

const server = http.createServer((req, res) => {
    // 1. Kiểm tra Origin
//     const origin = req.headers.origin;
// 	if (origin === ALLOWED_ORIGIN) {
//        res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
//         res.setHeader('Access-Control-Allow-Credentials', 'true');
//    }

//     // 2. Xử lý PREFLIGHT REQUEST (OPTIONS)/
// 	 if (req.method === 'OPTIONS') {
//        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//         res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Custom-Header');
//         res.setHeader('Access-Control-Max-Age', '10');
        
//         res.writeHead(204);
//         return res.end();
//     }

    // 3. Handling API Routes
    if (req.url === '/api/simple' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({
            type: 'Simple Request',
            message: 'Thành công! Trình duyệt gửi trực tiếp GET request.',
            timestamp: new Date().toISOString()
        }));
    }

    if (req.url === '/api/preflight' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            const parsedBody = body ? JSON.parse(body) : {};
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                type: 'Preflight Request',
                message: 'Thành công! Trình duyệt đã gửi OPTIONS trước, sau đó mới gửi POST request này.',
                receivedData: parsedBody,
                timestamp: new Date().toISOString()
            }));
        });
        return;
    }

    // 444 / 404 Not Found
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Endpoint không tồn tại' }));
});

server.listen(PORT, () => {
    console.log(`🚀 Backend API (Native Node.js) đang chạy tại: http://localhost:${PORT}`);
});
