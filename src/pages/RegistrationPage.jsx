import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-hot-toast"; // Notification library

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
      
        await setDoc(doc(db, "users", user.uid), {
          name: username,
          displayName: username,
          email: user.email,
          role: "user",
          userId: user.uid,
          donationGoal: 0,
          totalDonated: 0,
          donations: [],
        });
        toast.success("Registration successful! You are now logged in.");
        navigate("/");
      } catch (err) {
        console.error("Error during registration or Firestore write:", err);
        setError("Failed to register. Please try again.");
      }
      
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Register</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-600 hover:underline"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
