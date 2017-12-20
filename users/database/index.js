//require mysql library to allow us to use javascript to work with database
const mariasql = require('mariasql');
const fakeData = require('../server/fakeData.js');
const MariaSQL = require('mariasql-promise');
var getRandomInt = function(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
};


// const Promise = require("bluebird");
//create a connection to the database and pass in the correct information to sign in (unique per person)
const connection = new mariasql({
  host: 'localhost',
  user: 'root',
  password: 'plantlife',
  database: 'userService'
});


const db = new MariaSQL();
const connect = db.connect({
  host: 'localhost',
  user: 'root',
  password: 'plantlife',
  db: 'userService'
});

const updateSearchHistory = (obj, cb) => {
  connect.then(function() {
    const selectSavedLocations = db.query(`SELECT * from savedLocations WHERE userId = ${obj.userId};`)
      .then(function(results) {
        var arr = [];
        results.forEach(el=> arr.push(el.locationId));
        if (arr.includes(obj.locationId.toString())) {
          cb(false);
        } else {
          const addToSavedLocations = db.query(`INSERT into savedLocations (userId, locationId, locationCity) VALUES (${obj.userId},${obj.locationId},'${obj.locationCity}');`)
            .then(function() {
              cb(true);
            });
        }
      });
    return Promise.all([selectSavedLocations]);
  }).catch(function(e) {
    console.log('We have a problem', e.message, e.stack);
  });
};
// var id = {userId: 3000, locationId: 111, locationCity: fakeData.city[getRandomInt(0, 50)]};

// searchLocation(id, function(data){console.log(data)})

const addUser = (userInfo, cb) => {
  // var userInfo = {firstName: fakeData.names[getRandomInt(0, 50)], lastName: fakeData.names[getRandomInt(0, 50)], gender: fakeData.gender[getRandomInt(0, 3)], email: fakeData.email[getRandomInt(0, 50)], phoneNumber: fakeData.phoneNumber[getRandomInt(0, 9)], 
  //   preferredLanguage: 'english', preferredCurrency: 'USD', homeCity: fakeData.city[getRandomInt(0, 50)], photo: ' http://lorempixel.com/640/480'};
  connect.then(function() {
    // console.log('connected');
    const insertNewUser = db.query('INSERT INTO users (hostStatus) VALUES("false");')
      .then(function(results) {
        // console.log('result was:', results.info.insertId);
        const insertUserInfo = db.query(`INSERT INTO userInfo (userId, firstName, LastName, gender, email, phoneNumber,
          preferredLanguage, preferredCurrency, homeCity, photo) VALUES (${results.info.insertId}, '${userInfo.firstName}', '${userInfo.lastName}', '${userInfo.gender}', '${userInfo.email}', ${userInfo.phoneNumber}, 
          '${userInfo.preferredLanguage}','${userInfo.preferredCurrency}', '${userInfo.homeCity}', '${userInfo.photo}');`)
          .then(function(data){
            // console.log('!!!!!', data);
            const insertUserRecentSearch = db.query(`INSERT INTO recentLocations (userId, recent) VALUES (${results.info.insertId}, (''));`)
              .then(function(next){
                console.log(next.info.insertId);
                cb()
              });
          });
        // return results.info.insertId;
      });

    return Promise.all([insertNewUser]);
  }).catch(function(e) {
    console.log('We have a problem', e.message, e.stack)
  });
  
};


// const addUser = (userInfo, cb) => {
//   // userInfo.phoneNumber = userInfo.phoneNumber.split('-').join('');
//   // console.log('!!!!!!!!!!!!!!!!!!!!!!!', userInfo.phoneNumber)
//   // console.log(typeof userInfo.phoneNumber)

