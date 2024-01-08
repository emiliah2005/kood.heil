const express = require('express');
const app = express();

const port = 3003;

app.use(express.static('public'));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/index.html');
});

app.get('/contact', (req, res) => {
	res.sendFile(__dirname + '/public/contact.html');
});

app.get('/login', (req, res) => {
	res.sendFile(__dirname + '/public/login.html');
});

app.get('/profile', (req, res) => {
	res.sendFile(__dirname + '/public/profile.html');
});

app.get('/about', (req, res) => {
	res.sendFile(__dirname + '/public/about.html');
});

app.listen(port, () => {
	console.log(`Server kuulab pordil ${port}. Külasta http://localhost:${port}`);
});