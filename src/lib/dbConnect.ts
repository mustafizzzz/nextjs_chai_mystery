import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number;
}


const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {

    //optimization check
    if (connection.isConnected) {
        console.log('Already connected');
        return;
    }

    try {

        const db = await mongoose.connect(process.env.MONGODB_URI || '', {})

        connection.isConnected = db.connections[0].readyState;
        console.log('Connected to DB Successfully');


    } catch (error) {
        console.log('Error connecting to DB', error);
        process.exit(1);

    }

}

export default dbConnect;