//   var queryString = 'USE userService;';
//   connection.query(queryString, (err, results, fields) => {
//     if (err) {
//       console.log('err1',userInfo, err);
//     } else {
//       var queryString = 'INSERT INTO users (hostStatus) VALUES("false");';
//       connection.query(queryString, (err, results, fields) => {
//         if (err) {
//           console.log('err2',userInfo, err);
//         } else {
//           var userId = results.info.insertId;
//           var queryString = `INSERT INTO userInfo (userId, firstName, LastName, gender, email, phoneNumber,
//            preferredLanguage, preferredCurrency, homeCity, photo) VALUES (${results.info.insertId}, '${userInfo.firstName}', '${userInfo.lastName}', '${userInfo.gender}', '${userInfo.email}', ${userInfo.phoneNumber}, '${userInfo.preferredLanguage}','${userInfo.preferredCurrency}', '${userInfo.homeCity}', '${userInfo.photo}');`;
//           connection.query(queryString, (err, results, fields) => {
//             if (err) {
//               console.log('err3',userInfo, err);
//             } else {
//               var queryString = `INSERT INTO recentLocations (userId, recent) VALUES (${userId}, (''));`;
//               connection.query(queryString, (err, results, fields) => {
//                 if (err) {
//                   console.log('err4', err)
//                 } else {
//                   // console.log('$$$$$$$$$$$$$$', results)
//                   console.log('added', userInfo.firstName);
//                   //old cb(userId);

//                   cb();
//                 }
//               })
//             }
//           });
//         }
//       });
//     }
//   });
// };

// const updateSearchHistory = (obj, cb) => {
//   // var id = {userId: 2, locationId: 4, locationCity: faker.address.city()};
//   var queryString = 'USE userService;';
//   connection.query(queryString, (err, results, fields) => {
//     if (err) {
//       console.log('err', userInfo, err);
//     } else {
//       var queryString = `SELECT * from savedLocations WHERE userId = ${obj.userId};`;
//       connection.query(queryString, (err, results, fields) => {
//         if (err) {
//           console.log('err', err);
//         } else {
//           if (results.filter(el => parseInt(el.locationId) === obj.locationId).length === 0) {
//             //add to db 
//             // console.log(results.filter(el => parseInt(el.locationId) === obj.locationId).length, parseInt(results[2].locationId), obj.locationId);
//             var queryString = `INSERT into savedLocations (userId, locationId, locationCity) VALUES (${obj.userId},${obj.locationId},'${obj.locationCity}');`;
//             connection.query(queryString, (err, results, fields) => {
//               if (err) {
//                 console.log(err);
//               } else {
//               //send to 
//               //if true, send to aggregator . False close response 
//                 cb(true);
//               }
//             });
//           } else {
//             cb(false);
//           }          
//         }
//       });
//     }
//   });
// };


const updateRecentSearch = function (id, locationId, cb) {
  var queryString = 'USE userService;';
  connection.query(queryString, (err, results, fields) => {
    if (err) {
      console.log('err', err);
    } else {
      console.log('pre',results);
            var queryString = `SELECT * from recentLocations WHERE userId = ${id}`;

      // var queryString = `SELECT * from recentLocations WHERE userId = 2003;`;
      connection.query(queryString, (err, results, fields) => {
        if (err) {
          console.log('err2', err);
        } else {
          console.log('!!!', results)
          var recent = results[0].recent;
          // console.log('id#:',id, 'string:', recent);
          //////////////////////////////////////////////////////////
          if (recent.length) {
            // console.log('Length greater than 0');
            // "location1, location2..."
            //////////////////////////////////////
            var recent = recent.split(',');
            var loc = locationId + '';
            // console.log('info, length, recent:',recent.length, recent, loc)
            //check if already a recent search
            // console.log(recent.filter(function(el){console.log('here', el, el === loc) }))
            // console.log('@@@@@@@@@@@', recent.includes(loc))
            if (!recent.includes(loc)) {
              if (recent.length >= 5) {
                // console.log('FULL HOUSE');
                recent.pop();
                recent.unshift(loc);
                var queryString = `UPDATE recentLocations SET recent = "${recent}" WHERE userId = ${id};`;
                connection.query(queryString, (err, results, fields) => {
                  if (err) { 
                    console.log('err more than 5 no repeat', err)
                  } else {
                    console.log('at max 5, no repeat', recent)
                    cb();
                  }
                });
              } else {
                recent.unshift(loc);
                var queryString = `UPDATE recentLocations SET recent = "${recent}" WHERE userId = ${id};`;
                connection.query(queryString, (err, results, fields) => {
                  if (err) { 
                    console.log('err less than 5 recents', err)
                  } else {
                    console.log('less than 5', recent)
                    cb();
                  }
                });
              }
            } else {
              console.log('repeat/move to front');
              if (recent.length === 1){
                console.log('only one thing, we good');

                cb();
              } else {
                //mvp it and later come back and make faster 
                recent.splice(recent.indexOf(loc), 1);
                recent.unshift(loc);
                var queryString = `UPDATE recentLocations SET recent = "${recent}" WHERE userId = ${id};`;
                connection.query(queryString, (err, results, fields) => {
                  if (err) { 
                    console.log('err less than 5 recents', err)
                  } else {
                    console.log('moved to front & below max', recent)
                    cb()
                  }
                });
              }
            } 
          } else {
            //"location"
            console.log('first time adding something to recents');
            var queryString = `UPDATE recentLocations SET recent = "${locationId}" WHERE userId = ${id};`;
            connection.query(queryString, (err, results, fields) => {
              if (err) {
                console.log('err4', err)
              } else {
                cb()
              }
            });
          }
        }
      });
    }
  });
};



