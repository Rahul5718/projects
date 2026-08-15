require('dotenv').config()

const express = require('express');
const path = require('path');
const app = express();
const router = require('./routes/router');
const cors = require('cors')
const http = require('http')
const sequelize = require('./util/Database');
const Message = require('./model/message');
const archive = require('./archive/archive')
const User = require('./model/user')
const ForgotPasswordRequest = require('./model/forgotPassword')

//socket_io files
const checkKey = process.env.AWS_SECRET_ACCESS_KEY;
console.log(checkKey);

//password reset

User.hasMany(ForgotPasswordRequest);
ForgotPasswordRequest.belongsTo(User);

//notiification 
const webpush = require('web-push')

const socketIo=require('./socket_io')

app.use(express.json());
app.use(cors())
app.use(express.urlencoded({ extended: true }))


const server = http.createServer(app)

const io =socketIo(server)

app.set('io',io)
app.use(router);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'index.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'singup.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'login.html'));
});

app.get('/admin',(req,res)=>{
  res.sendFile(path.join(__dirname,'view','admin.html'))
})

app.get('/userChat',(req,res)=>{
  res.sendFile(path.join(__dirname,'view','userChat.html'))
})


app.get('/forgotpassword',(req,res)=>{
  res.sendFile(path.join(__dirname,'view','forgotpassword.html'))

})

// Ensure tables exist (dev-friendly). Safe to remove later if you use migrations.
sequelize
  .sync({})
  .then(() => console.log('DB synced'))
  .catch((err) => console.error('DB sync error:', err));

server.listen(3000, () => {
  archive()
  console.log('server running on port 3000');
});

