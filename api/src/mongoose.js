import mongoose from "mongoose";
import { config } from "./config.js";

export const connectDatabase = async () => {
    try {
      // Inicia a conexão com o MongoDB
      await mongoose.connect(config.MONGODB_URI, {
        dbName: 'woovi_bank'
      });
  
      const infos = mongoose.connections;
      infos.map((info) =>
        console.log(`Connected to ${info.host}:${info.port}/${info.name}`)
      );
      
    } catch (error) {
      throw new Error(`Error connecting to MongoDB: ${error.message}`);
    }
};