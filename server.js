var fs = require('fs');
var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello from the main application');
});

var reportingApp = express();
app.use('/reporting', reportingApp);

var server = app.listen(8000);

var jsreport = require('jsreport')({
  express: { app: reportingApp, server: server },
  appPath: "/reporting"
});

var request = {};

function beforeRender(done) {
  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect('mongodb://127.0.0.1:27017/phoenix-api', function (err, db) {
    var collection = db.collection('product').find().toArray(function (err, results) {
      if (err)
        return done(err);

      request.data = { product: results[0] };
    });
  });
}

beforeRender();

request.template = {
  content: `
    <hi>{{product.name}}</h1>
    <ul>
      {{#each product.features}}
        <li>{{this.name}}</li>
      {{/each}}
    </ul>
  `,
  engine: 'handlebars',
  recipe: 'phantom-pdf'
};

jsreport.init().then(function () {


  jsreport.render(request).then(function (resp) {
    // write report buffer to a file
    fs.writeFileSync('report.pdf', resp.content)
  });
}).catch(function (e) {
  console.log(e)
})

