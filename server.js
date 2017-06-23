var connect = require('connect');
var serveStatic = require('serve-static');
app = connect();
app
   .use(serveStatic(__dirname + '/demo'))
   .use(serveStatic(__dirname + '/lib/__dist'))
   .use(serveStatic(__dirname + '/tests'))
   .listen(8080, function(){
       console.log('Server running on 8080...');
   });
