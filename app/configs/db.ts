import fs from 'fs';
import { execSync } from 'child_process';

import mongoose, { Connection } from 'mongoose';

let cachedConnection: Connection | null = null;


async function connectDB() {
    if (cachedConnection) {
        return cachedConnection;
    }
    try {
        const cnx = await mongoose.connect(process.env.MONGODB_URI!);
        console.log(process.env.MONGODB_URI);
        cachedConnection = cnx.connection;
        return cachedConnection;
    } catch (error) {
        throw error;
    }
}

function isConnectionOpen() {
    return cachedConnection && cachedConnection.readyState === 1;
}

export { connectDB, isConnectionOpen };
