//express is the server
// require allows us to use node modules that we npm/bower/yarn/ect installed
const express = require('express');
const app = express();
const db = require('../database/index.js');
const faker = require('faker');
const fakeData = require('./fakeData.js');
var start = 10000;
var end = 20000;

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
  var randomObj = {firstName: fakeData.names[getRandomInt(0, 50)], lastName: fakeData.names[getRandomInt(0, 50)], gender: fakeData.gender[getRandomInt(0, 3)], email: fakeData.email[getRandomInt(0, 50)], phoneNumber: fakeData.phoneNumber[getRandomInt(0, 9)], 
    preferredLanguage: 'english', preferredCurrency: 'USD', homeCity: fakeData.city[getRandomInt(0, 50)], photo: faker.image.imageUrl()};

  db.addUser(randomObj, (data)=> {
    res.status(200);
     count++;
    console.log(count, randomObj.firstName)
    res.send(randomObj);
  });
});

//${obj.userId}, ${obj.locationId}, '${obj.locationCity}

//if location id is not in db, add/ send to vino, else, do nothing 
//then updateRecentHistory
app.get('/updateSearchHistory', (req, res) => {
  var id = {userId: getRandomInt(start,end), locationId: fakeData.locationId[getRandomInt(0, 50)], locationCity: fakeData.city[getRandomInt(0, 50)]};
  console.log(id.userId)
  db.updateSearchHistory(id, (notInDatabase)=> {
    if (notInDatabase) {
      db.updateRecentSearch(id.userId, id.locationId, () => {
      res.status(200);
           count++;
    console.log(count, id.userId)
      res.send('send to vino');
        
      });
    } else {
      db.updateRecentSearch(id.userId, id.locationId, () => {
      res.status(200);
           count++;
    console.log(count, id.userId)
      res.send('in db, do nothing');
        
      });
    }
  });
});
 
app.get('/userRecentSearch', (req, res) => {
  db.userRecentSearch(30, (data) => {
    res.status(200);
    res.send(data);
  });
});

app.get('/nothing', (req,res)=> {
       count++;
    console.log(count)
  res.status(200);
  res.send('hi');
})

//invoke the server turning it on and having it listen for incoming requests
app.listen(3000, () => console.log('server is running 3000'))


// firstName varchar(20) NOT NULL,
//   lastName varchar(20) NOT NULL,
//   gender varchar(20) NOT NULL,
//   -- birthDate DATE NOT NULL,
//   email varchar(20) NOT NULL,
//   phoneNumber int(20) NOT NULL,
//   preferredLanguage varchar(20) NOT NULL,
//   preferredCurrency varchar(20) NOT NULL,
//   homeCity varchar(20) NOT NULL,
//   photo varchar(20) NOT NULL,

//siege -c200 -r1 http://localhost:3000/addUser