const express = require('express');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const app = express();
const PORT = process.env.PORT || 3000;

const users = JSON.parse(fs.readFileSync('./users.json'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: 'supersecret-key',
    resave: false,
    saveUninitialized: true
}));

// ✅ Sert les fichiers statiques : CSS, JS, images
app.use('/assets', express.static(path.join(__dirname, 'frontend/assets')));

app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/index.html'));
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.redirect('/?error=1');
    }

    req.session.user = user;
    return res.redirect('/pages/' + user.page);
});


app.get('/pages/:name', (req, res) => {
    if (!req.session.user || req.params.name !== req.session.user.page) {
        return res.status(403).send('Accès refusé');
    }
    res.sendFile(path.join(__dirname, 'frontend/pages/' + req.params.name + '.html'));

});

app.listen(PORT, () => {
    console.log('Serveur en écoute sur http://localhost:' + PORT);

});
