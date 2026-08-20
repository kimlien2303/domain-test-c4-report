const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3030;

const server = http.createServer((req, res) => {
    // Chỉ phục vụ trang chính
    if (req.url === '/' || req.url === '/index.html') {
        const filePath = path.join(__dirname, 'index.html');
        
        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                return res.end('Lỗi: Không tìm thấy file index.html trong thư mục frontend.');
            }
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(content);
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`🌐 Frontend Website đang chạy tại: http://localhost:${PORT}`);
});