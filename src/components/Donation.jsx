import { useState } from "react";
import { db } from "../firebaseConfig";
import { doc, updateDoc, increment } from "firebase/firestore";
import { toast } from "react-toastify";

function Donate({ charityId, user }) {
  const [amount, setAmount] = useState(0);

  const handleDonate = async () => {
    if (!user) {
      toast.error("Please log in to donate.");
      return;
    }

    try {
      const charityRef = doc(db, "charities", charityId);
      const userRef = doc(db, "users", user.uid);

      // Update charity's donated amount
      await updateDoc(charityRef, {
        donated: increment(amount),
      });

      // Update user's total donations and add donation to history
      await updateDoc(userRef, {
        totalDonations: increment(amount),
        donations: [...user.donations, { charityId, amount, date: new Date() }],
      });

      toast.success("Donation successful!");
    } catch (error) {
      toast.error("Donation failed. Please try again.");
    }
  };

  return (
    <div>
      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="border p-2 mb-4"
      />
      <button onClick={handleDonate} className="bg-blue-500 text-white px-4 py-2 rounded">
        Donate
      </button>
    </div>
  );
}

export default Donate;
