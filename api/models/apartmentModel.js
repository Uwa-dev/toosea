import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true
    },

    publicId: {
      type: String,
      required: true
    }
  },
  { _id: false }
);

const apartmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    pricePerNight: {
      type: Number,
      required: true,
      min: 0
    },

    capacity: {
      type: Number,
      required: true,
      min: 1
    },

    amenities: [
      {
        type: String,
        trim: true
      }
    ],

    images: [imageSchema],

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const Apartment = mongoose.model("Apartment", apartmentSchema);

export default Apartment;