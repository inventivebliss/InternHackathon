//Lets require/import the HTTP module
var http = require('http');
var url = require("url");
//Lets define a port we want to listen to
const PORT=8080; 

//We need a function which handles requests and send response
function handleRequest(request, response){
    var parsedUrl = url.parse(request.url, true);
    //response.end('It Works!! Path Hit: ' + parsedUrl.query.id);
	for (var key in parsedUrl ) {
  console.log(key);
}

var Promise = require('bluebird')
var adb = require('adbkit')
var client = adb.createClient()
 
client.listDevices()
  .then(function(devices) {
    return Promise.map(devices, function(device) {
      client.shell(device.id, ' export PATH="$PATH:/home/local/ANT/aadils/Android/Sdk/platform-tools"')
	client.shell(device.id, 'monkey -p net.one97.paytm -c android.intent.category.LAUNCHER 1')      
	setTimeout(function(){
	client.shell(device.id, 'input tap 270 350')
	 setTimeout(function(){
               	 client.shell(device.id, 'input text "9940349767"')
        },2000)	
	},15000)

 setTimeout(function(){
                client.shell(device.id, 'input tap 270 650')
        },18500)

setTimeout(function(){
        client.shell(device.id, 'input text "5"')
        },20000)

setTimeout(function(){
	 client.shell(device.id, 'input tap 180 1250')
},22000)

setTimeout(function(){
         client.shell(device.id, 'input tap 270 850')
},26000)


setTimeout(function(){
         client.shell(device.id, 'input tap 270 1100')
},29000)

setTimeout(function(){
         client.shell(device.id, 'input tap 270 500')
},35000)

        .then(adb.util.readAll)
        .then(function(output) {
          console.log('[%s] %s', device.id, output.toString().trim())
        })
    })
  })
  .then(function() {
    console.log('Done.')
  })

  .catch(function(err) {
    //console.error('Something went wrong:', err.stack)
  })
 response.end('It Works!! Path Hit: ' + parsedUrl.query.id);
}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});