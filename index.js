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

 var search_type="";
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
	var userMessage = req.body.userMessage
	var userQuickreply = req.body.userQuickreply
	var senderID = req.body.senderID
	var bookname = "Poision Shu"
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
                    "type":"web_url",
                    "url":"https://dbtestingwp.herokuapp.com/edit_book/"+senderID+"/"+bookname,
                    "title":"Edit Books",
                    "webview_height_ratio": "full"
                  },
               ]}

        ]
      }
    }
  }
  })
	}
	if (userMessage == 'bytyping')
	{
		var bookname ='Poision Shu';
		recomandhBooks(senderID,bookname)
	}
	if(userMessage == 'author')
	{
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
                  
                  {
                    "type":"postback",
                    "payload":"byauthor",
                    "title":"By Author",
                    "webview_height_ratio": "full"
                  },
               ]}

        ]
      }
    }
  }
  })
	}
	if(userInput == 'byauthor')
	{
	   //search_type = userInput;
	   QuickReplyforAuthor(senderID,"Please Type AuthorName")
	}
	//if(search_type == 'byauthor')
	if(userQuickreply == 'authorauthor')
	{
		search_type = userQuickreply;
		// console.log("UsermMessage",userMessage);
		// db.collection("Bookkk").where("author",'==',`${userMessage}`).get().then(bauthorlist=>{
		// 	bauthorlist.forEach(doc=>{
		// 		console.log("Book",doc.id);
  //               textMessage(senderID,doc.id);                 
 
		// 	})
		// })	
		console.log("Searchtype",search_type);
	}
	if(search_type == 'authorauthor')
	{
		console.log("searrchtype",search_type);
		console.log("UsermMessage",userMessage);
		db.collection("Bookkk").where("author",'==',`${userMessage}`).get().then(bauthorlist=>{
			bauthorlist.forEach(doc=>{
				console.log("Book",doc.id);
                textMessage(senderID,doc.id);                 
 
			})
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

// app.get('/test', (req, res) => {
// 	searchBooks(2925293107548096, 'Poision Shu');
// });

 function byAuthor(senderID,userMessage)
 {
 	// db.collection("Bookkk").where('author','==',`${usermessage}`).get().then(bookauthorlist=>{
 	// 	bookauthorlist.forEach(doc=>{
 	// 		textMessage(senderID,doc.id);
 	// 		console.log("BBookName",doc.id);
 	// 	})
 	// })
 	textMessage("SendID",senderID);
 	textMessage("FinalUserMessage",userMessage);
 }

 function QuickReplyforAuthor(senderID,text)
  {
    requestify.post(sendmessageurl,
   {  
      "recipient":{
        "id":senderID
  },
  
  "message":{
      "text": "hello",
       "quick_replies":[
      {
        "content_type":"text",
        "title":text,
        "payload":"authorauthor"
        
      }
    ]
  }
  }).then(result=>{ console.log("ok")
      }).catch(err=>{console.log("err",err)}) 
  }

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
	var bookshopaddress = req.body.bookshopnameaddress;
	var bookshopphno = req.body.bookshopphno;
	var stock = req.body.stock; 
	var adminid = req.body.sender;
	var link = req.body.link;
    
	
    
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
    if (req.body.biography)
    {
    	elements.push(req.body.biography);
    }
    if (req.body.science)
    {

        elements.push(req.body.science);
    }
    console.log(elements);

   // db.collection("Bookkk").doc("Doctor").collection("bookshop").get().then(list => {
   //      list.forEach(doc=>
   //      {
   //      	console.log("BookshopAddress",doc.data().bookshopaddress);
   //      	console.log("stock",doc.data().stock);
   //      })
   //   })

  
     
     db.collection("Bookkk").get().then(booklist=>{
     	booklist.forEach(doc=>{
     		if(doc.id == bookname)
     		{
     			db.collection("Bookkk").doc(bookname).collection("bookshop").doc(bookshopname).set({
     				address:bookshopaddress,
     				bookshopphno:bookshopphno,
     				stock:stock,
     				link:link,
     			    adminid:adminid

     			})
     		}
     		else
     		{
                	 db.collection("Bookkk").doc(bookname).set({genre:elements,author:author});
                	 db.collection("Bookkk").doc(bookname).collection("bookshop").doc(bookshopname).set({
     				address:bookshopaddress,
     				bookshopphno:bookshopphno,
     				stock:stock,
     				link:link,
     			    adminid:adminid

     			})
     		}
     	})
     })
     

})


app.get('/edit_book/:sender_id/:bookname',function(req,res){
  const sender_id = req.params.sender_id;
  const bookname = req.params.bookname;
  var link;
  var bookshopname;
  var bookshopaddress;
  var stock;
  var bookshopphno;
 		db.collection("Bookkk").doc(bookname).collection("bookshop").where('adminid','==',`${sender_id}`).get().then(booklist=>{
           booklist.forEach(doc=>{
           	link = doc.data().link;
           	bookshopname = doc.id;
           	bookshopaddress = doc.data().address;
           	stock = doc.data().stock;
           	bookshopphno = doc.data().bookshopphno;
           })
            console.log("Link",link);
      console.log("bookshopname",bookshopname);
      console.log("BookshopAddress",bookshopaddress);
      console.log("stock",stock);
      console.log("bookshopphno",bookshopphno);
    res.render('edit_book.ejs',{ title:"Please Edit Books", sender_id:sender_id,link:link,bookshopname:bookshopname,bookshopaddress:bookshopaddress,stock:stock,bookshopphno,bookname:bookname});
 		})
     
});

app.post('/edit_book',function(req,res){
	let link =  req.body.link;
	let bookshopaddress = req.body.bookshopaddress;
	let stock =req.body.stock;
	let bookshopphno = req.body.bookshopphno;
	let bookname = req.body.bookname;
	let bookshopname = req.body.bookshopname;

	db.collection('Bookkk').doc(bookname).collection("bookshop").doc(bookshopname).update({address:bookshopaddress,stock:stock,bookshopphno:bookshopphno,link:link},{merge: true})
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
    if (webhook_event.message) {
    	if (webhook_event.message.text) 
    	{
    		var userMessage=webhook_event.message.text;
    	}
	
		if (webhook_event.message.attachments)
		{
			var userMedia=webhook_event.message.attachments.payload;
		}

		if(webhook_event.message.quick_reply)
		{
			var userQuickreply=webhook_event.message.quick_reply.payload;
		}
}
	 
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
					userMessage: userMessage || null,
					userQuickreply: userQuickreply || null,
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

function textBookMessage(senderID,pretext,result){
	requestify.post(sendmessageurl, {
		"recipient":{
		"id":senderID},
		"message":{
			"text":pretext + " : " +result
		}
	})
}
function textBookAddress(senderID,pretext,result){
	requestify.post(sendmessageurl, {
		"recipient":{
		"id":senderID},
		"message":{
			"text":pretext + " : " +result
		}
	})
}

function recomandhBooks(senderID,bookname)
{
 
   var docid='a';
   
  // db.collection("Bookkk").get().then(booklist=>{
  // 	booklist.forEach(doc=>{     
  //      docid =doc.id;
  //      console.log("-----------------",docid);
  //       db.collection("Bookkk").get().then(genrelist=>{
  //        genrelist.forEach(doc=>{
  //        	  console.log("DOc",docid);
  //        	  if(doc.id == docid)
  //        	  {
  //        	  	bookwithgenre.push(docid,doc.data().genre);
  //        	  	console.log(bookwithgenre);
  //        	  }
  //        })
  //       })
  // 	})
  // })

//           db.collection("Bookkk").get()
// 		.then(querySnapshot => {
//     querySnapshot.forEach(doc => {    
//         bookwithgenre.push(doc.id,doc.data().genre);
//         console.log('BBBBBBBBB--',bookwithgenre);
//     })
// })

// 		 db.collection("admin").get()
// 		.then(querySnapshot => {
//     querySnapshot.forEach(doc => {    
//         userwithhobby.push(doc.id,doc.data().hobby);
//         console.log("uuuuuuuuuuuu--",userwithhobby);
//         //console.log('----------',userwithhobby.size());
//         //console.log('++++++++',userwithhobby.length();
//     })
// })
         let bookwithgenre=[,];
    	let userwithhobby=[];
    	var z;
    	var row;
    	var col;
       db.collection("admin").where('id','==',`${senderID}`).get().then(hobbylist=>{
       	   hobbylist.forEach(doc=>{
       	   	 userwithhobby = doc.data().hobby;
       	   })

       	   db.collection("Bookkk").get().then(genrelist=>{
       	   	genrelist.forEach(doc=>{
       	   		if (doc !== null) {
       	   			bookwithgenre.push({
       	   				name: doc.id,
       	   				genre: doc.data().genre // array
       	   			});
       	   		}
       	   	});


       	   	// LINQ Where -> JS filter
       	   	// LINQ Select -> JS map
       	   	// LINQ Any -> JS some
       	   	// LINQ All -> JS every

       	   	try {
       	   		const output = bookwithgenre
       	   			.filter(
       	   				book => book.genre.every(
       	   					gen => userwithhobby.includes(gen)
       	   				)
       	   			)
       	   			.map(result => {
       	   				textBookMessage(senderID,"Recomanded Book : ",result.name);
       	   			});
                    
       	   		console.log(output);
       	   } catch (e) {
       	   		console.error(e);
       	   }
          
       })

       	})

       


        

}






