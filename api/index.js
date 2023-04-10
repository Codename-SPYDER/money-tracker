const express = require('express');
const app = express();
const mongoose = require('mongoose');
const TransactionModel = require('./models/Transaction')
PORT = 4000;
const cors = require('cors');
const dotenv = require('dotenv').config();

app.use(cors());

app.use(express.json());

app.get('/api/test', (req, res) => {
	res.json('test ok');
})

app.post('/api/transaction', async (req,res) => {
	await mongoose.connect(process.env.MONGO_URL);
	const {price, name, datetime, description} = req.body;
	const transaction = await TransactionModel.create({
		price,
		name,
		description,
		datetime,
	});
	res.json(transaction);
})

app.get('/api/transactions', async (req,res) => {
	await mongoose.connect(process.env.MONGO_URL);
	const transactions = await TransactionModel.find({});
	res.json(transactions);
})

app.listen(4000, () => console.log('Listening for request...'));