import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const ResetPassword = () => {
  const { token } = useParams();

  const navigate = useNavigate();

  const { handleResetPassword } =
    useAuth();

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (
      password !== confirmPassword
    ) {
      return setMessage(
        "Passwords do not match"
      );
    }

    setLoading(true);

    const result =
      await handleResetPassword(
        token,
        password
      );

    if (result.success) {
      setMessage(result.message);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } else {
      setMessage(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#111] border border-white/10 rounded-3xl p-8">
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center">
            <Lock className="text-accent" />
          </div>
        </div>

        <h1 className="text-white text-3xl font-bold text-center mb-2">
          Reset Password
        </h1>

        <p className="text-white/50 text-center mb-8">
          Enter your new password.
        </p>

        <form
          onSubmit={submitHandler}
          className="space-y-5"
        >
          <input
            type="password"
            required
            placeholder="New Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            className="w-full px-5 py-4 rounded-2xl bg-black border border-white/10 text-white outline-none"
          />

          <input
            type="password"
            required
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(
                e.target.value
              )
            }
            className="w-full px-5 py-4 rounded-2xl bg-black border border-white/10 text-white outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-accent text-black font-bold"
          >
            {loading
              ? "Updating..."
              : "Reset Password"}
          </button>
        </form>

        {message && (
          <p className="text-center text-sm mt-5 text-white/70">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;