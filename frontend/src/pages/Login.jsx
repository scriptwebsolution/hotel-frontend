import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/dashboard";

  const [form, setForm] = useState({ email: "", password: "", captcha: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Validations
    if (!form.email || !form.password || !form.captcha) {
      setError("Please fill all required fields, including the captcha.");
      return;
    }
    
    // Mock captcha validation
    if (form.captcha.toLowerCase().replace(/\s/g, "") !== "phtd") {
      setError("Invalid Captcha. Please enter the correct text.");
      return;
    }

    setSubmitting(true);
    try {
      await login({ email: form.email, password: form.password });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || "Unable to sign in");
    } finally {
      setSubmitting(false);
    }
  };

  // Mock Captcha component
  const MockCaptcha = () => (
    <div className="relative h-14 w-full bg-white border border-gray-200 rounded overflow-hidden select-none mb-3">
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <path d="M-10,20 Q40,60 100,10 T200,40" stroke="#e5e7eb" strokeWidth="1" fill="none" />
        <path d="M0,40 Q60,10 120,50 T300,20" stroke="#e5e7eb" strokeWidth="1" fill="none" />
        <path d="M20,10 Q80,50 150,10 T300,40" stroke="#f3f4f6" strokeWidth="2" fill="none" />
        <path d="M-20,30 Q50,-10 130,60 T320,30" stroke="#e5e7eb" strokeWidth="1" fill="none" />
        <path d="M10,50 Q70,20 140,50 T280,10" stroke="#f3f4f6" strokeWidth="2" fill="none" />
        <path d="M0,0 L300,60 M0,60 L300,0" stroke="#e5e7eb" strokeWidth="0.5" fill="none" />
        <path d="M50,0 L100,60 M150,0 L200,60" stroke="#e5e7eb" strokeWidth="0.5" fill="none" />
        <text x="30%" y="60%" fill="#22c55e" fontSize="20" fontFamily="serif" transform="rotate(-5 80 30)">p</text>
        <text x="45%" y="45%" fill="#16a34a" fontSize="22" fontFamily="serif" transform="rotate(10 130 20)">h</text>
        <text x="60%" y="55%" fill="#15803d" fontSize="18" fontFamily="serif" transform="rotate(-15 170 30)">t</text>
        <text x="75%" y="40%" fill="#166534" fontSize="24" fontFamily="serif" transform="rotate(5 210 20)">d</text>
      </svg>
    </div>
  );

  return (
    <AuthLayout
      title="Sign In"
      subtitle="Sign in Using Your Email Address"
    >
      {error && (
        <div
          role="alert"
          className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="email" className="label font-semibold text-gray-800 text-sm mb-1.5 block">
            Your email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="input w-full"
          />
        </div>

        <div>
          <label htmlFor="password" className="label font-semibold text-gray-800 text-sm mb-1.5 block">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              minLength={8}
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="input w-full pr-10"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div>
          <MockCaptcha />
          <input
            id="captcha"
            name="captcha"
            type="text"
            required
            value={form.captcha}
            onChange={handleChange}
            placeholder="Captcha"
            className="input w-full"
          />
        </div>

        <div className="flex justify-end mt-2">
          <button
            type="button"
            className="text-[13px] font-medium text-[#4caf50] hover:text-[#388e3c] focus:outline-none"
            onClick={() => setError("Password reset is coming soon — contact your admin.")}
          >
            Forgot Password
          </button>
        </div>

        <button type="submit" disabled={submitting} className="btn-primary w-full !bg-[#34a853] hover:!bg-[#2e964a] !text-white !border-none py-2.5 rounded font-medium transition-colors mt-2">
          {submitting ? "Logging In..." : "Log In"}
        </button>
      </form>

      <div className="mt-8 overflow-hidden rounded border border-gray-200 bg-white">
        <table className="w-full text-left text-[13px] text-gray-700">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-3 py-2.5 font-semibold">Email</th>
              <th className="px-3 py-2.5 font-semibold border-l border-gray-200">Password</th>
              <th className="px-3 py-2.5 font-semibold border-l border-gray-200">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="px-3 py-2.5">tester1@gmail.com</td>
              <td className="px-3 py-2.5 border-l border-gray-200">tester1@123</td>
              <td className="px-3 py-2.5 border-l border-gray-200">Super Admin</td>
            </tr>
            <tr>
              <td className="px-3 py-2.5">manager1@gmail.com</td>
              <td className="px-3 py-2.5 border-l border-gray-200">manager1@123</td>
              <td className="px-3 py-2.5 border-l border-gray-200">Manager</td>
            </tr>
            <tr>
              <td className="px-3 py-2.5">cashier1@gmail.com</td>
              <td className="px-3 py-2.5 border-l border-gray-200">cashier1@123</td>
              <td className="px-3 py-2.5 border-l border-gray-200">Cashier</td>
            </tr>
          </tbody>
        </table>
      </div>
    </AuthLayout>
  );
}
