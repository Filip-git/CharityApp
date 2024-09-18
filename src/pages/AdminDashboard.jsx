import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [charities, setCharities] = useState([]);
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const usersSnapshot = await getDocs(collection(db, "users"));
      const usersList = usersSnapshot.docs.map(doc => doc.data());
      setUsers(usersList);

      const charitiesSnapshot = await getDocs(collection(db, "charities"));
      const charitiesList = charitiesSnapshot.docs.map(doc => doc.data());
      setCharities(charitiesList);

      const donationsSnapshot = await getDocs(collection(db, "donations"));
      const donationsList = donationsSnapshot.docs.map(doc => doc.data());
      setDonations(donationsList);
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Users</h2>
        <ul>
          {users.map((user, index) => (
            <li key={index} className="bg-gray-100 p-4 rounded-lg mb-2">
              <p>{user.name}</p>
              <p>{user.email}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Charities</h2>
        <ul>
          {charities.map((charity, index) => (
            <li key={index} className="bg-gray-100 p-4 rounded-lg mb-2">
              <p>{charity.name}</p>
              <p>{charity.description}</p>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="text-xl font-semibold">Donations</h2>
        <ul>
          {donations.map((donation, index) => (
            <li key={index} className="bg-gray-100 p-4 rounded-lg mb-2">
              <p>Amount: {donation.amount}</p>
              <p>Date: {new Date(donation.date).toLocaleDateString()}</p>
              <p>User: {donation.userName}</p>
              <p>Charity: {donation.charityName}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AdminDashboard;
