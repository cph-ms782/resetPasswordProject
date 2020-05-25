// npm install -g sequelize-cli
// npm install --save sequelize mysql2 nodemailer express pug dotenv helmet oauth2-server
// npm install cors

const helmet = require('helmet'),
 path = require('path'),
 cors = require('cors'),
 bodyParser = require('body-parser');

require('dotenv').config();

const express = require('express');
const app = express();

app.use(cors())


app.use(bodyParser.json());

app.set('views', './views')
app.set('view engine', 'pug')

app.use(helmet());

app.use(express.static(path.join(process.cwd(), 'public')));


let userRoute = require('./routes/user');
let oauthRoute = require('./routes/oauth');

app.use(express.json());
app.use('/user', userRoute);

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/oauth', oauthRoute);

app.get('/form', function (req, res) {
  //__dirname =  project folder.
  res.sendFile(path.join(__dirname+'/html/form.html'))
})


const PORT = process.env.PORT || 3333;
const server = app.listen(PORT);
console.log(`Server started, listening on port: ${PORT}`);



module.exports.server = server;
