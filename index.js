var express = require('express');
var fs = require('fs');
var app    = express();
var bodyParser = require('body-parser');
//var cookieParser = require('cookie-parser');
var port = Number(process.env.PORT || 5000);

app.engine('.html', require('ejs').__express);
// Optional since express defaults to CWD/views
app.set('views', __dirname + '/views');
// Without this you would need to
// supply the extension to res.render()
// ex: res.render('users.html').
app.set('view engine', 'html');
//server static assets form public folder
app.use("/public", express.static(__dirname + '/public'));

// body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

function makeTime(){
  var d = new Date();
  var day = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
  var month = d.getMonth() + 1 < 10 ?  "0" + (d.getMonth() + 1) : d.getMonth() + 1;
  return day + "-" + month + "-" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes()
}

//===FIREBASE===//
var Firebase = require("firebase");
var fb = new Firebase('https://fuck-you-deep-in-the-asshole.firebaseIO.com/');
var allFb;
//===END FIREBASE===//

fb.once("value", function(){

  console.log( "firebase is on" );

  fb.on("value", function(snap){
    allFb = snap.val();
  });

  //==MAIN ROUT==//
  app.get('/', function(req, res){

    console.log("i got a get request to /");
    console.log(allFb[0]);
    return res.send( (allFb[0]).toString() ); //JSON.stringify(allFb)

  });

  app.post('/', function(req, res){

    console.log("i got a request to /");
    //res.status(200).send("all good");
    //console.log(req.body);

    var userName = req.body.user_name;
    var botPayload = {
      text : 'Hello, ' + userName + '!'
    };

    if(userName !== "slackbot"){
      return res.status(200).json(botPayload);
    }else{
       return res.status(200).end();
    }
    //return res.status(200).json(req.body);

  });

  app.listen(port);
  console.log('Listeninig on port ' + port);

});