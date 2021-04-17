const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors');
const bodyParser = require('body-parser');

require('dotenv').config();

const port = process.env.PORT || 5055;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
	res.send('Hello World!');
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0q0ko.mongodb.net/${process.env
	.DB_NAME}?retryWrites=true&w=majority`;
// console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect((err) => {
    // console.log('error',err );

    const serviceCollection = client.db('eventMaker').collection('services');
    const reviewCollection = client.db('eventMaker').collection('reviews');
    const adminCollection = client.db('eventMaker').collection('admins');

    app.post('/addService', (req, res) => {
		const newService = req.body;
		  console.log('adding new event: ', newService)
		    serviceCollection.insertOne(newService).then((result) => {
			console.log('inserted count', result.insertedCount);
			res.send(result.insertedCount > 0);
		});
    });
    

    app.post('/addReview', (req, res) => {
		const newReview = req.body;
		  console.log('adding new review: ', newReview)
		    reviewCollection.insertOne(newReview).then((result) => {
			console.log('inserted count', result.insertedCount);
			res.send(result.insertedCount > 0);
		});
    });

    app.post('/addAdmin', (req, res) => {
		const newAdmin = req.body;
		  console.log('adding new review: ', newAdmin)
		    adminCollection.insertOne(newAdmin).then((result) => {
			console.log('inserted count', result.insertedCount);
			res.send(result.insertedCount > 0);
		});
    });
    
    app.get('/services', (req, res) => {
		serviceCollection.find().toArray((err, items) => {
			res.send(items);
		});
    });
    
    app.get('/reviews', (req, res) => {
		reviewCollection.find().toArray((err, items) => {
			res.send(items);
		});
    });
    
   app.get('/admin', (req, res) => {
		console.log(req.query.email);
		adminCollection.find({ email: req.query.email }).toArray((err, items) => {
			res.send(items);
		});
	});

})

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
	// console.log(process.env.DB_USER, process.env.DB_PASS, process.env.DB_NAME);
});