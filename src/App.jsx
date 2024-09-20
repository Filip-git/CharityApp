// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import CharityListPage from "./pages/CharityListPage";
import CharityDetailsPage from "./pages/CharityDetailsPage";
import DonationsPage from "./pages/DonationsPage";
import ProfilePage from "./pages/ProfilePage";
import AdminDashboard from "./pages/AdminDashboard";
import AddCharityPage from "./pages/AddCharityPage";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegistrationPage";
import { Toaster } from "react-hot-toast";
import Sidebar from "./components/Sidebar";
import Layout from "./components/Layout";
import CharityDetails from "./components/CharityDetails";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
      <Toaster position="top-center" />
      <Sidebar />
        <main className="flex-grow">
      <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/charities" element={<CharityListPage />} />
            <Route path="/charity/:id" element={<CharityDetails />} />
            <Route path="/donations" element={<DonationsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/add-charity" element={<AddCharityPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
          </Layout>
        </main>
      </div>
    </Router>
  );
}

export default App;
