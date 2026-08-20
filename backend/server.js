const express = require('express');
const app = express();
const PORT = 5000;

// Middleware parse JSON body
app.use(express.json());

// Tự cấu hình CORS bằng tay (Manual CORS) để hiểu rõ bản chất
app.use((req, res, next) => {
    const allowedOrigin = 'http://localhost:3000';
    const origin = req.headers.origin;

    // 1. Gán Origin và Credentials nếu request từ frontend hợp lệ
    if (origin === allowedOrigin) {
        res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
    }

    // 2. Xử lý PREFLIGHT REQUEST (OPTIONS)
    if (req.method === 'OPTIONS') {
        // Cho phép phương thức HTTP
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        
        // Cho phép các Custom Header (Authorization, X-Custom-Header...)
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Custom-Header');
        
        // Cache Preflight kết quả trong 10 giây để dễ test
        res.setHeader('Access-Control-Max-Age', '10');

        // Trả về HTTP 204 No Content ngắt luôn Preflight
        return res.status(204).end();
    }

    next();
});

// Endpoint 1: SIMPLE REQUEST (GET request, không custom header)
app.get('/api/simple', (req, res) => {
    console.log('-> Backend nhan: Simple Request (GET)');
    res.json({
        type: 'Simple Request',
        message: 'Thành công! Trình duyệt gửi trực tiếp GET request mà KHÔNG qua Preflight OPTIONS.',
        timestamp: new Date().toISOString()
    });
});

// Endpoint 2: PREFLIGHT REQUEST (POST request + Content-Type: application/json)
app.post('/api/preflight', (req, res) => {
    console.log('-> Backend nhan: Actual Request sau Preflight (POST)');
    res.json({
        type: 'Preflight Request',
        message: 'Thành công! Trình duyệt đã gửi OPTIONS trước, sau đó mới gửi POST request này.',
        receivedData: req.body,
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Backend API đang chạy tại: http://localhost:${PORT}`);
});