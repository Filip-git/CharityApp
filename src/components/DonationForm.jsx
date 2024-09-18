import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';

const DonateForm = ({ charityId }) => {
  const [amount, setAmount] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [user] = useAuthState(auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const donationData = {
      charityId,
      amount: parseFloat(amount),
      date: new Date().toISOString(),
    };

    if (user && !anonymous) {
      donationData.userId = user.uid;
      donationData.username = user.displayName || user.email;
    } else {
      donationData.username = "Anonymous";
    }

    await addDoc(collection(db, 'donations'), donationData);
    setAmount('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="block w-full mb-4 p-2 border"
      />
      <label className="flex items-center mb-4">
        <input
          type="checkbox"
          checked={anonymous}
          onChange={(e) => setAnonymous(e.target.checked)}
          className="mr-2"
        />
        Donate anonymously
      </label>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Donate</button>
    </form>
  );
};

export default DonateForm;
