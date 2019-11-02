/*
	Place files with the format listed in the mimeTypes constant
	in the same directory of this file and test the web server
	out with either of "npm start" or "node index.js" commands!

	Originally obtained from the course 
	    - "Udemy - Learn node.js by building 12 projects" 
	
	Modified by 
	    - S. Saeed Hosseini (github.com/SayidHosseini)
*/

const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const port = 80;


const mimeTypes = {
	html: 'text/html',
	css: 'text/css',
	js: 'text/javascript',
	jpg: 'image/jpg',
	png: 'image/png'
};

const server = http.createServer((req, res) => {
	var uri = url.parse(req.url).pathname;
	var filename = path.join(process.cwd(), unescape(uri));
	var now = new Date().toISOString();
	var log = now + ' GET ' + uri;
	var stats;

	try {
		stats = fs.lstatSync(filename);
	} catch {
		res.statusCode = 404;
		res.setHeader('Content-type', 'text/html');
		res.end('<h1>404 Not Found</h1>');
		log += ' 404 Not Found';
		console.log(log);
		return;
	}

	if (stats.isFile()) {
		var mimeType = mimeTypes[uri.split('.').reverse()[0]];
		if (!mimeType) {
			res.statusCode = 415;
			res.setHeader('Content-type', 'text/html');
			res.end('<h1>415 Content Not Supported</h1>');
			log += ' 415 Content Not Supported';
		} else {
			res.statusCode = 200;
			res.setHeader('Content-type', mimeType);

			var fileStream = fs.createReadStream(filename);
			fileStream.pipe(res);
			log += ' 200 OK';
		}
	} else if (stats.isDirectory()) {
		res.statusCode = 301;
		res.setHeader('Location', '/index.html');
		res.end();
		log += ' 301 Moved Permanently';
	} else {
		res.statusCode = 500;
		res.setHeader('Content-type', 'text/html');
		res.end('<h1>500 Internal Server Error</h1>');
		log += ' 500 Internal Server Error'
	}
	console.log(log);
});

server.listen(port, () => {
	console.log('Server is up and running on port ' + port + '\n');
});
