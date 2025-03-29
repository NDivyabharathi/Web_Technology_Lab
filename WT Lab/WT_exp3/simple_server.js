const http = require('http');
const url = require('url');
const querystring = require('querystring');

function getResponse(req, res) {
    if (req.method === 'GET' && req.url.startsWith('/login')) {
        const query = url.parse(req.url).query;
        const params = querystring.parse(query);
        
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(`
            <html>
            <head>
                <title>Form Data</title>
                <style>
                    body { font-family: Arial; padding: 20px; }
                    .data { max-width: 300px; margin: 0 auto; }
                </style>
            </head>
            <body>
                <div class="data">
                    <h2>Submitted Data:</h2>
                    <p>Name: ${params.name}</p>
                    <p>Email: ${params.email}</p>
                    <p>Password: ${'*'.repeat(params.password.length)}</p>
                    <a href="/simple_form.html">Back to Form</a>
                </div>
            </body>
            </html>
        `);
        res.end();
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Page not found');
    }
}

const server = http.createServer(getResponse);
server.listen(8000);
console.log('Server running at http://localhost:8000'); 