import http from 'node:http'

const port = 3001;
const host = "localhost";

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World');
});

server.listen(port, host, () => {
    console.log('server is running at http://'+host+':'+port+'/');
});