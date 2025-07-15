import mongoose from "mongoose";
const MONGO_URL = process.env.MONGO_URL!;
if (!MONGO_URL) {
    throw new Error("Please define the MONGO_URL environment variable inside .env");
}
//Using cached connection to avoid multiple connections in development and keeping the connection alive
let cached = global.mongoose; 
if(!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}
export async function dbConnect() {
    const opts={
        bufferCommands:true, //to avoid mongoose deprecation warnings
        maxPoolSize:10, //to limit the number of connections in the pool
    }
    //if the connection is already established, return it
    if(cached.conn) {
        return cached.conn;
    }
    if(!cached.promise) {
        mongoose.connect(MONGO_URL, opts)
            .then(()=>mongoose.connection)
        }
try{
    cached.conn = await cached.promise;

}catch(err) {
    cached.promise = null;
    throw err;
}
return cached.conn;
}

//WE did all of this to avoid edge functions from creating multiple connections in development mode
//This is because edge functions are stateless and can be invoked multiple times, leading to multiple
//connections being created, which can cause issues with the database connection pool.
//By using a cached connection, we can ensure that only one connection is created and reused across
//multiple invocations of the edge function, thus avoiding the issues with the connection pool.