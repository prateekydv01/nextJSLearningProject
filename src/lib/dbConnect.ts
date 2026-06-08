import mongoose  from "mongoose";

type ConnectionObject = {
    isConnected?: number
    //optional h ayegi to nuber me hi ayegi
}

const connection : ConnectionObject = {}

async function dbConnect():Promise<void> {
    if(connection.isConnected){
        console.log("Already connected");
        return 
    }
    
    try {
       const db =  await mongoose.connect(process.env.MONGODB_URI || "",{})

       connection.isConnected = db.connections[0].readyState
       console.log("Db connected successfully");
       
    } catch (error) {

        console.log("Db connection error: ", error);
        
        process.exit(1) //gracefully exit the application as db is not connected
    }
}

export default dbConnect