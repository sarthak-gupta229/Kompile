export const roleName = (role) => ({ user: "User", admin: "Admin", superAdmin: "Super Admin" })[role] ?? "User";
export const formatDate = (value) => value ? new Date(value).toLocaleString() : "—";
export const fieldLabel = (key) => key.replace(/([A-Z])/g, " $1").replace(/^./, (value) => value.toUpperCase());
