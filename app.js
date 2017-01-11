'use strict';

// Enable actions client library debugging
process.env.DEBUG = 'actions-on-google:*';

let ApiAiAssistant = require('actions-on-google').ApiAiAssistant;
let express = require('express');
let bodyParser = require('body-parser');

let app = express();
app.set('port', (process.env.PORT || 8080));
app.use(bodyParser.json({type: 'application/json'}));

const GET_PASSWORD_ACTION = 'get_password';
const SET_PASSWORD_ACTION = 'set_password';

let passCodeMap = new Map();

app.post('/', function (request, response) {
	console.log('headers: ' + JSON.stringify(request.headers));
	console.log('body: ' + JSON.stringify(request.body));

	const assistant = new ApiAiAssistant(
		{request: request, response: response});

	let user = assistant.getUser();
	let userId = "";

	if(user){
		console.log("\n user is not null \n");
		userId = user.user_id;
	}
	else{
		console.log("\n user is null \n");
		userId = "testUserId";
	}

	function addSpaces(word) {
		var newWord = '';

		for (var x = 0; x < word.length; x++){
			newWord += word[x] + ' <break time="350ms" /> ';
		}

		return newWord;
	}



	function getPassword(assistant){
		console.log('getPassword called');

		let passCode = passCodeMap.get(userId);


		if(passCode){
			assistant.tell('<speak> Your wifi password is ' +  addSpaces(passCode) + ' </speak>');
		}
		else{
			assistant.ask('You haven\'t set a wifi password yet!');
		}
	}

	function setPassword(assistant){
		console.log('setPassword called');

		let phoneNumber = assistant.getArgument('phone-number');



		let passCode = phoneNumber;
		passCodeMap.set(userId, passCode);

		assistant.ask('okay ive set that');
	}


	//TODO: Change the actions in this map
	let actionMap = new Map(); 
	actionMap.set(GET_PASSWORD_ACTION, getPassword);
	actionMap.set(SET_PASSWORD_ACTION, setPassword);

	assistant.handleRequest(actionMap);

});


var server = app.listen(app.get('port'), function () {
	console.log('App listening on port %s', server.address().port);
	console.log('Press Ctrl+C to quit.');
});




