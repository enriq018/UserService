//**************RECIEVING/LISTENING**************
//my amazon keys for user 'root' created on aws 
var amazonKeys = require('../config.js');
//npm easy-sql DOCS: https://www.npmjs.com/package/easy-sqs
var easy = require('easy-sqs');
var request = require('request');
var awsConfig = {
  'accessKeyId': amazonKeys.accessKeyId,
  'secretAccessKey': amazonKeys.secretAccessKey,
  'region': amazonKeys.region
};
//url for "pleaseWork queue"
var url = 'https://sqs.us-east-1.amazonaws.com/463577721618/userRecentSearchInput';
// //client for connecting/creating messages
var client = easy.createClient(awsConfig);
// client.getQueue(url, function(err, queue) {
//   if (err) { console.log('queue does not exist'); }
//   //messages must be strings for now...
//   var msg = JSON.stringify({body: 'hello there!!!!'});
//   queue.sendMessage(msg, function(err) {
//     if (err) { console.log('send failed!'); }
//   });
// });
//reader to read messages stored in queue
//after messages are read, they are deleted from queue 
const options = {
  method: 'POST',
  uri: 'http://localhost:3000/updateSearchHistory',
  body: {
    foo: 'bar'
  },
  json: true 
  // JSON stringifies the body automatically
};

let checkQueue = () => {
  var queueReader = client.createQueueReader(url);
  queueReader.on('message', function (message) {
    //process message.Body here...
    console.log(Object.keys(message), message['Body']);
    var data = message['Body'];
    console.log('^^^^^^^^^', data)
    // console.log('-------------------')
    request.post(
      'http://localhost:3000/userRecentSearch',
      { json: { userId: data } },
      function (error, response, body) {
        if (!error) {
          console.log('worked now deleting:', data);
          queueReader.deleteMessage(message);

        }
      }
    );
  });
  queueReader.on('error', function (err) {
    console.log('error', err);
  });
  //creates and maintains open connection to queue 
  queueReader.start();
  console.log('looking...');
};
checkQueue();
