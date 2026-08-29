import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../api/auth.api";
import { UserContext } from "../../context/UserContext";


function OAuthSuccess() {
  const navigate = useNavigate();
  const { login } = useContext(UserContext);

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        const data = res?.data || res;
        if (data) {
          login(data);
          navigate("/workspace", { replace: true });
        } else {
          navigate("/login?error=oauth_failed", { replace: true });
        }
      })
      .catch(() => {
        navigate("/login?error=oauth_failed", { replace: true });
      });
  }, [login, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black gap-4">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500" />
      <p className="text-zinc-400 text-sm">Signing you in...</p>
    </div>
  );
}

export default OAuthSuccess;
