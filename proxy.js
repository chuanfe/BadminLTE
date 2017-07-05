var PORT = 3000;

var http = require('http');
var url=require('url');
var fs=require('fs');
var mine=require('./mine').types;
var path=require('path');
var httpProxy = require('http-proxy');

var proxy = httpProxy.createProxyServer({
    // target: 'http://114.55.249.173/:8080/',   //接口转发地址
    target:'http://192.168.6.137/',
});

proxy.on('error', function(err, req, res){
    res.writeHead(500, {
        'content-type': 'text/plain'
    });
    console.log(err);
    res.end('Something went wrong. And we are reporting a custom error message.');
});

var server = http.createServer(function (request, response) {
    var pathname = url.parse(request.url).pathname;
    //var realPath = path.join("main-pages", pathname); // 指定根目录
    var realPath = path.join("./", pathname);
    console.log(pathname);
    console.log(realPath);
    var ext = path.extname(realPath);
    ext = ext ? ext.slice(1) : 'unknown';

    //判断如果是来自接口的访问，则通过proxy转发
    //只需要每次改这里的匹配就行
    if(pathname.indexOf("attributequery") > 0 ){
        proxy.web(request, response);
        return;
    }
    // if((pathname.indexOf("a/cs") > 0) || (pathname.indexOf("c/ydonline") > 0) ){
    //     proxy.web(request, response);
    //     return;
    // }

    fs.exists(realPath, function (exists) {
        if (!exists) {
            response.writeHead(404, {
                'Content-Type': 'text/plain'
            });

            response.write("This request URL " + pathname + " was not found on this server.");
            response.end();
        } else {
            fs.readFile(realPath, "binary", function (err, file) {
                if (err) {
                    response.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });
                    response.end();
                } else {
                    var contentType = mine[ext] || "text/plain";
                    response.writeHead(200, {
                        'Content-Type': contentType
                    });
                    response.write(file, "binary");
                    response.end();
                }
            });
        }
    });
});
server.listen(PORT);
console.log("Server runing at port: " + PORT + ".");