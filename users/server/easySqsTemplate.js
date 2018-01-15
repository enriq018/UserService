//**************RECIEVING/LISTENING**************
//my amazon keys for user 'root' created on aws 
var amazonKeys = require('../config.js');
//npm easy-sql DOCS: https://www.npmjs.com/package/easy-sqs
var easy = require('easy-sqs');
var awsConfig = {
  'accessKeyId': amazonKeys.accessKeyId,
  'secretAccessKey': amazonKeys.secretAccessKey,
  'region': amazonKeys.region
};
//url to specific queue goes below:
//example: https://sqs.us-east-1.amazonaws.com/463577721618/userRecentSearchInput
var url = 'ENTER URL HERE';
var client = easy.createClient(awsConfig);
//main function responsible for listening for new messages added to queue 
let checkQueue = () => {
  var queueReader = client.createQueueReader(url);
  queueReader.on('message', function (message) {
    //------------------------------------------------------------------------
    //Here is where you want to do things with the new recieved message...
    //
    //below is how to access the message body:
    var data = message['Body'];
    console.log(data);
    // console.log(Object.keys(message), message['Body']);
    //------------------------------------------------------------------------
  });
  //error handling
  queueReader.on('error', function (err) {
    console.log('error', err);
  });
  //creates and maintains open connection to queue 
  queueReader.start();
  console.log('checking for new messages...');
};
checkQueue();


/*
//**************SENDING/POSTING**************
//my amazon keys for user 'root' created on aws 
var amazonKeys = require('../config.js');
//npm easy-sql DOCS: https://www.npmjs.com/package/easy-sqs
var easy = require('easy-sqs');
var awsConfig = {
  'accessKeyId': amazonKeys.accessKeyId,
  'secretAccessKey': amazonKeys.secretAccessKey,
  'region': amazonKeys.region
};

//url to specific queue goes below: 
var url = 'ENTER URL HERE';
//example: https://sqs.us-east-1.amazonaws.com/463577721618/userRecentSearchInput
var client = easy.createClient(awsConfig);

client.getQueue(url, function(err, queue) {
  if (err) { console.log('queue does not exist'); }
  //messages must be strings for now...
  var msg = JSON.stringify(INFORMATION TO BE SENT GOES IN HERE);
  queue.sendMessage(msg, function(err) {
    console.log('sent!')
    if (err) { console.log('send failed!'); }
  });
});
*/
