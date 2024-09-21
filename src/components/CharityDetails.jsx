import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc, arrayUnion, onSnapshot } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import CharityProgressBar from "./CharityProgressBar";
import AddDonation from "./AddDonation";
import { toast } from "react-hot-toast";

const CharityDetails = () => {
  const { id } = useParams();
  const [charity, setCharity] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      console.error('Invalid charity ID');
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(doc(db, "charities", id), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setCharity({
          ...data,
          donated: data.donated || 0,
          amountNeeded: data.amountNeeded || 0,
        });
        setDonations(data.donations || []); // Update donations
        setLoading(false); // Stop loading when data is fetched
      } else {
        console.error("No such charity found!");
      }
    }, (error) => {
      console.error("Error fetching charity:", error);
      toast.error("Failed to load charity.");
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, [id]);

  const handleDonationUpdate = (donationData) => {
    // setCharity((prev) => ({
    //   ...prev,
    //   donated: prev.donated + donationData.amount,
    // }));
    // setDonations((prev) => [
    //   ...prev,
    //   {
    //     userId: donationData.userId,
    //     amount: donationData.amount,
    //     date: new Date(),
    //     anonymous: donationData.anonymous,
    //     username: donationData.username, // Make sure to include the username
    //   },
    // ]);
  };
  

  if (loading) return <p>Loading charity details...</p>;
  if (!charity) return <p>No charity found.</p>;

  

  const handleDonation = async (donationAmount, isAnonymous) => {
    if (!auth.currentUser) {
      toast.error("Please log in to donate.");
      return;
    }

    try {
      const charityRef = doc(db, "charities", id);
      const user = auth.currentUser;

      // Update charity's donations and total donation amount
      await updateDoc(charityRef, {
        donated: charity.donated + donationAmount,
        donations: arrayUnion({
          userId: user.uid,
          amount: donationAmount,
          date: new Date(),
          anonymous: isAnonymous,
        }),
      });

      // Update local state for charity and donations
      setCharity((prev) => ({
        ...prev,
        donated: prev.donated + donationAmount,
      }));
      setDonations((prev) => [
        ...prev,
        {
          userId: user.uid,
          amount: donationAmount,
          date: new Date(),
          anonymous: isAnonymous,
        },
      ]);

      toast.success("Donation successful!");
    } catch (error) {
      toast.error("Failed to update donations.");
    }
  };

  if (loading) return <p>Loading charity details...</p>;
  if (!charity) return <p>No charity found.</p>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">{charity.name}</h1>
      <p className="mb-4">{charity.description}</p>

      {/* Charity Progress Bar */}
      <CharityProgressBar donated={charity.donated} amountNeeded={charity.amountNeeded} />

      <div className="mt-6">
        {/* Render donation form below */}
        <AddDonation charityId={id} charity={charity} onDonate={handleDonationUpdate} />
      </div>

      <h3 className="text-xl font-semibold mb-2">Donations</h3>
      <ul className="bg-gray-50 p-4 rounded-lg shadow-inner">
        {donations.length === 0 ? (
          <li className="text-gray-500 text-sm">No donations yet.</li>
        ) : (
          donations.map((donation, index) => (
            <li
              key={index}
              className="py-2 px-3 mb-2 bg-white rounded-lg shadow-md flex justify-between items-center"
            >
              <span className="text-gray-800">
                {donation.anonymous ? 'Anonymous' : donation.username}
              </span>
              <span className="text-gray-600 font-medium">${donation.amount.toFixed(2)}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default CharityDetails;
