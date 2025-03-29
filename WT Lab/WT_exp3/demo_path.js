const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

function getResponse(req, res) {
    let urlpath = url.parse(req.url, true);
    console.log('Requested path:', urlpath.pathname);

    // Serve static files
    if (urlpath.pathname.startsWith('/static/')) {
        const filePath = path.join(__dirname, urlpath.pathname);
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404, { "Content-Type": "text/plain" });
                res.end("File not found");
                return;
            }
            const ext = path.extname(filePath);
            const contentType = {
                '.html': 'text/html',
                '.css': 'text/css',
                '.js': 'text/javascript',
                '.jpg': 'image/jpeg',
                '.png': 'image/png',
                '.gif': 'image/gif'
            }[ext] || 'text/plain';

            res.writeHead(200, { "Content-Type": contentType });
            res.end(data);
        });
        return;
    }

    // Handle different routes
    switch (urlpath.pathname) {
        case '/':
        case '/home':
            fs.readFile('samplemodule.html', (err, data) => {
                if (err) {
                    res.writeHead(500, { "Content-Type": "text/html" });
                    res.end("<h1>Internal Server Error</h1><p>Error loading home page</p>");
                    return;
                }
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(data);
            });
            break;

        case '/about':
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(`
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>About Us - Travel Explorer</title>
                    <style>
                        * { margin: 0; padding: 0; box-sizing: border-box; }
                        body { font-family: Arial, sans-serif; text-align: center; display: flex; flex-direction: column; min-height: 100vh; }
                        header { background: #4cafa7; padding: 15px; color: white; font-size: 24px; font-weight: bold; }
                        section { flex: 1; padding: 20px; }
                        footer { background: #f1f1f1; padding: 10px; font-size: 14px; }
                    </style>
                </head>
                <body>
                    <header>About Travel Explorer</header>
                    <section>
                        <h2>Who We Are</h2> <br>
                        <p>Your ultimate travel companion, helping you discover breathtaking destinations and unique experiences.</p>  <br>
                        
                        <h2>Our Mission</h2>   <br>
                        <p>To make traveling easier, more accessible, and full of adventure for everyone, anywhere.</p>   <br>
                        <h2>Contact Us</h2>   <br>
                        <p>Email: support@travelexplorer.com</p>   <br>
                    </section>
                    <footer>
                    2025 Travel Explorer. All Rights Reserved.</footer>
                </body>
                </html>
            `);
            res.end();
            break;

        case '/contact':
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(`
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Contact Us - Travel Explorer</title>
                    <style>
                        * { margin: 0; padding: 0; box-sizing: border-box; }
                        body { font-family: Arial, sans-serif; min-height: 100vh; }
                        header { background: #4cafa7; padding: 15px; color: white; font-size: 24px; font-weight: bold; }
                        .contact-form { max-width: 600px; margin: 20px auto; padding: 20px; }
                        .form-group { margin-bottom: 15px; }
                        label { display: block; margin-bottom: 5px; }
                        input, textarea { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
                        button { background: #4cafa7; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
                        button:hover { background: #45a049; }
                        footer { background: #f1f1f1; padding: 10px; text-align: center; }
                    </style>
                </head>
                <body>
                    <header>Contact Travel Explorer</header>
                    <div class="contact-form">
                        <form action="/submit-contact" method="POST">
                            <div class="form-group">
                                <label for="name">Name:</label>
                                <input type="text" id="name" name="name" required>
                            </div>
                            <div class="form-group">
                                <label for="email">Email:</label>
                                <input type="email" id="email" name="email" required>
                            </div>
                            <div class="form-group">
                                <label for="message">Message:</label>
                                <textarea id="message" name="message" rows="5" required></textarea>
                            </div>
                            <button type="submit">Send Message</button>
                        </form>
                    </div>
                    <footer>© 2025 Travel Explorer. All Rights Reserved.</footer>
                </body>
                </html>
            `);
            res.end();
            break;

        case '/submit-contact':
            if (req.method === 'POST') {
                let body = '';
                req.on('data', chunk => {
                    body += chunk.toString();
                });
                req.on('end', () => {
                    // Here you would typically process the form data
                    // For now, we'll just send a success message
                    res.writeHead(200, { "Content-Type": "text/html" });
                    res.write(`
                        <html>
                        <head>
                            <title>Message Sent - Travel Explorer</title>
                            <style>
                                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                                .success { color: #4cafa7; }
                            </style>
                        </head>
                        <body>
                            <h1 class="success">Thank You!</h1>
                            <p>Your message has been received. We'll get back to you soon.</p>
                            <a href="/">Return to Home</a>
                        </body>
                        </html>
                    `);
                    res.end();
                });
            } else {
                res.writeHead(405, { "Content-Type": "text/html" });
                res.end("<h1>Method Not Allowed</h1>");
            }
            break;

        default:
            res.writeHead(404, { "Content-Type": "text/html" });
            res.write(`
                <html>
                <head>
                    <title>404 - Page Not Found</title>
                    <style>
                        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                        .error { color: #ff4444; }
                    </style>
                </head>
                <body>
                    <h1 class="error">404 - Page Not Found</h1>
                    <p>The page you're looking for doesn't exist.</p>
                    <a href="/">Return to Home</a>
                </body>
                </html>
            `);
            res.end();
    }
}

const server = http.createServer(getResponse);
const PORT = 8000;
server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
}); 