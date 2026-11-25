import { useEffect, useState } from "react";
import { getAdminData } from "../../api/admin.api.js";

export function useAdminData(path, { page, search, revision } = {}) {
  const [result, setResult] = useState({});
  const key = JSON.stringify([path, page, search, revision]);

  useEffect(() => {
    const controller = new AbortController();
    getAdminData(path, { page, search }, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setResult({ key, data });
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setResult({ key, error: error.response?.data?.message || "Could not load admin data." });
        }
      });
    return () => controller.abort();
  }, [path, page, search, key]);

  return result.key === key ? result : {};
}
