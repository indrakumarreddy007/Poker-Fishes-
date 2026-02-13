const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const prisma = require('./db');

// Correctly export the strategy itself, NOT wrapped in anything else if passport.use expects a Strategy object
// However, standard passport.use(new LocalStrategy(...)) pattern is common.
// Let's check how I used it in passport.js. I used `passport.use(localStrategy)`.
// So this file should export `new LocalStrategy(...)`.

module.exports = new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    async (email, password, done) => {
        try {
            const user = await prisma.user.findUnique({ where: { email } });

            if (!user) {
                return done(null, false, { message: 'Incorrect email or password.' });
            }

            // If user has no password (e.g. Google auth only), fail
            if (!user.password) {
                return done(null, false, { message: 'Please log in with Google.' });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return done(null, false, { message: 'Incorrect email or password.' });
            }

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
);
