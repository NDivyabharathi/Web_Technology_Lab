var http = require('http');
var url = require('url');
var queryString = require('querystring');
function samp(req,res){
    res.writeHead(200,{'content-type':'text/html'});
    var query = url.parse(req.url).query;
    var name = queryString.parse(query)['name'];
    var email = queryString.parse(query)['email'];

    res.write("Successfully loged in")
    res.write("<h2>Your  name  is " +name+ "Your email is "+email+"</h2>");
    res.end();
}
var server = http.createServer(samp);
server.listen(7000);
console.log("Server is running");