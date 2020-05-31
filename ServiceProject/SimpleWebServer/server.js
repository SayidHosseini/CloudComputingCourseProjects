const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');

const port = 80;
const mimetypes = {
    html: 'text/html',
    css: 'text/css',
    js: 'text/javascript',
    jpeg: 'image/jpeg',
    jpg: 'image/jpg',
    png: 'image/png',
    ico: 'image/ico',
    json: 'application/json'
};

const server = http.createServer((req, res) => {
    const uri = url.parse(req.url).pathname;
    const filename = path.join(process.cwd(), unescape(uri));
    const now = new Date().toISOString();
    var log = now + ' - ' + req.method + ' ' + uri + ' ';
    let stats;

    if(req.method !== 'GET') {
        res.statusCode = 405;
        res.setHeader('Content-Type', 'text/html');
        res.end('<h1>405 Method Not Allowed</h1>');
        log += '405 Method Not Allowed';
        console.log(log);
        fs.appendFile('server.log', log + '\n', () => {});
        return;
    }

    try {
        stats = fs.lstatSync(filename);
    } catch (error) {
        res.statusCode = 404;
        res.setHeader('Content-type', 'text/html');
        res.end('<h1>404 Not Found</h1>');
        log += '404 Not Found';
        console.log(log);
        fs.appendFile('server.log', log + '\n', () => {});
        return;
    }

    if(stats.isFile()) {
        const mimetype = mimetypes[uri.split('.').reverse()[0]];
        
        if(!mimetype) {
            res.statusCode = 415;
            res.setHeader('Content-type', 'text/html');
            res.end('<h1>415 Content Not Supported</h1>');
            log += '415 Content Not Supported';
        } else {
            res.statusCode = 200;
            res.setHeader('Content-type', mimetype);
            const readStream = fs.createReadStream(filename);
            readStream.pipe(res);
            log += '200 OK';
        }
    } else if(stats.isDirectory()) {
        res.statusCode = 301;
        res.setHeader('Location', '/index.html');
        res.end();
        log += '301 Permanently Moved';
    } else {
        res.statusCode = 500;
        res.setHeader('Content-type', 'text/html');
        res.end('500 Internal Server Error');
        log += '500 Internal Server Error';
    }
    console.log(log);
    fs.appendFile('server.log', log + '\n', () => {})
});

server.listen(port, () => {
    const now = new Date().toString();
    console.log(`Server is up and running on port ${port} @ ${now}\n`);
    fs.appendFile('server.log', `\nServer is up and running on port ${port} @ ${now}\n\n`, () => {});
});
