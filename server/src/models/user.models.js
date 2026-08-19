import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new Schema(
  {
    avatar: {
      type: {
        url: String,
        localPath: String,
      },
      default: {
        url: `https://placehold.co/200x200`,
        localPath: "",
      },
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    fullname: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
    forgotPasswordToken: {
      type: String,
    },
    forgotPasswordExpiry: {
      type: Date,
    },
    emailVerificationToken: {
      type: String,
    },
    emailVerificationExpiry: {
      type: Date,
    },
    //data
    bio: {
      type: String,
      maxLength: [200, "Bio cannot exceed 200 characters"],
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    techStack: [
      {
        type: String,
        trim: true,
      },
    ],
    education: {
      institution: { type: String, trim: true },
      degree: { type: String, trim: true },
      branch: { type: String, trim: true },
      graduationYear: { type: Number },
    },
    socialLinks: {
      linkedin: { type: String, trim: true },
      twitter: { type: String, trim: true },
      website: { type: String, trim: true },
      resume: { type: String, trim: true },
    },
    // platform data
    connectedPlatforms: [
      {
        platform: {
          type: String,
          enum: ["leetcode", "github", "codeforces", "hackerrank", "gfg"],
          required: true,
        },
        username: { type: String, trim: true, required: true },
        isVerified: { type: Boolean, default: false },
        connectedAt: { type: Date, default: Date.now },
      },
    ],
    stats: {
      totalQuestions: { type: Number, default: 0 },
      totalActiveDays: { type: Number, default: 0 },

      difficulty: {
        easy: { type: Number, default: 0 },
        medium: { type: Number, default: 0 },
        hard: { type: Number, default: 0 },
      },
      contests: {
        totalAttended: { type: Number, default: 0 },
        byPlatform: [
          {
            platform: { type: String, enum: ["leetcode", "codeforces"] },
            attended: { type: Number, default: 0 },
            rating: { type: Number, default: null },
          },
        ],
      },
      topicAnalysis: [
        {
          topic: { type: String },
          count: { type: Number, default: 0 },
        },
      ],
      languages: [
        {
          name: { type: String },
          percentage: { type: Number, default: 0 },
        },
      ],
      heatmap: [
        {
          date: { type: Date },
          count: { type: Number, default: 0 },
        },
      ],
      lastSyncedAt: { type: Date },
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
  );
};

userSchema.methods.generateRefreshToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY },
  );
};

userSchema.methods.generateTemporaryToken = async function () {
  const unHashedToken = crypto.randomBytes(20).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(unHashedToken)
    .digest("hex");

  const tokenExpiry = Date.now() + 20 * 60 * 1000;
  return { unHashedToken, hashedToken, tokenExpiry };
};

const platformProfileSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    handle: { type: String, required: true, trim: true },
    platform: {
      type: String,
      enum: ["leetcode", "codeforces", "github"],
      required: true,
    },
    profileUrl: {
      type: String,
      trim: true,
    },
    avatarUrl: {
      type: String,
      trim: true,
    },
    stats: {
      // leetcode / codeforces
      totalQuestions: { type: Number, default: 0 },
      contestRating: { type: Number, default: 0 },
      contestsAttended: { type: Number, default: 0 },
      easySolved: { type: Number, default: 0 },
      mediumSolved: { type: Number, default: 0 },
      hardSolved: { type: Number, default: 0 },

      activeDays: { type: Number, default: 0 },

      // github
      totalContributions: { type: Number, default: 0 },
      maxStreak: { type: Number, default: 0 },
      currentStreak: { type: Number, default: 0 },
      stars: { type: Number, default: 0 },
      commits: { type: Number, default: 0 },
      prs: { type: Number, default: 0 },
      issues: { type: Number, default: 0 },
    },
    languages: [
      {
        name: String,
        percentage: Number,
        count: Number,
      },
    ],
    topicAnalysis: [{ topic: String, count: Number }],
    heatmap: [{ date: Date, count: Number }],
    recentAcSubmissions: [
      {
        id: String,
        title: String,
        titleSlug: String,
        solvedAt: Date,
      },
    ],
    lastSyncedAt: Date,
    syncStatus: {
      type: String,
      enum: ["success", "failed", "pending"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);
platformProfileSchema.index({ userId: 1, platform: 1 }, { unique: true });
export const PlatformProfile = mongoose.model(
  "PlatformProfile",
  platformProfileSchema,
);

export const User = mongoose.model("User", userSchema);
