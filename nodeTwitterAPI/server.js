'use strict';
var http = require('http');
var Twitter = require('twitter');
var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var server = require('http').Server(app);
var port = process.env.PORT || 1337;

var client = new Twitter({
    consumer_key: '7tO3wgmdH2uuZnwDutIrX6wX6',
    consumer_secret: 'y65ugP8txGz5tHEcCABBVUsCEqfuBaa8xloyy04ZUBavSI2cqa',
    access_token_key: '2345113598-CQcdTR5QYX7TLeLr127imuVZzskuO5Q1NeTTeSa',
    access_token_secret: 'LFnkQf7M0lSJ3CNB4QHdwb3VdXt4TYDrEh58V2SBd7UGd'
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/js", express.static(__dirname + '/js'));
app.use("/css", express.static(__dirname + '/css'));

/*
client.get('search/tweets', { q: 'node.js' }, function (error, tweets, response) {
    console.log(tweets);
});
*/

app.get('/',function(req,res){
    res.sendFile(__dirname + '/index.html');
});

function addToQueryString(input) {
    if (input == "")
        return "";
    else
        return input + "+";
}

function splitAndReplace(input, character, replace) {
    var output = '';

    var myarray = str.split(character);

    for (var i = 0; i < myarray.length; i++) {
        output += replace + character;
    }

    return output;
}

app.post('/search', function (req, res) {

    console.log(req.body);

    res.setHeader('Content-Type', 'application/json');

    var queryString = '';
    var separator = '+';

    // 1. watching now	|  containing both “watching” and “now”. This is the default operator.
    queryString += addToQueryString(req.body.data.allwords);

    // 2. “happy hour”	|  containing the exact phrase “happy hour”.
    queryString += addToQueryString('"' + req.body.data.exactphrase + '"');

    // 3. love OR hate	|  containing either “love” or “hate” (or both).
    // first replace duplicate spaces
    // replace all spaces with OR operator
    req.body.data.anyword = req.body.data.anyword.replace("  "," ").replace(" ", " OR ");
    queryString += addToQueryString(req.body.data.anyword);

    // 4. beer - root	|  containing “beer” but not “root”.
    // none of these words
    req.body.data.noneofthese = req.body.data.noneofthese.replace("  ", " ").replace(" ", " -");
    queryString += addToQueryString("-" + req.body.data.noneofthese);

    // 5. #haiku	    |  containing the hashtag “haiku”.
    // these hashtags
    req.body.data.hashtags = req.body.data.hashtags.replace("  ", " ").replace(" ", " #");
    queryString += addToQueryString("#" + req.body.data.hashtags);

    // 6. from:interior	|  sent from Twitter account “interior”.
    req.body.data.fromaccounts = req.body.data.fromaccounts.replace("  ", " ").replace(" ", " from:");
    queryString += addToQueryString("from:" + req.body.data.fromaccounts);

    // 7. to:interior	|  sent to these accounts
    req.body.data.toaccounts = req.body.data.toaccounts.replace("  ", " ").replace(" ", " to:");
    queryString += addToQueryString("to:" + req.body.data.toaccounts);

    console.log("search query: " + queryString);

    client.get('search/tweets', { q: queryString, lang: req.body.data.lang }, function (error, tweets, response) {
        res.send(tweets);
    });
});

server.listen(process.env.PORT || 80, function () {
    console.log('Listening on ' + +server.address().ip + server.address().port);
});