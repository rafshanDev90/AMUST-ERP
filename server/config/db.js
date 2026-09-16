import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.Promise = global.Promise;
const connect = mongoose.connection;
mongoose.set('strictQuery', true);

const connectDB = async () => {
   const url = process.env.MONGO_URL;
   
    connect.on('connected', async () => {
        console.log('MongoDB Connection Established ✅');
    });
    
    connect.on('reconnected', async () => {
        console.log('MongoDB Connection Reestablished 🔄');
    });
    
    connect.on('disconnected', () => {
        console.log('MongoDB Connection Disconnected ❌');
        console.log('Trying to reconnect to Mongo...');

        setTimeout(() => {
            mongoose.connect(url);
        }, 3000);
    });
    
    connect.on('close', () => {
        console.log('Mongo Connection Closed');
    });
    
    connect.on('error', (error) => {
        console.log('Mongo Connection Error: ' + error);
    });

    // ✅ REMOVED DEPRECATED OPTIONS HERE AS WELL
    await mongoose.connect(url).catch((error) => console.log(error));
};

export default connectDB;
