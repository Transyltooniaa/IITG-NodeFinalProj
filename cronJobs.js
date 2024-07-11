const cron = require('node-cron');
const User = require('./models/user');
const mongoose = require('mongoose');

// Schedule task to run every minute
cron.schedule('* * * * *', async () => {
    try {
        const thresholdTime = new Date(Date.now() - 15 * 60 * 1000);
        const result = await User.deleteMany({ verified: false, createdAt: { $lt: thresholdTime } });
    } catch (error) {
        console.error('Error deleting unverified users:', error);
    }
});


