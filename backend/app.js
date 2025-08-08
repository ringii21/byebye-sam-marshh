const express = require('express');
const path = require('path');
const fs = require('fs');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

// 🔓 Charge les utilisateurs
const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json')));

// 🔧 Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: 'supersecret-key',
    resave: false,
    saveUninitialized: true
}));

// 🗂 Sert les fichiers statiques depuis frontend (CSS, JS, images…)
app.use('/assets', express.static(path.join(__dirname, '../frontend/assets')));
app.use('/pages', express.static(path.join(__dirname, '../frontend/pages')));

// 📄 Sert index.html au GET /
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// 🔐 POST /login : vérifie identifiants
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.redirect('/?error=1');
    }

    req.session.user = user;
    return res.redirect('/pages/' + user.page + '.html');
});

// 🔐 Protection des pages privées
app.get('/pages/:name.html', (req, res, next) => {
    if (!req.session.user || req.session.user.page !== req.params.name) {
        return res.status(403).send('Accès refusé');
    }

    return res.sendFile(path.join(__dirname, '../frontend/pages/' + req.params.name + '.html'));

});

// 🚀 Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur en écoute sur http://localhost:${PORT}`);
});
