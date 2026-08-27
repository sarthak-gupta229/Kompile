import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { User } from "../models/user.models.js";
import { UserLoginLog } from "../models/userLoginLog.models.js";
import {
  emailVerificationMailgenContent,
  forgotPasswordMailgenContent,
  sendEmail,
} from "../utils/mail.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch {
    throw new ApiError(
      500,
      "Something went wrong while generating access token",
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const {
    email,
    username,
    password,
    confirmPassword,
    leetcodeUsername,
    githubUsername,
  } = req.body;

  if (password !== confirmPassword) {
    throw new ApiError(400, "Passwords do not match");
  }

  const existedUser = await User.findOne({ $or: [{ username }, { email }] });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists", []);
  }

  const connectedPlatforms = [];
  if (leetcodeUsername) {
    connectedPlatforms.push({
      platform: "leetcode",
      username: leetcodeUsername,
    });
  }
  if (githubUsername) {
    connectedPlatforms.push({ platform: "github", username: githubUsername });
  }

  const user = await User.create({
    email,
    password,
    username,
    isEmailVerified: false,
    connectedPlatforms,
  });

  const { unHashedToken, hashedToken, tokenExpiry } =
    await user.generateTemporaryToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;

  await user.save({ validateBeforeSave: false });

  await sendEmail({
    email: user.email,
    subject: "Verify Email",
    mailgenContent: emailVerificationMailgenContent(
      user.username,
      `${process.env.CORS_ORIGIN}/verify-email/${unHashedToken}`,
    ),
  });

  
  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { email: user.email, username: user.username },
        "Registration successful! Please check your email to verify your account.",
      ),
    );
});

const login = asyncHandler(async (req, res) => {
  let { email, username, password } = req.body;
  if (!email) {
    throw new ApiError(400, "email is required");
  }
  let user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(400, "user does not exist");
  }
  const isPasswordcorrect = await user.isPasswordCorrect(password);
  if (!isPasswordcorrect) {
    throw new ApiError(400, "Invalid credentials");
  }

  if (!user.isEmailVerified) {
    throw new ApiError(
      403,
      "Please verify your email before logging in. Check your inbox for a verification link.",
    );
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id,
  );

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  try {
    await UserLoginLog.create({ userId: user._id, date: today });
  } catch (err) {
    
    if (err.code !== 11000) {
      console.error("Failed to record login:", err);
    }
  }

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
  );
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully",
      ),
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: "",
      },
    },
    {
      returnDocument: "after",
    },
  );
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user logged out"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { verificationToken } = req.params;
  if (!verificationToken) {
    throw new ApiError(404, "Email verification token is missing");
  }

  let hashedToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpiry: { $gt: Date.now() },
  });

  if (!user) {
    const alreadyVerified = await User.findOne({
      isEmailVerified: true,
      emailVerificationToken: undefined,
    });
    throw new ApiError(400, "Token is invalid or expired");
  }

  user.emailVerificationToken = undefined;
  user.emailVerificationExpiry = undefined;
  user.isEmailVerified = true;

  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, { isEmailVerified: true }, "Email is Verified"));
});

const resendEmailVerification = asyncHandler(async (req, res) => {
 
  const { email } = req.body;
  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
  
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "If that email exists, a verification link has been sent."));
  }
  if (user.isEmailVerified) {
    throw new ApiError(409, "Email is already verified");
  }

  const { unHashedToken, hashedToken, tokenExpiry } =
    await user.generateTemporaryToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;

  await user.save({ validateBeforeSave: false });

  await sendEmail({
    email: user.email,
    subject: "Verify Email",
    mailgenContent: emailVerificationMailgenContent(
      user.username,
      `${process.env.CORS_ORIGIN}/verify-email/${unHashedToken}`,
    ),
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Verification email sent! Check your inbox."));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized access");
  }
  try {
    let decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );
    let user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired");
    }
    let options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };
    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    user.refreshToken = newRefreshToken;
    await user.save();
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, newRefreshToken },
          "Access token refreshed",
        ),
      );
  } catch (error) {
    throw new ApiError(401, "Invalid refresh token");
  }
});

const forgotPasswordRequest = asyncHandler(async (req, res) => {
  let { email } = req.body;
  let user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User does not exists", []);
  }

  const { hashedToken, unHashedToken, tokenExpiry } =
    await user.generateTemporaryToken();
  user.forgotPasswordToken = hashedToken;
  user.forgotPasswordExpiry = tokenExpiry;
  await user.save({ validateBeforeSave: false });

  const redirectBase =
    process.env.FORGOT_PASSWORD_REDIRECT_URL ||
    `${process.env.CLIENT_URL || "http://localhost:5173"}/forgot-password`;
  const resetUrl = `${redirectBase.replace(/\/$/, "")}/${unHashedToken}`;

  await sendEmail({
    email: user?.email,
    subject: "Password reset request",
    mailgenContent: forgotPasswordMailgenContent(user.username, resetUrl),
  });
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "Password reset mail has been sent on your mail id",
      ),
    );
});

const resetForgotPassword = asyncHandler(async (req, res) => {
  const { resetToken } = req.params;
  const { newPassword } = req.body;

  let hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  const user = await User.findOne({
    forgotPasswordToken: hashedToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });
  if (!user) {
    throw new ApiError(400, "Token is invalid or expired");
  }
  user.password = newPassword;
  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;
  await user.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset successfully"));
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);

  const isPasswordValid = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid old Password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

export const getLoginHistory = asyncHandler(async (req, res) => {
  const logs = await UserLoginLog.find({ userId: req.user._id })
    .sort({ date: 1 })
    .select("date")
    .lean();

  return res.status(200).json(
    new ApiResponse(
      200,
      logs.map((l) => l.date),
      "Login history fetched",
    ),
  );
});

export const googleAuthCallback = asyncHandler(async (req, res) => {
  const user = req.user; 
  if (!user) throw new ApiError(401, "Google authentication failed");

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id,
  );

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  try {
    await UserLoginLog.create({ userId: user._id, date: today });
  } catch (err) {
    if (err.code !== 11000) console.error("Failed to record login:", err);
  }

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .redirect(`${process.env.CLIENT_URL}/oauth-success`);
});

export {
  registerUser,
  login,
  logoutUser,
  getCurrentUser,
  verifyEmail,
  resendEmailVerification,
  refreshAccessToken,
  resetForgotPassword,
  forgotPasswordRequest,
  changeCurrentPassword,
};
