import axios from "./axiosInstance.js";

export async function getAdminData(path, params, signal) {
  const response = await axios.get(`/admin/${path}`, { params, signal });
  return response.data.data;
}

export async function saveAdminRole(userId, role) {
  const response = await axios.patch(`/admin/users/${userId}/role`, { role });
  return response.data.data;
}

export async function importAdminSheet(action, input) {
  const response = await axios.post(`/admin/sheets/${action}`, input);
  return response.data.data;
}

export async function downloadAdminCsv(path, filename) {
  const response = await axios.get(`/admin/${path}`, { responseType: "blob" });
  const url = URL.createObjectURL(response.data);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function deleteAdminSheet(sheetId) {
  const response = await axios.delete(`/admin/sheets/${sheetId}`);
  return response.data.data;
}
