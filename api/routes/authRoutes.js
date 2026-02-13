const passport = require('passport');
const bcrypt = require('bcryptjs');
const prisma = require('../services/db');

module.exports = app => {
    // Google Auth Routes
    app.get(
        '/api/auth/google',
        passport.authenticate('google', {
            scope: ['profile', 'email']
        })
    );

    app.get(
        '/api/auth/google/callback',
        passport.authenticate('google'),
        (req, res) => {
            res.redirect('/');
        }
    );

    // Local Auth Routes
    app.post('/api/auth/signup', async (req, res) => {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(400).send({ error: 'All fields are required' });
        }

        try {
            const existingUser = await prisma.user.findUnique({
                where: { email }
            });

            if (existingUser) {
                return res.status(400).send({ error: 'Email already in use' });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                    picture: 'https://ui-avatars.com/api/?name=' + name
                }
            });

            // Log the user in after signup
            req.login(user, err => {
                if (err) {
                    return res.status(500).send({ error: 'Login failed after signup' });
                }
                res.send(user);
            });

        } catch (err) {
            res.status(500).send({ error: 'Signup failed' });
        }
    });

    app.post('/api/auth/login', (req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(400).send({ error: info.message || 'Login failed' });
            }
            req.login(user, err => {
                if (err) {
                    return next(err);
                }
                res.send(user);
            });
        })(req, res, next);
    });

    app.get('/api/auth/logout', (req, res) => {
        req.logout(() => {
            res.redirect('/');
        });
    });

    app.get('/api/auth/current_user', (req, res) => {
        res.send(req.user || null);
    });
};
