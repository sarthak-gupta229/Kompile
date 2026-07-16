import { asyncHandler } from "../utils/async-handler.js";
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
    leetcodeUsername,
    codeforcesUsername,
    githubUsername,
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

  // Upsert connected platforms
  const platformUpdates = [
    { key: "leetcode", username: leetcodeUsername },
    { key: "codeforces", username: codeforcesUsername },
    { key: "github", username: githubUsername },
  ];

  for (const { key, username } of platformUpdates) {
    if (username !== undefined) {
      const existing = user.connectedPlatforms.find((p) => p.platform === key);
      if (existing) {
        existing.username = username;
      } else if (username) {
        user.connectedPlatforms.push({ platform: key, username });
      }
    }
  }

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

const getBasicInfo = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select(
    "-password -refreshToken",
  );
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "Basic info fetched successfully"));
});

export { updateBasicInfo, getBasicInfo };
