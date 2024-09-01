"use server"

import mongoose, { Connection } from 'mongoose';

let cachedConnection: Connection | null = null;

async function connectDB() {
    if (cachedConnection) {
        console.log("Using cached database connection");
        return cachedConnection;
    }
    try {
        const cnx = await mongoose.connect(process.env.MONGODB_URI!);
        cachedConnection = cnx.connection;
        console.log("New Mongodb connection established");
        return cachedConnection;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

function isConnectionOpen() {
    return cachedConnection && cachedConnection.readyState === 1;
}

export { connectDB, isConnectionOpen };
