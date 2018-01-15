//**************SENDING/POSTING**************
//my amazon keys for user 'root' created on aws 
var amazonKeys = require('../config.js');
//npm easy-sql DOCS: https://www.npmjs.com/package/easy-sqs
var easy = require('easy-sqs');


var sendToRecentQueue = (recentSearchIds) => {
  var awsConfig = {
    'accessKeyId': amazonKeys.accessKeyId,
    'secretAccessKey': amazonKeys.secretAccessKey,
    'region': amazonKeys.region
  };
  //url for "pleaseWork queue"
  var url = 'https://sqs.us-east-1.amazonaws.com/463577721618/userRecentSearchResults';
  //client for connecting/creating messages
  var client = easy.createClient(awsConfig);

  client.getQueue(url, function(err, queue) {
    if (err) { console.log('queue does not exist'); }
    //messages must be strings for now...
    var msg = JSON.stringify(recentSearchIds);
    queue.sendMessage(msg, function(err) {
      if (err) { 
        console.log('send failed!', err); 
      } else {
        console.log('sent!!!!!!!!');
      }
    });
  });
};


module.exports = sendToRecentQueue;

