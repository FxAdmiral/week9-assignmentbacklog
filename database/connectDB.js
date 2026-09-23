const mongoose = require('mongoose');

const MAX_ATTEMPTS = 3;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const connectDB = async () => {
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        try {
            await mongoose.connect(process.env.MONGO_URI, {
                serverSelectionTimeoutMS: 10000,
                family: 4,
            });
            console.log('MongoDB Connected Successfully');
            return;
        } catch (error) {
            console.error(`DB connection failed (attempt ${attempt}/${MAX_ATTEMPTS}):`, error.message);

            // TEMPORARY DEBUG: what happened with each server
            if (error.reason?.servers) {
                for (const [host, server] of error.reason.servers) {
                    console.error('  ', host, '->', server.type, server.error?.message || '(no error recorded)');
                }
            }

            if (attempt === MAX_ATTEMPTS) {
                process.exit(1);
            }
            await wait(3000);
        }
    }
};

module.exports = connectDB;