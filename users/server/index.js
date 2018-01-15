//express is the server
// require allows us to use node modules that we npm/bower/yarn/ect installed
const express = require('express');
const app = express();
const db = require('../database/index.js');
const faker = require('faker');
const fakeData = require('./fakeData.js');
const bodyParser = require('body-parser');
const userRecentSearchResults = require('./userRecentSearchResults');

app.use(bodyParser.json());


var start = 1;
var end = 38000;
// artillery quick --count 10 -n 10  http://localhost:3000/updateSearchHistory
// artillery quick --count 10 -n 200  http://localhost:3000/addUser
//artillery quick --count 10 -n 10  http://localhost:3000/nothing
var count = 0;
var getRandomInt = function(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
};

// var obj = {firstName: 'denzel', lastName: 'wash', gender: 'male', email: 'yo@yahoo.com', phoneNumber: 9999999, preferredLanguage: 'all', preferredCurrency: 'any', homeCity:'usa', photo:'classified'}
// var names = []
// for(var i = 0; i < 50; i++) {
//   names.push(faker.random.number() + faker.random.number())
// }
// console.log(names)
// console.log(fakeData.names[getRandomInt(0,10)])
app.get('/addUser', (req, res) => {
  //as of now, only triggering the routes and not passing in live info 
  // var randomObj = {firstName: fakeData.names[getRandomInt(0, 50)], lastName: fakeData.names[getRandomInt(0, 50)], gender: fakeData.gender[getRandomInt(0, 3)], email: fakeData.email[getRandomInt(0, 50)], phoneNumber: fakeData.phoneNumber[getRandomInt(0, 9)], 
  //   preferredLanguage: 'english', preferredCurrency: 'USD', homeCity: fakeData.city[getRandomInt(0, 50)], photo: faker.image.imageUrl()};

  var randomObj = {firstName: 'kevin', lastName: 'fang', gender: 'male', email: 'fake@gmail.com', phoneNumber: '1299944104', 
    preferredLanguage: 'english', preferredCurrency: 'USD', homeCity: 'sf', photo: faker.image.imageUrl()};


  db.addUser(randomObj, (data)=> {
    res.status(201);
    count++;
    // console.log(count, randomObj.firstName);
    // console.log('-------------------', data.info.insertId);
    res.send({userId: data.info.insertId});
  });
});


//${obj.userId}, ${obj.locationId}, '${obj.locationCity}
//if location id is not in db, add/ send to vino, else, do nothing 
//then updateRecentHistory
app.post('/updateSearchHistory', (req, res) => {
  console.log('updateSearchHistory', req.body );
  var id = {userId: getRandomInt(start, end), locationId: fakeData.locationId[getRandomInt(0, 50)], locationCity: fakeData.city[getRandomInt(0, 50)]};
  console.log('userId:', id.userId);
  console.log('------------------------------------------------------------------');
  console.log(req.body);
  db.updateSearchHistory(id, (notInDatabase)=> {
    if (notInDatabase) {
      db.updateRecentSearch(id.userId, id.locationId, () => {
        res.status(201);
        count++;
        console.log(count, id.userId);
        res.send('send to vino');
      });
    } else {
      db.updateRecentSearch(id.userId, id.locationId, () => {
        res.status(201);
        count++;
        console.log(count, id.userId);
        res.send('in db, do nothing');
      });
    }
  });
});
 
app.post('/userRecentSearch', (req, res) => {
  // console.log('!!!', userRecentSearchResults)
  // console.log('in recent', req.body.userId);
  // console.log('--------------------------------------------');
  db.userRecentSearch(parseInt(req.body.userId), (data) => {
    // send a post to aws: 
    userRecentSearchResults({userId: req.body.userId, recent: data});
    res.status(201);
    res.send(data);
  });
});

app.get('/nothing', (req, res)=> {
  count++;
  console.log(count);
  res.status(200);
  res.send('hi');
});

//invoke the server turning it on and having it listen for incoming requests
app.listen(3000, () => console.log('server is running 3000'));


//siege -c200 -r1 http://localhost:3000/addUser

//********************************************************************************************
//********************************************************************************************
//previous testing routes: 
app.get('/updateSearchHistory', (req, res) => {
  var id = {userId: getRandomInt(start,end), locationId: fakeData.locationId[getRandomInt(0, 50)], locationCity: fakeData.city[getRandomInt(0, 50)]};
  // console.log(id.userId)
  db.updateSearchHistory(id, (notInDatabase)=> {
    if (notInDatabase) {
      db.updateRecentSearch(id.userId, id.locationId, () => {
      res.status(200);
           count++;
    // console.log(count, id.userId)
      res.send('send to vino');
        
      });
    } else {
      db.updateRecentSearch(id.userId, id.locationId, () => {
      res.status(200);
           count++;
    // console.log(count, id.userId)
      res.send('in db, do nothing');
        
      });
    }
  });
});

app.get('/userRecentSearch', (req, res) => {
  // console.log('in recent');
  // var x = getRandomInt(start, 1000);
  db.userRecentSearch(100, (data) => {
    // console.log(x)
    res.status(200);
    res.send(data);
  });
});


// app.get('/addUser', (req, res) => {
//   var randomObj = {firstName: fakeData.names[getRandomInt(0, 50)], lastName: fakeData.names[getRandomInt(0, 50)], gender: fakeData.gender[getRandomInt(0, 3)], email: fakeData.email[getRandomInt(0, 50)], phoneNumber: fakeData.phoneNumber[getRandomInt(0, 9)], 
//     preferredLanguage: 'english', preferredCurrency: 'USD', homeCity: fakeData.city[getRandomInt(0, 50)], photo: faker.image.imageUrl()};

//   db.addUser(randomObj, (data)=> {
//     res.status(200);
//      count++;
//     // console.log(count, randomObj.firstName)
//     res.send(randomObj);
//   });
// });

//xcAK@37!bct&4i*m%q$JDOvL8L3!l8
// console.log('!!!', userRecentSearchResults);
