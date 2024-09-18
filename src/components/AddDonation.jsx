import React, { useState } from 'react';
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

const AddDonation = ({ charityId }) => {
  const [amount, setAmount] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    
    if (user) {
      await addDoc(collection(db, 'donations'), {
        userId: user.uid,
        charityId: charityId,
        amount: parseFloat(amount),
        date: serverTimestamp(), // Adds timestamp
      });

      setAmount('');
    } else {
      alert("Please log in to donate");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        placeholder="Donation Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="block w-full mb-4 p-2 border"
      />
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Donate</button>
    </form>
  );
};

export default AddDonation;
