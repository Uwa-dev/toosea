import Apartment from "../models/apartmentModel.js";
import cloudinary from "../config/cloudinary.js";

export const createApartment = async (req, res) => {
  try {
    if (req.user.role !== "OWNER") {
      return res.status(403).json({
        success: false,
        message: "Only the owner can create apartments."
      });
    }

    const {
      name,
      description,
      apartmentType,
      pricePerNight,
      capacity,
      amenities
    } = req.body;

    if (
      !name ||
      !description ||
      !pricePerNight ||
      !capacity
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, description, price per night and capacity are required."
      });
    }

    const apartmentExists = await Apartment.findOne({
      name: name.trim()
    });

    if (apartmentExists) {
      return res.status(409).json({
        success: false,
        message: "Apartment name already exists."
      });
    }

    // Generate Apartment Code
    const lastApartment = await Apartment.findOne()
      .sort({ createdAt: -1 });

    let apartmentCode = "APT001";

    if (lastApartment?.apartmentCode) {
      const number = parseInt(
        lastApartment.apartmentCode.replace("APT", "")
      );

      apartmentCode = `APT${String(number + 1).padStart(3, "0")}`;
    }

    const apartment = await Apartment.create({
      apartmentCode,
      name: name.trim(),
      description: description.trim(),
      apartmentType,
      pricePerNight,
      capacity,
      amenities: amenities || []
    });

    return res.status(201).json({
      success: true,
      message: "Apartment created successfully.",
      apartment
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create apartment."
    });
  }
};

export const uploadApartmentImages = async (req, res) => {
  try {
    const { id } = req.params;

    const apartment = await Apartment.findById(id);

    if (!apartment) {
      return res.status(404).json({
        success: false,
        message: "Apartment not found."
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please upload at least one image."
      });
    }

    if (apartment.images.length + req.files.length > 15) {
      return res.status(400).json({
        success: false,
        message: "An apartment can only have a maximum of 15 images."
      });
    }

    const uploadedImages = [];

    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "apartments"
      });

      uploadedImages.push({
        imageUrl: result.secure_url,
        publicId: result.public_id
      });
    }

    apartment.images.push(...uploadedImages);

    await apartment.save();

    return res.status(200).json({
      success: true,
      message: `${uploadedImages.length} image(s) uploaded successfully.`,
      images: apartment.images
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteApartmentImage = async (req, res) => {
  try {
    const { id, publicId } = req.params;

    const apartment = await Apartment.findById(id);

    if (!apartment) {
      return res.status(404).json({
        success: false,
        message: "Apartment not found.",
      });
    }

    const imageIndex = apartment.images.findIndex(
      (image) => image.publicId === publicId
    );

    if (imageIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Image not found.",
      });
    }

    const image = apartment.images[imageIndex];

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(
      image.publicId
    );

    // Remove image from MongoDB
    apartment.images.splice(imageIndex, 1);

    await apartment.save();

    return res.status(200).json({
      success: true,
      message: "Image deleted successfully.",
      images: apartment.images,
    });

  } catch (error) {
    console.error(
      "Delete Apartment Image Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllApartments = async (req, res) => {
  try {
    const apartments = await Apartment.find({isActive: true});

    return res.status(200).json({
      success: true,
      apartments
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getApartmentById = async (req, res) => {
  try {
    const apartment = await Apartment.findById(req.params.id);

    if (!apartment) {
      return res.status(404).json({
        success: false,
        message:
          "Apartment not found"
      });
    }

    return res.status(200).json({
      success: true,
      apartment
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateApartment = async (req, res) => {
  try {
    const apartment =
      await Apartment.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true
        }
      );

    if (!apartment) {
      return res.status(404).json({
        success: false,
        message:
          "Apartment not found"
      });
    }

    return res.status(200).json({
      success: true,
      apartment
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteApartment = async (req, res) => {
  try {
    const apartment = await Apartment.findById(req.params.id);

    if (!apartment) {
      return res.status(404).json({
        success: false,
        message: "Apartment not found",
      });
    }

    // Delete all images from Cloudinary
    if (apartment.images && apartment.images.length > 0) {
      for (const image of apartment.images) {
        if (image.publicId) {
          try {
            await cloudinary.uploader.destroy(
              image.publicId
            );
          } catch (cloudinaryError) {
            console.error(
              `Failed to delete image ${image.publicId} from Cloudinary:`,
              cloudinaryError
            );
          }
        }
      }
    }

    // Permanently delete apartment from MongoDB
    await Apartment.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message:
        "Apartment and all its images deleted successfully",
    });

  } catch (error) {
    console.error(
      "Delete Apartment Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAvailableApartments = async (req, res) => {
  try {
    const { checkIn, checkOut } = req.query;

    if (!checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: "checkIn and checkOut are required"
      });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate >= checkOutDate) {
      return res.status(400).json({
        success: false,
        message: "Invalid date range"
      });
    }

    // 1. find all conflicting bookings
    const bookedApartmentIds = await Booking.find({
      bookingStatus: {
        $nin: ["CANCELLED", "CHECKED_OUT"]
      },
      checkInDate: {
        $lt: checkOutDate
      },
      checkOutDate: {
        $gt: checkInDate
      }
    }).distinct("apartment");

    // 2. get available apartments
    const availableApartments = await Apartment.find({
      isActive: true,
      _id: { $nin: bookedApartmentIds }
    });

    return res.status(200).json({
      success: true,
      count: availableApartments.length,
      data: availableApartments
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

//usefull for UI calendar
export const getAllApartmentsWithStatus = async (req, res) => {
  try {
    const { checkIn, checkOut } = req.query;

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const bookings = await Booking.find({
      bookingStatus: {
        $nin: ["CANCELLED", "CHECKED_OUT"]
      },
      checkInDate: { $lt: checkOutDate },
      checkOutDate: { $gt: checkInDate }
    });

    const bookedMap = new Set(
      bookings.map(b => b.apartment.toString())
    );

    const apartments = await Apartment.find({
      isActive: true
    });

    const result = apartments.map(apartment => ({
      ...apartment.toObject(),
      isAvailable: !bookedMap.has(
        apartment._id.toString()
      )
    }));

    return res.json({
      success: true,
      data: result
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
