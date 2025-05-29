import { useState } from "react";
import { useForm } from "react-hook-form";
//import { registerUser } from "../services/api";
import { useNavigate } from "react-router-dom";
import "./Register.css";

interface RegisterFormInputs {
  name: string;
  email: string;
  phoneNumber?: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormInputs>();
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterFormInputs) => {
    if (data.password !== data.confirmPassword) {
      setMessage("Password dan konfirmasi tidak cocok.");
      return;
    }

    try {
      //const response = await registerUser(data);
      setMessage("Registrasi berhasil! Silakan login.");
      setTimeout(() => navigate("/login"), 1500); // Redirect ke login setelah registrasi berhasil
    } catch (error: any) {
      setMessage("Error: " + error.message);
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Registrasi</h2>
      {message && <p className="register-message">{message}</p>}
      
      <form onSubmit={handleSubmit(onSubmit)} className="register-form">
        <div className="form-group">
          <label>Nama:</label>
          <input {...register("name", { required: "Nama wajib diisi" })} placeholder="Nama Lengkap" className="input-field" />
          {errors.name && <p className="error">{errors.name.message}</p>}
        </div>
    
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            {...register("email", {
              required: "Email wajib diisi",
              pattern: { value: /^[^@ ]+@[^@ ]+\.[^@ ]+$/, message: "Email tidak valid" }
            })}
            placeholder="Masukkan email"
            className="input-field"
          />
          {errors.email && <p className="error">{errors.email.message}</p>}
        </div>
    
        <div className="form-group">
          <label>Nomor Telepon:</label>
          <input {...register("phoneNumber")} placeholder="Nomor Telepon (opsional)" className="input-field" />
        </div>
    
        <div className="form-group">
          <label>Password:</label>
          <input type="password" {...register("password", { required: "Password wajib diisi", minLength: { value: 6, message: "Minimal 6 karakter" } })} placeholder="Password" className="input-field" />
          {errors.password && <p className="error">{errors.password.message}</p>}
        </div>
    
        <div className="form-group">
          <label>Konfirmasi Password:</label>
          <input type="password" {...register("confirmPassword", { required: "Konfirmasi password wajib diisi" })} placeholder="Ulangi Password" className="input-field" />
          {errors.confirmPassword && <p className="error">{errors.confirmPassword.message}</p>}
        </div>
    
        <button type="submit" className="register-button">Registrasi</button>
      </form>
      
      {/* Tombol kembali ke login */}
      <button onClick={() => navigate("/login")} className="back-button">Kembali ke Login</button>
    </div>
  );
};

export default Register;