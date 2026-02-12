require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const cors = require('cors');
const keys = require('./config/keys');

require('./models/User');
require('./models/Session');
require('./services/passport');

mongoose.connect(keys.mongoURI);

const app = express();

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(cors({
  origin: keys.redirectDomain, // Allow requests from frontend
  credentials: true
}));

require('./routes/authRoutes')(app);
require('./routes/sessionRoutes')(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
