import mongoose from "mongoose";

type connectionObject = {
    isConnected ?: number
}

const connection : connectionObject = {};

async function dbConnect() : Promise<void> {
    if(connection.isConnected){
        console.log("Database already connected");
        return;
    }


    try{
        const db = await mongoose.connect(process.env.MONGO_URI || '',{});
        connection.isConnected = db.connections[0].readyState;

        console.log("DB connected successfully");

    }
    catch(err){
        console.log("Error in database connection",err);
        process.exit(1);
    }
}

export default dbConnect;