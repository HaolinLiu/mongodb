var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');

var peopleData = require('./peopleData');

var app = express();
var port = process.env.PORT || 3000;

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(bodyParser.json());

app.use(express.static('public'));

app.get('/', function (req, res, next) {
  res.status(200).render('homePage');
});

app.get('/people', function (req, res, next) {
  res.status(200).render('peoplePage', {
    people: peopleData
  });
});

app.get('/people/:person', function (req, res, next) {
  var person = req.params.person.toLowerCase();
  if (peopleData[person]) {
    res.status(200).render('photoPage', peopleData[person]);
  } else {
    next();
  }
});

app.post('/people/:person/addPhoto', function (req, res, next) {
  var person = req.params.person.toLowerCase();
  if (peopleData[person]) {
    if (req.body && req.body.caption && req.body.photoURL) {
      var photo = {
        caption: req.body.caption,
        photoURL: req.body.photoURL
      };
      peopleData[person].photos.push(photo);
      res.status(200).end();
    } else {
      res.status(400).send("Request needs a JSON body with caption and photoURL.")
    }
  } else {
    next();
  }
});

app.use('*', function (req, res, next) {
  res.status(404).render('404');
});

app.listen(port, function () {
  console.log("== Server listening on port", port);
})
