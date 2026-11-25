import { Schema, model } from "mongoose";

const roleChangeSchema = new Schema({
  actorId: { type: Schema.Types.ObjectId, ref: "User", default: null },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  fromRole: { type: String, required: true },
  toRole: { type: String, required: true },
}, { timestamps: { createdAt: true, updatedAt: false } });

roleChangeSchema.index({ createdAt: -1, _id: -1 });

export const AdminRoleChange = model("AdminRoleChange", roleChangeSchema);
