import mongoose from "mongoose";

export const connectDb = async () => {
    const url = process.env.MONGO_URL;

    if (!url) {
        console.log("URL is not found");
        return;
    }

    try {
        await mongoose.connect(url, {
            dbName: "CHAT-APPLICATION"
        });
        console.log("😘  Connected to database of chat service");

    } catch (error) {
        console.log("some error in database connection");
        process.exit(1);
    }
};
