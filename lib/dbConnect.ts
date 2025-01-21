import mongoose from "mongoose";

// Define the type for the MongoDB URI
const MONGODB_URI_USER: string | undefined = process.env.MONGODB_URI_USER;

export const dbConnect = async (): Promise<void> => {
    try {
        // Check if the database is already connected
        if (mongoose.connection.readyState === 1) {
            console.log("Database is already connected.");
            return;
        }

        // Throw an error if MONGODB_URI_USER is not defined
        if (!MONGODB_URI_USER) {
            throw new Error("MONGODB_URI_USER environment variable is not defined.");
        }

        // Connect to the database
        await mongoose.connect(MONGODB_URI_USER);

        console.log("Database connected successfully.");
    } catch (error: unknown) {
        // Handle errors
        if (error instanceof Error) {
            console.error("Database connection error:", error.message);
            throw new Error("Failed to connect to the database.");
        } else {
            console.error("An unknown error occurred:", error);
            throw new Error("An unknown error occurred while connecting to the database.");
        }
    }
};