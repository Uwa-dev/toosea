import Apartment from "../models/apartmentModel.js";
import cloudinary from "../config/cloudinary.js";

export const createApartment = async (req, res) => {
  try {
    const apartment = await Apartment.create(req.body);

    return res.status(201).json({
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

export const uploadApartmentImages = async (req, res) => {
  try {
    const apartment = await Apartment.findById(req.params.id);

    if (!apartment) {
      return res.status(404).json({
        success: false,
        message: "Apartment not found"
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No images uploaded"
      });
    }

    const uploadedImages = [];

    for (const file of req.files) {
      const result =
        await cloudinary.uploader.upload(
          file.path,
          {
            folder: "apartments"
          }
        );

      uploadedImages.push({
        imageUrl: result.secure_url,
        publicId: result.public_id
      });
    }

    apartment.images.push(...uploadedImages);

    await apartment.save();

    return res.status(200).json({
      success: true,
      message: "Images uploaded successfully",
      images: uploadedImages
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

    const apartment =
      await Apartment.findById(id);

    if (!apartment) {
      return res.status(404).json({
        success: false,
        message: "Apartment not found"
      });
    }

    await cloudinary.uploader.destroy(publicId);

    apartment.images =
      apartment.images.filter(
        image => image.publicId !== publicId
      );

    await apartment.save();

    return res.status(200).json({
      success: true,
      message: "Image deleted"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
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
    const apartment =
      await Apartment.findByIdAndUpdate(
        req.params.id,
        {
          isActive: false
        },
        { new: true }
      );po

    if (!apartment) {
      return res.status(404).json({
        success: false,
        message:
          "Apartment not found"
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Apartment deactivated successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
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
