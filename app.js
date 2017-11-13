const { Client } = require('pg') //{shorter syntax} = require pg module
const client = new Client({ //JS object with properties referring to parts of connectionstring
	database: 'bulletin_board',
  host: 'localhost',
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD
});
// console.log(process.env.POSTGRES_USER)

//required modules
var express = require('express');
var fs = require('fs')
var bodyParser = require('body-parser');//req.body
var app = express();

//declared dependancies
app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}));

//connection string for environment variable (alternative way of setting up process.env)
// var connectionString = (`postgres://${process.env.POSTGRES_USER}@localhost:8000/bulletinboard`);

// client.query from server to database: insert input into table messages(title, body)
client.connect()

// GET homepage(index.pug)
app.get('/', function(request, response) { //necessary to load page
	response.render('index');
});

//POST: write/post user input (messages) to database on server//handles post request together with query
app.post('/', function (req,res) {
	console.log(req.body.field1) //pointing to value of property "field1" in req.body object
	console.log(req.body.field3)

	client.query(`insert into messages (title, body) values( '${req.body.field1}', '${req.body.field3}' )`, (err) => {
  		console.log(err ? err.stack : 'your message has been added to the database') //
 		res.redirect('/')	
	})

}); 

// app.get('/display')
app.get('/display', function(request, response) {

	client.query('select * from messages', (err, result) => {
		console.log(err ? err.stack :result.rows)
		response.render('display', {bananas: result.rows})
	});
});

app.listen(8000, function() {
    console.log('Bulletin board listening on port 8000!')
})