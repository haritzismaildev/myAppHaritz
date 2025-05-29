import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { verifyMFA } from "../services/api";
import "./MFAVerification.css";

interface MFAVerificationFormInputs {
  email: string;
  mfaToken: string;
}

interface MFAVerificationProps {
  email: string;
  onMFASuccess: (authToken: string) => void;
}

const MFAVerification: React.FC<MFAVerificationProps> = ({ email, onMFASuccess }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<MFAVerificationFormInputs>({
    defaultValues: { email }
  });
  const [message, setMessage] = useState("");

  const onSubmit = async (data: MFAVerificationFormInputs) => {
    try {
      const response = await verifyMFA(data);
      // Misal respon verifikasi MFA mengembalikan token autentikasi
      setMessage("Verifikasi sukses! Redirecting...");
      onMFASuccess(response.token); // Panggil callback untuk mengarahkan ke dashboard
    } catch (error: any) {
      setMessage("Error: " + error.message);
    }
  };

  return (
    <div className="mfa-container">
      <h3>Verifikasi MFA</h3>
      {message && <p className="mfa-message">{message}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="mfa-form">
        <div className="form-group">
          <label>Email:</label>
          <input type="email" {...register("email", { required: true })} readOnly className="input-field" />
        </div>
        <div className="form-group">
          <label>MFA Token:</label>
          <input
            {...register("mfaToken", { required: "MFA token wajib diisi" })}
            placeholder="Masukkan MFA Token"
            className="input-field"
          />
          {errors.mfaToken && <p className="error">{errors.mfaToken.message}</p>}
        </div>
        <button type="submit" className="mfa-button">Verifikasi</button>
      </form>
    </div>
  );
};

export default MFAVerification;