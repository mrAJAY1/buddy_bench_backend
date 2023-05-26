const app = require('express')();
const { json } = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const userRouter = require('./routes/userRouter.js');

// configure dotenv
require('dotenv').config();

const { PORT, MONGO_URI } = process.env;

// middleware configs
app.use(json());
app.use(cookieParser());
app.use(cors({ origin: '*' }));

// route configs
app.get('/', (_req, res) => res.send('server is active.'));
app.use('/api/user', userRouter);

// db configs
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.once('open', () => console.log(`DB connected successfully to ${db.name}`));
db.on('error', console.error.bind(console, 'db error : '));

// setup server
app.listen(PORT, () => console.log(`server listening on port ${PORT}`));
module.exports = app;
