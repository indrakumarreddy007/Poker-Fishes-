const mongoose = require('mongoose');
const { Schema } = mongoose;

const buyInSchema = new Schema({
    id: String,
    amount: Number,
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    requestedAt: { type: Date, default: Date.now },
    approvedAt: Date,
    approvedBy: String
});

const playerSchema = new Schema({
    userId: String,
    name: String,
    email: String,
    picture: String,
    buyIns: [buyInSchema],
    currentStack: { type: Number, default: 0 },
    totalBuyIn: { type: Number, default: 0 },
    profitLoss: { type: Number, default: 0 },
    status: { type: String, default: 'active' }, // 'active', 'left'
    joinedAt: { type: Date, default: Date.now }
});

const buyInRequestSchema = new Schema({
    id: String,
    userId: String,
    userName: String,
    userPicture: String,
    amount: Number,
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    requestedAt: { type: Date, default: Date.now }
});

const sessionSchema = new Schema({
    code: String,
    name: String,
    adminId: String,
    adminName: String,
    status: { type: String, default: 'active' }, // 'active', 'ended'
    createdAt: { type: Date, default: Date.now },
    endedAt: Date,
    players: [playerSchema],
    buyInRequests: [buyInRequestSchema],
    totalBuyIn: { type: Number, default: 0 },
    totalStack: { type: Number, default: 0 },
    isValid: { type: Boolean, default: false }
});

mongoose.model('sessions', sessionSchema);
