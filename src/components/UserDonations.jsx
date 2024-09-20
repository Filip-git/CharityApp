import { useState, useEffect } from "react";
import { db, auth } from "../firebaseConfig";
import { collection, query, where, getDocs, getDoc, doc, updateDoc, increment, deleteDoc } from "firebase/firestore";
import { toast } from "react-hot-toast"; 

const UserDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(null); // Track which donation is being edited
  const [amount, setAmount] = useState(''); // The new amount input field

  useEffect(() => {
    const fetchUser = () => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          setUser(user);
        } else {
          toast.error("Please log in to see your donations.");
        }
      });
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchUserDonations = async () => {
      if (user) {
        try {
          const q = query(collection(db, "donations"), where("userId", "==", user.uid));
          const donationDocs = await getDocs(q);

          const userDonations = await Promise.all(
            donationDocs.docs.map(async (donationDoc) => {
              const donationData = donationDoc.data();
              const charityRef = doc(db, "charities", donationData.charityId);
              const charityDoc = await getDoc(charityRef);
              const charityData = charityDoc.exists() ? charityDoc.data() : {};

              return {
                id: donationDoc.id,
                ...donationData,
                charityName: charityData.name || "N/A",
              };
            })
          );

          setDonations(userDonations);
        } catch (error) {
          console.error("Error fetching donations:", error);
          toast.error("Failed to load donations.");
        } finally {
          setLoading(false);
        }
      }
    };

    if (user) {
      fetchUserDonations();
    }
  }, [user]);


  const handleEdit = async (donationId) => {
    const donation = donations.find(d => d.id === donationId);
    const oldAmount = donation.amount;
    const newAmount = parseFloat(amount); // Parse the new amount properly
    
    if (isNaN(newAmount) || newAmount <= 0) {
      toast.error("Please enter a valid donation amount.");
      return;
    }
  
    try {
      const donationRef = doc(db, "donations", donationId);
      const charityRef = doc(db, "charities", donation.charityId);
      const userRef = doc(db, "users", donation.userId);
  
      // Update the donation amount in the 'donations' collection
      await updateDoc(donationRef, { amount: newAmount });
  
      // Update the charity's total donation amount and donation array
      await updateDoc(charityRef, {
        donated: increment(newAmount - oldAmount), // Adjust the donation total
        donations: donations.map(d =>
          d.id === donationId ? { ...d, amount: newAmount } : d
        ),
      });
  
      // Update the user's total donation and donations array
      await updateDoc(userRef, {
        totalDonated: increment(newAmount - oldAmount), // Adjust total donated by user
        donations: donations.map(d =>
          d.id === donationId ? { ...d, amount: newAmount } : d
        ),
      });
  
      setDonations(prev =>
        prev.map(d => (d.id === donationId ? { ...d, amount: newAmount } : d))
      );
  
      toast.success("Donation updated!");
      setEditing(null); // Exit edit mode
      setAmount(''); // Clear the input field after success
    } catch (error) {
      console.error("Error updating donation:", error);
      toast.error("Failed to update donation.");
    }
  };
  
  const handleDelete = async (donationId) => {
    const donation = donations.find((d) => d.id === donationId);
  
    try {
      const donationRef = doc(db, "donations", donationId);
      const charityRef = doc(db, "charities", donation.charityId);
      const userRef = doc(db, "users", donation.userId);
  
      // Remove the donation from 'donations' collection
      await deleteDoc(donationRef);
  
      // Update the charity's donations and total donations
      await updateDoc(charityRef, {
        donated: increment(-donation.amount), // Subtract the donation amount
        donations: donations.filter((d) => d.id !== donationId), // Remove donation from array
      });
  
      // Update the user's donations and total donated amount
      await updateDoc(userRef, {
        totalDonated: increment(-donation.amount), // Subtract the donation amount from user's total
        donations: donations.filter((d) => d.id !== donationId), // Remove donation from user's array
      });
  
      setDonations(donations.filter((donation) => donation.id !== donationId));
  
      toast.success("Donation deleted!");
    } catch (error) {
      console.error("Error deleting donation:", error);
      toast.error("Failed to delete donation.");
    }
  };
  
  if (loading) return <p>Loading donations...</p>;
  if (!donations.length) return <p>No donations found.</p>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Your Donations</h1>
      <ul className="grid grid-cols-1 gap-4">
        {donations.map((donation) => (
          <li key={donation.id} className="bg-white shadow-md rounded-lg p-4 flex flex-col">
            {editing === donation.id ? (
              <>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Edit donation amount"
                  className="border p-2 mb-4"
                />
                <div className="flex justify-between">
                  <button onClick={() => handleEdit(donation.id)} className="bg-blue-500 text-white px-4 py-2 rounded">
                    Save
                  </button>
                  <button onClick={() => setEditing(null)} className="ml-2 bg-gray-500 text-white px-4 py-2 rounded">
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <p><strong>Charity Name:</strong> {donation.charityName || "N/A"}</p>
                <p><strong>Amount:</strong> ${donation.amount}</p>
                <p><strong>Date:</strong> {new Date(donation.date.seconds * 1000).toLocaleDateString()}</p>
                <p><strong>Anonymous:</strong> {donation.anonymous ? "Yes" : "No"}</p>
                <div className="flex justify-between mt-4">
                  <button onClick={() => setEditing(donation.id)} className="bg-yellow-500 text-white px-4 py-2 rounded">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(donation.id)} className="bg-red-500 text-white px-4 py-2 rounded">
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserDonations;
