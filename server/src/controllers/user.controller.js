import { asyncHandler } from "../utils/async-handler";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { User } from "../models/user.models.js";

const updateBasicInfo = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    bio,
    country,
    techStack,
    college,
    degree,
    branch,
    graduationYear,
  } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  if (firstName !== undefined)
    user.fullname = `${firstName} ${lastName || ""}`.trim();
  if (bio !== undefined) user.bio = bio;
  if (country !== undefined) user.country = country;

  if (techStack !== undefined) {
    user.techStack = techStack
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }
  //education
  if (college !== undefined) user.education.institution = college;
  if (degree !== undefined) user.education.degree = degree;
  if (branch !== undefined) user.education.branch = branch;
  if (graduationYear !== undefined)
    user.education.graduationYear = Number(graduationYear);

  await user.save({ validateBeforeSave: false });

  const updatedUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry -forgotPasswordToken -forgotPasswordExpiry",
  );
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: updatedUser },
        "Basic info updated successfully",
      ),
    );
});
export { updateBasicInfo };
