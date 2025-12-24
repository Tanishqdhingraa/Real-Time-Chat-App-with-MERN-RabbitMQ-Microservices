import mongoose, { Schema } from "mongoose";
const schema = new Schema({
    users: [{ type: String, required: true }],
    latestmessage: {
        text: String,
        required: true
    }
}, {
    timestamps: true
});
export const Chat = mongoose.model("Chat", schema);
//# sourceMappingURL=Chat.js.map