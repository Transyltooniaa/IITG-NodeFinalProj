const cron = require('node-cron');
const User = require('./models/user');
const mongoose = require('mongoose');

// Schedule task to run every minute
cron.schedule('* * * * *', async () => {
    console.log('Running cleanup job for unverified users');
    
    try {
        const thresholdTime = new Date(Date.now() - 15 * 60 * 1000);
        const result = await User.deleteMany({ verified: false, createdAt: { $lt: thresholdTime } });
        
        console.log(`Deleted ${result.deletedCount} unverified users`);
    } catch (error) {
        console.error('Error deleting unverified users:', error);
    }
});


