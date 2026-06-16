import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const ForgotPassword = () => {
  const { handleForgotPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    setLoading(true);

    const result =
      await handleForgotPassword(email);

    if (result.success) {
      setMessage(result.message);
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
            <Mail className="text-accent" />
          </div>
        </div>

        <h1 className="text-white text-3xl font-bold text-center mb-2">
          Forgot Password
        </h1>

        <p className="text-white/50 text-center mb-8">
          Enter your email to receive a reset link.
        </p>

        <form
          onSubmit={submitHandler}
          className="space-y-5"
        >
          <input
            type="email"
            required
            placeholder="Enter Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full px-5 py-4 rounded-2xl bg-black border border-white/10 text-white outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-accent text-black font-bold"
          >
            {loading
              ? "Sending..."
              : "Send Reset Link"}
          </button>
        </form>

        {message && (
          <p className="text-center text-sm mt-5 text-white/70">
            {message}
          </p>
        )}

        <Link
          to="/login"
          className="block text-center mt-6 text-accent"
        >
          Back To Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;