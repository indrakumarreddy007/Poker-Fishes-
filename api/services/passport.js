const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');
const prisma = require('./db');
const localStrategy = require('./localStrategy');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.user.findUnique({ where: { id } });
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

passport.use(localStrategy);

passport.use(
    new GoogleStrategy(
        {
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            callbackURL: keys.redirectDomain
                ? `${keys.redirectDomain}/api/auth/google/callback`
                : '/api/auth/google/callback',
            proxy: true
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // 1. Check if user exists with googleId
                const existingUser = await prisma.user.findUnique({
                    where: { googleId: profile.id }
                });

                if (existingUser) {
                    return done(null, existingUser);
                }

                // 2. Check if user exists with email (account linking)
                const existingEmailUser = await prisma.user.findUnique({
                    where: { email: profile.emails[0].value }
                });

                if (existingEmailUser) {
                    // Link the Google Account to the existing user
                    const updatedUser = await prisma.user.update({
                        where: { id: existingEmailUser.id },
                        data: {
                            googleId: profile.id,
                            picture: existingEmailUser.picture || profile.photos[0].value
                        }
                    });
                    return done(null, updatedUser);
                }

                // 3. Create new user
                const user = await prisma.user.create({
                    data: {
                        googleId: profile.id,
                        email: profile.emails[0].value,
                        name: profile.displayName,
                        picture: profile.photos[0].value
                    }
                });
                done(null, user);
            } catch (err) {
                done(err, null);
            }
        }
    )
);
