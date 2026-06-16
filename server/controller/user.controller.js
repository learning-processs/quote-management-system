import userModel from "../models/userModel.js";
import quoteModel from "../models/quoteModel.js";

// @GET /api/users/me
const getProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @PUT /api/users/me
const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;

    const user = await userModel.findByIdAndUpdate(
      req.user._id,
      { name },
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated.",
      data: { user },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @GET /api/users/my-quotes
const getMyQuotes = async (req, res) => {
  try {
    const quotes = await quoteModel
      .find({ submittedBy: req.user._id })
      .populate("submittedBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: { quotes },
    });
  } catch (err) {
    console.error("getMyQuotes error:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export { getProfile, updateProfile, getMyQuotes };