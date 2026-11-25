import { ApiError } from "../utils/api-error.js";

export function requireAdmin(req, res, next) {
  if (!["admin", "superAdmin"].includes(req.user.role)) {
    return next(new ApiError(403, "Platform admin access is required."));
  }
  res.set("Cache-Control", "private, no-store");
  next();
}

export function requireSuperAdmin(req, _res, next) {
  if (req.user.role !== "superAdmin") {
    return next(new ApiError(403, "Super Admin access is required."));
  }
  next();
}
