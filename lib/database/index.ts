import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

let cached = (global as any).mongoose || { conn: null, promise: null };

export const connectToDatabase = async () => {
    if (cached.conn) return cached.conn;

    if (!MONGODB_URI) throw new Error('MONGODB_URI is missing');

    cached.promise = cached.promise || mongoose.connect(MONGODB_URI, {
        dbName: 'evently',
        bufferCommands: false,
    })

    cached.conn = await cached.promise;

    // Escucha el evento 'connected' para saber si la conexión fue exitosa
    mongoose.connection.on('connected', () => {
        console.log('Mongoose connected to DB');
    });

    // Escucha el evento 'error' para manejar cualquier error de conexión
    mongoose.connection.on('error', (err) => {
        console.error('Mongoose connection error:', err);
    });

    return cached.conn;
}
