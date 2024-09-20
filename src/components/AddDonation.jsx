import React, { useState, useEffect } from 'react';
import { addDoc, collection, doc, getDoc, updateDoc, increment, serverTimestamp, arrayUnion } from "firebase/firestore";
import { auth, db } from '../firebaseConfig';
import { toast } from "react-hot-toast";
import { onAuthStateChanged } from "firebase/auth";

const AddDonation = ({ charityId, charity, onDonate }) => {
  const [amount, setAmount] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [user, setUser] = useState(null); // Local state for user

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const getUserData = async (uid) => {
    const userDoc = await getDoc(doc(db, "users", uid));
    return userDoc.exists() ? userDoc.data() : null;
  };

  const handleDonate = async (e) => {
    e.preventDefault();
  
    if (!user) {
      toast.error("Please log in to donate.");
      return;
    }
  
    if (amount <= 0) {
      toast.error("Donation amount must be greater than zero.");
      return;
    }
  
    try {
      const userData = await getUserData(user.uid);
      const username = userData ? userData.name : "User";
  
      const donationData = {
        userId: user.uid,
        username,
        charityId,
        amount: parseFloat(amount),
        anonymous,
        date: serverTimestamp(),
      };
  
      const donationRef = await addDoc(collection(db, 'donations'), donationData);
  
      const charityRef = doc(db, "charities", charityId);
      await updateDoc(charityRef, {
        donated: increment(parseFloat(amount)),
        donations: arrayUnion({
          ...donationData,
          date: new Date(),
          id: donationRef.id,
        }),
      });
  
      // Update local state after successful database update
      onDonate(donationData); // Pass the whole donationData object
  
      toast.success("Donation successful!");
      setAmount('');
    } catch (error) {
      console.error("Donation error:", error);
      toast.error("Donation failed. Please try again.");
    }
  };
  

  return (
    <form onSubmit={handleDonate} className="mt-4">
      <input
        type="number"
        placeholder="Donation Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="block w-full mb-4 p-2 border"
      />
      <label className="inline-flex items-center mb-4 mr-4">
        <input
          type="checkbox"
          checked={anonymous}
          onChange={(e) => setAnonymous(e.target.checked)}
          className="mr-2"
        />
        Donate anonymously
      </label>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Donate
      </button>
    </form>
  );
};

export default AddDonation;
