import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    roomNumber: {
        type: Number,
        required: true,
    },
    roomType: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        rewuired: true
    },
    status: {
        type: String,
        enum: ["available", "unavailable"],
        default: "available"
    }
});

const Room = mongoose.model("Room", roomSchema);

export default Room;