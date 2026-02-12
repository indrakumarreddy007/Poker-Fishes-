const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    googleId: String,
    email: String,
    name: String,
    picture: String,
    role: { type: String, default: 'player' }, // 'admin', 'player', 'both'
    currentRole: { type: String, default: 'player' },
    createdAt: { type: Date, default: Date.now }
});

mongoose.model('users', userSchema);
