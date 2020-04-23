// npm install -g sequelize-cli
// $ npm install --save sequelize mysql nodemailer express pug dotenv helmet mysql2

const helmet = require('helmet');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();

const express = require('express');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', './views')
app.set('view engine', 'pug')

app.use(helmet());

app.use(express.static(path.join(process.cwd(), 'public')));

app.use(express.json());

let userRoute = require('./routes/user');

app.use('/user', userRoute);

app.get('/form', function (req, res) {
  //__dirname =  project folder.
  res.sendFile(path.join(__dirname+'/html/form.html'))
})

const PORT = process.env.PORT || 3333;
const server = app.listen(PORT);
console.log(`Server started, listening on port: ${PORT}`);

module.exports.server = server;
