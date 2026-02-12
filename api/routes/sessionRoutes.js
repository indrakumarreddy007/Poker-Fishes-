const mongoose = require('mongoose');
const Session = mongoose.model('sessions');

module.exports = app => {
    // Create Session
    app.post('/api/sessions', async (req, res) => {
        const { name, adminId, adminName } = req.body;

        // Generate code
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        const session = new Session({
            code,
            name,
            adminId,
            adminName,
            status: 'active',
            createdAt: new Date(),
            totalBuyIn: 0,
            totalStack: 0,
            isValid: false
        });

        await session.save();
        res.send(session);
    });

    // Get User Sessions
    app.get('/api/sessions', async (req, res) => {
        if (!req.user) {
            return res.status(401).send({ error: 'You must log in!' });
        }

        const sessions = await Session.find({
            $or: [
                { adminId: req.user.id },
                { 'players.userId': req.user.id }
            ]
        }).sort({ createdAt: -1 });

        res.send(sessions);
    });

    // Join Session
    app.post('/api/sessions/join', async (req, res) => {
        const { code, userId, userName, userEmail, userPicture } = req.body;

        const session = await Session.findOne({
            code: code.toUpperCase(),
            status: 'active'
        });

        if (!session) {
            return res.status(404).send({ error: 'Session not found or ended' });
        }

        const existingPlayer = session.players.find(p => p.userId === userId);
        if (existingPlayer) {
            return res.send(session); // Already joined, just return session
        }

        session.players.push({
            userId,
            name: userName,
            email: userEmail,
            picture: userPicture,
            buyIns: [],
            currentStack: 0,
            totalBuyIn: 0,
            profitLoss: 0,
            status: 'active',
            joinedAt: new Date()
        });

        await session.save();
        res.send(session);
    });

    // Request Buy-In
    app.post('/api/sessions/:id/buyin', async (req, res) => {
        const { userId, userName, userPicture, amount } = req.body;
        const session = await Session.findById(req.params.id);

        if (!session) return res.status(404).send('Session not found');

        const requestId = `req_${Date.now()}`;
        session.buyInRequests.push({
            id: requestId,
            userId,
            userName,
            userPicture,
            amount,
            status: 'pending',
            requestedAt: new Date()
        });

        await session.save();
        res.send(session);
    });

    // Approve Buy-In
    app.put('/api/sessions/:id/buyin/:reqId/approve', async (req, res) => {
        const { approvedBy } = req.body;
        const session = await Session.findById(req.params.id);

        const request = session.buyInRequests.find(r => r.id === req.params.reqId);
        if (!request) return res.status(404).send('Request not found');

        // Add to player's buy-ins
        const player = session.players.find(p => p.userId === request.userId);
        if (player) {
            player.buyIns.push({
                id: request.id,
                amount: request.amount,
                status: 'approved',
                requestedAt: request.requestedAt,
                approvedAt: new Date(),
                approvedBy
            });
            player.totalBuyIn += request.amount;
        }

        // Remove from requests
        session.buyInRequests = session.buyInRequests.filter(r => r.id !== req.params.reqId);

        // Update session total
        session.totalBuyIn += request.amount;

        await session.save();
        res.send(session);
    });

    // Reject Buy-In
    app.put('/api/sessions/:id/buyin/:reqId/reject', async (req, res) => {
        const session = await Session.findById(req.params.id);
        session.buyInRequests = session.buyInRequests.filter(r => r.id !== req.params.reqId);
        await session.save();
        res.send(session);
    });

    // Update Player Stack
    app.put('/api/sessions/:id/stack', async (req, res) => {
        const { userId, stack } = req.body;
        const session = await Session.findById(req.params.id);

        const player = session.players.find(p => p.userId === userId);
        if (player) {
            player.currentStack = stack;
            player.profitLoss = stack - player.totalBuyIn;
        }

        // Recalculate session total stack
        session.totalStack = session.players.reduce((sum, p) => sum + p.currentStack, 0);

        await session.save();
        res.send(session);
    });

    // End Session
    app.put('/api/sessions/:id/end', async (req, res) => {
        const session = await Session.findById(req.params.id);

        if (session) {
            session.status = 'ended';
            session.endedAt = new Date();

            const difference = session.totalBuyIn - session.totalStack;
            session.isValid = difference === 0;

            await session.save();
        }

        res.send(session);
    });
};
