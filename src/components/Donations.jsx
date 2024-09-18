// src/pages/DonationsPage.jsx
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

function Donations() {
  const [donations, setDonations] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
          fetchDonations(currentUser.uid);
        }
      });
    };

    const fetchDonations = async (userId) => {
      const donationsCollection = collection(db, "donations");
      const donationsQuery = query(donationsCollection, where("userId", "==", userId));
      const donationSnapshot = await getDocs(donationsQuery);
      const donationList = donationSnapshot.docs.map(doc => doc.data());
      setDonations(donationList);
    };

    fetchUser();
  }, []);

  if (!user) {
    return <p>You need to be logged in to view your donations.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">My Donations</h1>
      <div className="space-y-4">
        {donations.map((donation, index) => (
          <div key={index} className="bg-white shadow-md p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-2">{donation.charityName}</h2>
            <p className="text-gray-700 mb-2">Amount: ${donation.amount}</p>
            <p className="text-gray-700 mb-2">Date: {new Date(donation.date).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Donations;
