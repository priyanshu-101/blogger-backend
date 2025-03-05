
const cron = require('node-cron');
const PostModel = require('../models/Post'); 

function setupCronJobs() {
    cron.schedule('* * * * *', async () => {
        console.log('Cron job executed at:', new Date().toLocaleString());

        try {
            await PostModel.updateMany({}, { $set: { lastUpdated: new Date() } });
            console.log('Test update successful!');
        } catch (error) {
            console.error('Error in cron job:', error);
        }
    });
}

module.exports = setupCronJobs;