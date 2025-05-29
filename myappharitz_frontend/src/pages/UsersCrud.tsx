import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getUsers, updateUser, deleteUser } from "../services/api";
import "./UsersCrud.css";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
}

interface UpdateUserFormInputs {
  name: string;
  email: string;
  phoneNumber?: string;
  password?: string;
  confirmPassword?: string;
  status: string;
}

const UsersCrud = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [message, setMessage] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<UpdateUserFormInputs>();

  // useEffect(() => {
  //   fetchUsers();
  // }, []);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error: any) {
      setMessage("Error: " + error.message);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
    } else {
      fetchUsers();
    }
  }, [navigate]);

  const onSubmit = async (data: UpdateUserFormInputs) => {
    if ((data.password || data.confirmPassword) && data.password !== data.confirmPassword) {
      setMessage("Password dan konfirmasi tidak cocok.");
      return;
    }

    if (editingUser) {
      try {
        const response = await updateUser(editingUser.id, data);
        setMessage(response);
        setEditingUser(null);
        reset();
        fetchUsers();
      } catch (error: any) {
        setMessage("Error: " + error.message);
      }
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    // Reset form dengan data user yang sedang diedit
    reset({
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      status: user.status,
    });
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await deleteUser(id);
      setMessage(response);
      fetchUsers();
    } catch (error: any) {
      setMessage("Error: " + error.message);
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Dashboard - Manajemen Users</h2>
      {message && <p>{message}</p>}
      
      <p>Total Users: {users.length}</p>
      <table border={1} cellPadding={5}>
        <thead>
          <tr>
            <th>Nama</th>
            <th>Email</th>
            <th>Telepon</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phoneNumber}</td>
              <td>{user.status}</td>
              <td>
                <button onClick={() => handleEdit(user)}>Edit</button>
                <button onClick={() => handleDelete(user.id)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingUser && (
        <div>
          <h3>Edit User</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label>Nama:</label>
              <input {...register("name", { required: "Nama wajib diisi" })} placeholder="Nama" />
              {errors.name && <p>{errors.name.message}</p>}
            </div>
            <div>
              <label>Email:</label>
              <input
                type="email"
                {...register("email", {
                  required: "Email wajib diisi",
                  pattern: { value: /^[^@ ]+@[^@ ]+\.[^@ ]+$/, message: "Email tidak valid" }
                })}
                placeholder="Email"
              />
              {errors.email && <p>{errors.email.message}</p>}
            </div>
            <div>
              <label>Nomor Telepon:</label>
              <input {...register("phoneNumber")} placeholder="Nomor Telepon (opsional)" />
            </div>
            <div>
              <label>Password Baru (opsional):</label>
              <input type="password" {...register("password", { minLength: { value: 6, message: "Password minimal 6 karakter" } })} placeholder="Password Baru" />
              {errors.password && <p>{errors.password.message}</p>}
            </div>
            <div>
              <label>Konfirmasi Password:</label>
              <input type="password" {...register("confirmPassword")} placeholder="Konfirmasi Password" />
            </div>
            <div>
              <label>Status:</label>
              <select {...register("status", { required: "Status wajib dipilih" })}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              {errors.status && <p>{errors.status.message}</p>}
            </div>
            <button type="submit">Simpan Perubahan</button>
            <button type="button" onClick={() => { setEditingUser(null); reset(); }}>Batal</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UsersCrud;