const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));
app.use(express.static('public'));

const users = {};

const requireAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
};

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

app.get('/', (req, res) => {
    if (req.session.user) {
        res.sendFile(__dirname + '/public/home.html');
    } else {
        res.redirect('/login');
    }
});

app.get('/about', requireAuth, (req, res) => {
    res.sendFile(__dirname + '/public/about.html');
});

app.get('/contact', requireAuth, (req, res) => {
    res.sendFile(__dirname + '/public/contact.html');
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.post('/register', (req, res) => {
    const { username, password, firstName, lastName, age, gender } = req.body;

    if (users[username]) {
        return res.send('Username already taken.');
    }

    users[username] = {
        username,
        password,
        firstName,
        lastName,
        age,
        gender
    };

    console.log('User registered:', users[username]);

    res.redirect('/login');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!users[username]) {
        console.log('User not found. Users:', users);
        return res.status(401).send('User not found.');
    }

    if (users[username].password !== password) {
        console.log('Incorrect password.');
        return res.status(401).send('Incorrect password.');
    }

    console.log('Login successful:', username);

    req.session.user = username;

    res.redirect('/profile');
});

app.get('/profile', requireAuth, (req, res) => {
    const username = req.query.username || req.session.user;

    const user = users[username];
    if (!user) {
        console.log('User not found.');
        return res.status(404).send('User not found.');
    }

    res.render('profile', { user });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});