import "dotenv/config";
import mongoose from "mongoose";
import { User } from "../models/user.models.js";
import { AdminRoleChange } from "../models/adminRoleChange.models.js";

const email = process.argv[2]?.trim().toLowerCase();

try {
  if (!email || !process.env.MONGO_URL) {
    throw new Error("Set MONGO_URL and run npm run admin:bootstrap -- account@example.com.");
  }
  await mongoose.connect(process.env.MONGO_URL, { serverSelectionTimeoutMS: 10_000 });
  await User.createIndexes();
  await AdminRoleChange.init();
  const changed = await mongoose.connection.transaction(async (session) => {
    const current = await User.findOne({ role: "superAdmin" }).select("email").session(session);
    if (current?.email === email) return false;
    if (current) throw new Error("A Super Admin is already configured.");
    const user = await User.findOneAndUpdate(
      { email, isEmailVerified: true },
      { $set: { role: "superAdmin" } },
      { session },
    ).select("role");
    if (!user) throw new Error("No verified account matches that email.");
    await AdminRoleChange.create([{
      userId: user._id,
      fromRole: user.role ?? "user",
      toRole: "superAdmin",
    }], { session });
    return true;
  });
  console.log(changed ? "Super Admin assigned." : "This account is already the Super Admin.");
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
