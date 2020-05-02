'use strict';

// Imports dependencies and set up http server
	const
	requestify=require('requestify'),
	express = require('express'),
	bodyParser = require('body-parser'),
	 request = require('request'),
  	ejs = require("ejs"),
 	fs = require('fs'),
	PageAccessToken=process.env.PAGE_ACCESS_TOKEN,
	app = express().use(bodyParser.json()); // creates express http server 
	const sendmessageurl='https://graph.facebook.com/v4.0/me/messages?access_token='+PageAccessToken
	
app.use(express.static('public'));
app.use(express.urlencoded());


app.set('view engine', 'ejs');
app.set('views', __dirname+'/public');
var admin = require("firebase-admin");

var serviceAccount = {
  "type": "service_account",
  "project_id": "testing-d185c",
  "private_key_id": "c7292bfdf410a64b1420e5cbda64a48f784d42a5",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDLAYRPITfn4Sed\nlu6tCWhMZUS+8wrv2wr8z5XdZl0KSJXe2GipeG9NazfTmSiDZ9JOv2kk8MnsxXWN\nGLmgJzJzuNMmL6U10qEgDzXu5mIq1h8WBklblkIok9IlZTRve+hwjcnhG1SJcC5L\nSV+XUDAxkRhvTrENUr9gCauwqwmnqpUEPPDYcoPNStTaYxt9tx+IlIHl2Edww+qb\nh5wC19hCfuwS29SLB/3Pe9UxmpKauE2Vjms3wtb0n8v160nIOUNrhdeHdJkiErt4\n5oqe/FJdydSkC8JRWWE1hQ5tgqeexU3QwTX/15C/6gfvycHW0aZi0zNWsRQu9ao4\nRsrtJNGvAgMBAAECggEATLNeg61H268Y0jR4Kl2/D/pFLqZSkAxhSuK9u2CVL7D8\nGy4F4V4VI5mqhqK8CWYdMk6k0eW+TVzPzMc2P1n/+HQxJyDiWYMjCKNmm8Rk+81a\nAm7OobGUfpNXV3S1Cpg02u3fhFNYrfL6MszetqOACgJJyqhfQertTsJoocAFzlh6\nO9AB72yK1jm1/PlC8PgOprDYm4ElahQQB7HOHyaLM5V5aKTNQw9o3zpx1fI4yiC0\ngUMjLkqeIgE9bGnOkup47+iCvDjfcoxLsHsfzJU2R7AnlayWx4I6KDbsb4SLFjNE\nx/mU9KiQzz3/uuJFjnUp4JvnXOJjXlNxr875O3kgbQKBgQD/wT03uPaZZv/DAlp6\nGVFWl/tyODWXea9ywlMTI6ww7wtuLi5X340so0r+P+uzgq7edJ9OGFv8uEYR/k/l\nCJVtxhg3RVKOR47SAtWMz7SyxB18dyodsZp3NTb4Oc1XoqruwQCi/hnmb7aCxAJ7\nvvsiREkRuEICSKnqzlOlo5MU5QKBgQDLM1VZrBrryuM7QNwTtY5M/22+lWYtG1Z4\nBtd1NpuXbIFHRee4ZcUPOpQxdbziDrYiZp1sdPYQYL0WKmCs6PE8ebePrYzb/+2j\nM8GebwWXjtArjjkWcjbgbE0w3azxNpRt7QwAHPEMccMuUUAx7i++zxLusBRN8bOK\n0ZJ9R68XAwKBgQCcxuot9FZGZxs1gYXQ/yAbQwNCWy6O8msYoAKo4t81B/Qr0Gdc\nOo+h41+fR7PG0L89YqQdDVWmL5fUg96Z+Y8QQbSqfPZEfZ0RI+egb9rHEu04VRwe\nI7caiCZwN46mv/KkdO9c+wMJfUWWF22mScZMlSttj1P3bm+qnlwsV39b+QKBgGTX\nmOfjrYiPK63gRlfRpkk4CjKm2gpQotz2KD8XVqgTRSUl4BV3DBC+tYTGNXLKckEo\nQ7/rW6JNIAm8BjZJdE7a6On46wrTPA/eQ5xo5JGOYmj7MAGftPQzSyuRF56tw4O6\nPFZiBo5ydrapw/4DgtZi1bZ209zKspuV3ekmhhIZAoGAToIF/XykCe5y5gIA4cLC\n9nV7EReOZ6gldKLVELm1TL6qF2pT7vrVG27lexC7FRGTy6kno04Sq1hRnbrfXI8A\nWaOIoxo/2B9/eqzIjlE8b5E1gFJD+++pwA0mpX6MqSMk6XHzvQpZFrKe4QT67SW8\n3MDeXXTNvHr0QzzFUNbspp8=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-kwcp9@testing-d185c.iam.gserviceaccount.com",
  "client_id": "110420474759874787857",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-kwcp9%40testing-d185c.iam.gserviceaccount.com"
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://testing-d185c.firebaseio.com"
});