const userRecentSearch = function(id, cb) {
  var queryString = 'USE userService;';
  connection.query(queryString, (err, results, fields) => {
    if (err) {
      console.log('err');
    } else {
      var queryString = `SELECT * from recentLocations WHERE userId = ${id}`;
      connection.query(queryString, (err, results, fields) => {
        var locationArray = results[0].recent.split(',').map(el => parseInt(el));
        console.log(locationArray)
        cb(locationArray);
      });
    }
  });
};
// const updateRecentSearch = function (id, locationId) {
//   var queryString = 'USE userService;';
//   connection.query(queryString, (err, results, fields) => {
//     if (err) {
//       console.log('err', err);
//     } else {
//       var queryString = `SELECT * from recentLocations WHERE userId = ${id}`;
//       connection.query(queryString, (err, results, fields) => {
//         console.log('Found new user:', results[0] === undefined);
//         //if empty (new user with no recent history)
//         if (results[0] === undefined) {
//           //create empty string for new user and then insert 
//           var queryString = `INSERT INTO recentLocations (userId, recent) VALUES (${id}, (''));`;
//           connection.query(queryString, (err, results, fields) => {
//             if (err) {
//               console.log('err', err)
//             } else {
//               console.log('$$$$$$$$$$$$$$', results)
//             }
//           })

//         } else {
//           console.log(results[0].recent);
//           var updatedArray = results[0].recent;
//           console.log('%%%%%%%%%%%%%%%', updatedArray.split(','));
//           if (updatedArray === "") {
//             var queryString = `INSERT INTO recentLocations (userId, recent) VALUES (${id}, ('${locationId}'));`;
//             connection.query(queryString, (err, results, fields) => {
//               if (err) {
//                 console.log('why am i not using promises :(')
//               } else {
//                 console.log('added into db')
//               }
//             });
//           } else {
//             console.log('not empty')

//           }

//         }
//       }) 
//     }
//   });
// };



//get search history

//add review 
//delete review 
//update user info ? 



// const getSearchHistory = (userId, cb) => {
//   var queryString = 'USE userService;';
//   connection.query(queryString, (err, results, fields) => {
//     if (err) {
//       console.log('err', err);
//     } else {
//       var queryString = `SELECT locationId from savedLocations WHERE userId = ${userId};`;
//       connection.query(queryString, (err, results, fields) => {
//         cb(results);
//       });
//     }
//   });
// };
console.log('starting...')
var dbLoadUsers = () => {
  console.log('inside!')
  for (var i = 0; i < 10000; i++) {
    // console.log(i)
    var randomObj = {firstName: fakeData.names[getRandomInt(0, 50)], lastName: fakeData.names[getRandomInt(0, 50)], gender: fakeData.gender[getRandomInt(0, 3)], email: fakeData.email[getRandomInt(0, 50)], phoneNumber: fakeData.phoneNumber[getRandomInt(0, 9)], 
      preferredLanguage: 'english', preferredCurrency: 'USD', homeCity: fakeData.city[getRandomInt(0, 50)], photo: ' http://lorempixel.com/640/480'};
    addUser(randomObj, () => {console.log('')});
  }
};

// dbLoadUsers();

module.exports = {
  addUser: addUser,
  updateSearchHistory: updateSearchHistory,
  updateRecentSearch: updateRecentSearch,
  userRecentSearch: userRecentSearch
};

// INSERT into savedLocations (userId, locationId, locationCity) VALUES (3000,111,'oside');