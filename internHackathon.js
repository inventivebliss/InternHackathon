exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */
        /*
        if (event.session.application.applicationId !== "amzn1.echo-sdk-ams.app.[unique-value-here]") {
             context.fail("Invalid Application ID");
         }
        */

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                     event.session,
                     function callback(sessionAttributes, speechletResponse) {
                        context.succeed(buildResponse(sessionAttributes, speechletResponse));
                     });
        }  else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                     event.session,
                     function callback(sessionAttributes, speechletResponse) {
                        context.succeed(buildResponse(sessionAttributes, speechletResponse));
                     });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId
                + ", sessionId=" + session.sessionId);
}

function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId
                + ", sessionId=" + session.sessionId);
    getWelcomeResponse(callback);
}


function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId
                + ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;

    if ("RechargeIntent" === intentName) {
        rechargeSession(intent, session, callback);
    } else if ("HelpIntent" === intentName) {
        getHelpResponse(callback);
    } else {
        throw "Invalid intent";
    }
}

function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId
                + ", sessionId=" + session.sessionId);
    // Add cleanup logic here
}

// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse(callback) {
    var sessionAttributes = {};
    var cardTitle = "Welcome";
    var speechOutput = "Hi there ,"
                + "What can i do for you today ";
 
    var repromptText = "You can ask me to recharge your phone or pay a bill ";
    var shouldEndSession = false;

    callback(sessionAttributes,
             buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}
function getHelpResponse(callback) {
    var sessionAttributes = {};
    var cardTitle = "Welcome";
    var speechOutput = "You can ask me to recharge or top-up your phone by saying a contact and amount";
 
    var repromptText = null;
    var shouldEndSession = false;

    callback(sessionAttributes,
             buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function rechargeSession(intent, session, callback) {
    var cardTitle = "Recharge";
    var mobile = intent.slots.mobile;
    var amount = intent.slots.amount.value;
    var repromptText = "";
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";

    if (mobile && amount) {
        var mobile_name = mobile.value;
        sessionAttributes = createMobileAttributes(mobile_name);
        speechOutput = "Yeah sure, i'll get it done. Anything else?";
        repromptText = null;
    } else {
        speechOutput = "I didn'y get the mobile number correrctly.";
        repromptText = "You can ask me to recharge some one phone again? ";
    }

    recharge(mobile_name,amount,sessionAttributes,cardTitle, speechOutput, repromptText, shouldEndSession,callback);
	
}

function createMobileAttributes(mobile_name) {
    return {
        mobile_name: mobile_name
    };
}

function recharge(mobile_name,amount,sessionAttributes,cardTitle, speechOutput, repromptText, shouldEndSession,callback) {
    var http = require('http');
    var responseString = '';
    var query='/?mobile=' + mobile_name +'&amount=' + amount;
var options = {
host: '0c929732.ngrok.io',
port: 80,
path: query,
headers: {'arn': 941839354966 },
method: 'GET'
};

var req = http.request(options, function(res){
    console.log('sandeep')
res.setEncoding('utf-8');


res.on('data', function(data) {
responseString += data;
});

callback(sessionAttributes,
             buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
});
req.write(""); 
req.end();
console.log(responseString);

}

// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: "SessionSpeechlet - " + title,
            content: "SessionSpeechlet - " + output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    }
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    }
}