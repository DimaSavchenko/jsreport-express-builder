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
  express: { app :reportingApp, server: server },
  appPath: "/reporting"
});

function beforeRender(done) {
  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect('mongodb://127.0.0.1:27017/phoenix-api', function(err, db) {
    // db.listCollections().toArray(function(err, collInfos) {
    //   // collInfos is an array of collection info objects that look like:
    //   console.log(collInfos);
    // });
    var collection = db.collection('product').find().toArray(function(err, results) {
      // console.log(request);
      // if (err)
      //   return done(err);

      // request.data = { product: results };
      Object.assign(request.data, { countries: results })
      // done();
    });
  });
}

beforeRender();

jsreport.init().then(function () {


  jsreport.render({
    template: {
      content: '<h1>Hello {{:foo}}</h1>',
      engine: 'handlebars',
      recipe: 'phantom-pdf'
    },
    data: {
      foo: "world"
    }
  }).then(function(resp) {
    // write report buffer to a file
    fs.writeFileSync('report.pdf', resp.content)
  });
}).catch(function(e) {
  console.log(e)
})
