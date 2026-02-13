// keys.js - figure out what set of credentials to return
if (process.env.NODE_ENV === 'production') {
    // restricted: we are in production - return the prod set of keys
    module.exports = {
        googleClientID: process.env.GOOGLE_CLIENT_ID,
        googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
        databaseURL: process.env.DATABASE_URL,
        cookieKey: process.env.COOKIE_KEY,
        redirectDomain: process.env.REDIRECT_DOMAIN || ''
    };
} else {
    // we are in development - return the dev keys
    // check if dev.js exists, if not use env vars
    try {
        module.exports = require('./dev');
    } catch (e) {
        module.exports = {
            googleClientID: process.env.GOOGLE_CLIENT_ID,
            googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
            databaseURL: process.env.DATABASE_URL,
            cookieKey: process.env.COOKIE_KEY,
            redirectDomain: 'http://localhost:5173'
        };
    }
}
