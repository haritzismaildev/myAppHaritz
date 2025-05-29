import { useState } from "react";
import { useForm } from "react-hook-form";
import { loginUser } from "../services/api";
import MFAVerification from "./MFAVerification";
import { useNavigate } from "react-router-dom";
import "./Login.css";

interface LoginFormInputs {
  email: string;
  password: string;
}

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
  const [message, setMessage] = useState("");
  const [showMFA, setShowMFA] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  // Fungsi onSubmit untuk tahap pertama (login)
  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const response = await loginUser(data);
      // Misal API login menginformasikan bahwa email & password benar dan MFA token telah dikirim.
      setMessage(response.message || "MFA token telah dikirim ke email Anda.");
      setEmail(data.email);
      setShowMFA(true);
    } catch (error: any) {
      setMessage("Error: " + error.message);
    }
  };

  // Fungsi callback untuk menangani verifikasi MFA sukses, misalnya dengan menerima token.
  const handleMFASuccess = (authToken: string) => {
    // Simpan token ke localStorage untuk otentikasi
    localStorage.setItem("authToken", authToken);
    // Redirect ke dashboard (UsersCrud)
    navigate("/userscrud");
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      {message && <p className="login-message">{message}</p>}
      
      <form onSubmit={handleSubmit(onSubmit)} className="login-form">
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            {...register("email", {
              required: "Email wajib diisi",
              pattern: {
                value: /^[^@ ]+@[^@ ]+\.[^@ ]+$/,
                message: "Email tidak valid"
              },
            })}
            placeholder="Masukkan email"
            className="input-field"
          />
          {errors.email && <p className="error">{errors.email.message}</p>}
        </div>
    
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            {...register("password", { required: "Password wajib diisi" })}
            placeholder="Masukkan password"
            className="input-field"
          />
          {errors.password && <p className="error">{errors.password.message}</p>}
        </div>
    
        <button type="submit" className="login-button">Login</button>
      </form>
      
      {/* Hanya tombol Registrasi tersisa untuk navigasi ke halaman Registrasi */}
      <div className="action-buttons">
        <button onClick={() => navigate("/register")} className="action-button">
          Registrasi
        </button>
      </div>
    
      {/* Jika MFA diperlukan, tampilkan form verifikasi MFA dan callback untuk redirect */}
      {showMFA && <MFAVerification email={email} onMFASuccess={handleMFASuccess} />}
    </div>
  );
};

export default Login;