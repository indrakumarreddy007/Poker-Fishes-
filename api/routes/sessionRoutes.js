const prisma = require('../services/db');

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

        try {
            const session = await prisma.session.create({
                data: {
                    code,
                    name,
                    adminId,
                    adminName,
                    status: 'active',
                    isValid: false
                },
                include: {
                    players: true,
                    buyInRequests: true
                }
            });
            res.send(session);
        } catch (err) {
            res.status(500).send({ error: 'Failed to create session' });
        }
    });

    // Get User Sessions
    app.get('/api/sessions', async (req, res) => {
        if (!req.user) {
            return res.status(401).send({ error: 'You must log in!' });
        }

        try {
            const sessions = await prisma.session.findMany({
                where: {
                    OR: [
                        { adminId: req.user.id },
                        {
                            players: {
                                some: { userId: req.user.id }
                            }
                        }
                    ]
                },
                orderBy: { createdAt: 'desc' },
                include: {
                    players: true,
                    buyInRequests: true
                }
            });
            res.send(sessions);
        } catch (err) {
            res.status(500).send({ error: 'Failed to fetch sessions' });
        }
    });

    // Join Session
    app.post('/api/sessions/join', async (req, res) => {
        const { code, userId, userName, userEmail, userPicture } = req.body;

        try {
            const session = await prisma.session.findUnique({
                where: { code: code.toUpperCase() },
                include: { players: true }
            });

            if (!session || session.status !== 'active') {
                return res.status(404).send({ error: 'Session not found or ended' });
            }

            const existingPlayer = session.players.find(p => p.userId === userId);
            if (existingPlayer) {
                // Return full session data with relations
                const fullSession = await prisma.session.findUnique({
                    where: { id: session.id },
                    include: { players: true, buyInRequests: true }
                });
                return res.send(fullSession);
            }

            // Add player
            await prisma.sessionPlayer.create({
                data: {
                    sessionId: session.id,
                    userId,
                    name: userName,
                    email: userEmail,
                    picture: userPicture,
                    status: 'active'
                }
            });

            const updatedSession = await prisma.session.findUnique({
                where: { id: session.id },
                include: { players: true, buyInRequests: true }
            });
            res.send(updatedSession);
        } catch (err) {
            res.status(500).send({ error: 'Failed to join session' });
        }
    });

    // Request Buy-In
    app.post('/api/sessions/:id/buyin', async (req, res) => {
        const { userId, userName, userPicture, amount } = req.body;

        try {
            // Check if session exists
            const session = await prisma.session.findUnique({ where: { id: req.params.id } });
            if (!session) return res.status(404).send('Session not found');

            await prisma.buyInRequest.create({
                data: {
                    sessionId: req.params.id,
                    userId,
                    userName,
                    userPicture,
                    amount,
                    status: 'pending'
                }
            });

            const updatedSession = await prisma.session.findUnique({
                where: { id: req.params.id },
                include: { players: true, buyInRequests: true }
            });
            res.send(updatedSession);
        } catch (err) {
            res.status(500).send({ error: 'Failed to request buy-in' });
        }
    });

    // Approve Buy-In
    app.put('/api/sessions/:id/buyin/:reqId/approve', async (req, res) => {
        const { approvedBy } = req.body;
        const { id, reqId } = req.params;

        try {
            // Use transaction to ensure data integrity
            const result = await prisma.$transaction(async (prisma) => {
                const request = await prisma.buyInRequest.findUnique({ where: { id: reqId } });
                if (!request) throw new Error('Request not found');

                // Update request status (or delete it? plan said delete from list, but schema has status)
                // The mongoose code deleted it. Let's delete it or mark it approved.
                // Plan mentions: "Stores pending/approved/rejected buy-ins." - so let's update status.
                // BUT the Mongoose code removed it from the list.
                // Let's stick to the Mongoose behavior of "processing" it:
                // 1. Create BuyIn record (if we have that table) or just update player total
                // 2. Remove BuyInRequest
                // Used Schema: BuyInRequest, BuyIn, SessionPlayer(totalBuyIn)

                // 1. Find the player
                const player = await prisma.sessionPlayer.findUnique({
                    where: {
                        sessionId_userId: {
                            sessionId: id,
                            userId: request.userId
                        }
                    }
                });

                if (player) {
                    // Update player total
                    await prisma.sessionPlayer.update({
                        where: { id: player.id },
                        data: {
                            totalBuyIn: { increment: request.amount },
                            buyIns: {
                                create: {
                                    amount: request.amount,
                                    status: 'approved',
                                    requestedAt: request.requestedAt,
                                    approvedBy: approvedBy || 'Admin'
                                }
                            }
                        }
                    });
                }

                // 2. Update session total
                await prisma.session.update({
                    where: { id: id },
                    data: { totalBuyIn: { increment: request.amount } }
                });

                // 3. Remove request (or update status? Mongoose removed it).
                // Let's delete it to match frontend expectation of it disappearing from the "Requests" list.
                await prisma.buyInRequest.delete({ where: { id: reqId } });

                return prisma.session.findUnique({
                    where: { id },
                    include: {
                        players: { include: { buyIns: true } },
                        buyInRequests: true
                    }
                });
            });

            res.send(result);
        } catch (err) {
            console.error(err);
            res.status(500).send({ error: err.message });
        }
    });

    // Reject Buy-In
    app.put('/api/sessions/:id/buyin/:reqId/reject', async (req, res) => {
        try {
            await prisma.buyInRequest.delete({ where: { id: req.params.reqId } });

            const session = await prisma.session.findUnique({
                where: { id: req.params.id },
                include: { players: true, buyInRequests: true }
            });
            res.send(session);
        } catch (err) {
            res.status(500).send({ error: 'Failed to reject buy-in' });
        }
    });

    // Update Player Stack
    app.put('/api/sessions/:id/stack', async (req, res) => {
        const { userId, stack } = req.body;

        try {
            // Update player stack and profitLoss
            // We need to fetch player first to know totalBuyIn for PL calc?
            // Or we can do it in one go if we knew totalBuyIn.
            // Let's fetch first.
            const player = await prisma.sessionPlayer.findUnique({
                where: {
                    sessionId_userId: {
                        sessionId: req.params.id,
                        userId
                    }
                }
            });

            if (player) {
                await prisma.sessionPlayer.update({
                    where: { id: player.id },
                    data: {
                        currentStack: stack,
                        profitLoss: stack - player.totalBuyIn
                    }
                });
            }

            // Recalculate session total stack
            // Aggregate all players currentStack
            const transport = await prisma.sessionPlayer.aggregate({
                where: { sessionId: req.params.id },
                _sum: { currentStack: true }
            });

            const totalStack = transport._sum.currentStack || 0;

            const session = await prisma.session.update({
                where: { id: req.params.id },
                data: { totalStack },
                include: { players: true, buyInRequests: true }
            });

            res.send(session);
        } catch (err) {
            res.status(500).send({ error: 'Failed to update stack' });
        }
    });

    // End Session
    app.put('/api/sessions/:id/end', async (req, res) => {
        try {
            const session = await prisma.session.findUnique({ where: { id: req.params.id } });

            if (session) {
                const difference = session.totalBuyIn - session.totalStack;
                const isValid = difference === 0;

                const updatedSession = await prisma.session.update({
                    where: { id: req.params.id },
                    data: {
                        status: 'ended',
                        endedAt: new Date(),
                        isValid
                    },
                    include: { players: true, buyInRequests: true }
                });
                res.send(updatedSession);
            } else {
                res.status(404).send({ error: 'Session not found' });
            }
        } catch (err) {
            res.status(500).send({ error: 'Failed to end session' });
        }
    });
};
