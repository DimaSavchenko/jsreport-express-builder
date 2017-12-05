var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello from the main application');
});

var reportingApp = express();
app.use('/reporting', reportingApp);

var server = app.listen(3000);

var jsreport = require('jsreport')({
  express: { app :reportingApp, server: server },
  appPath: "/reporting"
});

jsreport.init().catch(function (e) {
  console.error(e);
});