const db = admin.firestore()

	requestify.post('https://graph.facebook.com/v2.6/me/messenger_profile?access_token='+PageAccessToken,
		{"get_started":{"payload":"Hi"},
		"persistent_menu":[
			{
				"locale":"default",
				"composer_input_disabled":false,
				"call_to_actions":[
				{
					"type":"postback",
					"title":"Homehello",
					"payload":"Hi"

				},
				{
					"type":"web_url",
					"title":"Visit Page",
					"url":"https://mym-acavxb.firebaseapp.com/index.html",
					"webview_height_ratio":"tall"

				}
			]
	
		}
	],
  
  "greeting": [
    {
      "locale":"default",
      "text":"Hello {{user_first_name}}! \nWe provide service!!" 
    }
  ]

}).then(function(success) {
	console.log('persistent_menu.success');
	// body...
})

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));
app.get('/', (req, res)=>{
	res.send("Hello Ko Ko!");
})



// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {

  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = process.env.VERIFICATION_TOKEN;
   
  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
    
  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
  
    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      
      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
   	   res.status(200).send(challenge);
    
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);      
    }
  }
});

function textMessage(senderID,text){
	requestify.post(sendmessageurl, {
		"recipient":{
		"id":senderID},
		"message":{
			"text":text
		}
	})
}

app.post('/admin', (req, res) => {
	var userInput = req.body.userInput
	var senderID = req.body.senderID
	if(userInput == 'Hi'){
	//	textMessage(senderID,'Welcome Admin');
		requestify.post('https://graph.facebook.com/v2.6/me/messages?access_token='+PageAccessToken,
  {
    "recipient":{
      "id":senderID
    },
  "message":{
   "attachment":{
        "type":"template",
        "payload":{
          "template_type":"generic",
          "elements":[
             {
              "title":'hi',
              "subtitle":"Please Register Book",
                "buttons":[
                  // {
                  //    "type": "postback",
                  //   "title": "Register",
                  //   "payload" : "Fake"
                  // "url":"https://bophyo.herokuapp.com/bookregister/",
                  // "webview_height_ratio": "full",
                  // "messenger_extensions": true, 
                  // }
                  {
                    "type":"web_url",
                    "url":"https://dbtestingwp.herokuapp.com/register_books/"+senderID,
                    "title":"Register Books",
                    "webview_height_ratio": "full"
                  },
                  {
                    "type":"postback",
                   // "url":"https://bookherokuwp.herokuapp.com/book_list/",
                    "title":"Books List",
                    "payload" : "booklist"
                  },
               ]}

        ]
      }
    }
  }
  })
	}
})

app.post('/advisor', (req, res) => {
	var userInput = req.body.userInput
	var senderID = req.body.senderID
	if(userInput == 'Hi'){
		textMessage(senderID,'Welcome Advisor')
	}
})




app.post('/user', (req, res) => {
	var userInput = req.body.userInput
	var senderID = req.body.senderID
	if(userInput == 'Hi'){
		textMessage(senderID,'Welcome User')
	}
	

})

app.get('/register_books/:sender_id',function(req,res){
  const sender_id = req.params.sender_id;
    res.render('testing.ejs',{ title:"Please Register Books", sender_id:sender_id});
});

app.post('/register_books', (req,res)=> {

    var elements = [];
   
	var author = req.body.author;
	var bookshopname = req.body.bookshopname;
	var bookname = req.body.bookname;
	var bookshopaddress = req.body.bookshopaddress;
	var bookshopphno = req.body.bookshopphno;
	var stock = req.body.stock; 
    
	
    
    if(req.body.romance)
    {
    	elements.push(req.body.romance);
    }
    if (req.body.horror)
    {
    	elements.push(req.body.horror);
    }
    if (req.body.thrill)
    {
    	elements.push(req.body.thrill);
    }
    if (req.body.political)
    {
    	elements.push(req.body.political);
    }
    
     console.log(elements);



     

    // db.collection("Book").doc("collectionSu").set({genre:elements});
     db.collection("Book").doc("collectionSu").collection("collectionInnwa").doc("docinnwa").set({
     	addresss:bookshopaddress,
     	bookshopphno:bookshopphno,
     	stock:stock

     	});

})

// Creates the endpoint for our webhook 
app.post('/webhook', (req, res) => {  
 
  let body = req.body;

  // Checks this is an event from a page subscription
  if (body.object === 'page') {

    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {

      // Gets the message. entry.messaging is an array, but 
      // will only ever contain one message, so we get index 0
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);
      var senderID=webhook_event.sender.id;
      console.log('senderID',senderID);
      if(webhook_event.postback){
      	var userInput=webhook_event.postback.payload;
    }
    if (webhook_event.message) {if (webhook_event.message.text) {
    	var userInput=webhook_event.message.text;
    }
	if (webhook_event.message.attachments){
		var userMedia=webhook_event.message.attachments.payload;

	}}
	 
		db.collection('admin').where('id','==',`${senderID}`).get().then(adminList => {
			if(adminList.empty){
				db.collection('BookAdvisor').where('id','==',`${senderID}`).get().then(advisorList => {
					if(advisorList.empty){
						requestify.post('https://dbtestingwp.herokuapp.com/user', {
							userInput: userInput || null,
							senderID: senderID
						})
					}else{
						requestify.post('https://dbtestingwp.herokuapp.com/advisor', {
							userInput: userInput || null,
							senderID: senderID,
							video: userMedia
						})
					}
				})
			}else{
				requestify.post('https://dbtestingwp.herokuapp.com/admin', {
					userInput: userInput || null,
					senderID: senderID,
					image: userMedia
				})
			}
		})
	 
	
  
  
    });

    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
     } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});

function addBook(senderID)
{
	//db.collection('Book').
}






