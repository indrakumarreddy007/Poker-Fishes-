require('dotenv').config();
const express = require('express');
const cookieSession = require('cookie-session');
const passport = require('passport');
const cors = require('cors');
const keys = require('./config/keys');

// Prisma Client is initialized in services/db.js
// but for passport we need to ensure local strategy is set up
require('./services/passport');

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

// Allow frontend to make requests
app.use(cors({
  origin: keys.redirectDomain, // Allow requests from frontend
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

require('./routes/authRoutes')(app);
require('./routes/sessionRoutes')(app);

const PORT = process.env.PORT || 5000;

// Only listen if not running in production (Vercel handles serverless)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
