import { useState } from "react";
import { db } from "../firebaseConfig";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";

function AddCharityForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [amountNeeded, setAmountNeeded] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !description || amountNeeded <= 0) {
      toast.error("Please fill in all fields correctly.");
      return;
    }

    try {
      await addDoc(collection(db, "charities"), {
        name,
        description,
        amountNeeded: parseFloat(amountNeeded),
        donatedAmount: 0,
        donations: [],
        date: serverTimestamp(),
      });

      toast.success("Charity added successfully!");
      setName("");
      setDescription("");
      setAmountNeeded(0);
    } catch (error) {
      toast.error("Failed to add charity.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Add New Charity</h2>
      <input
        type="text"
        placeholder="Charity Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="block w-full mb-4 p-2 border"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="block w-full mb-4 p-2 border"
      ></textarea>
      <input
        type="number"
        placeholder="Amount Needed"
        value={amountNeeded}
        onChange={(e) => setAmountNeeded(e.target.value)}
        className="block w-full mb-4 p-2 border"
      />
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
        Add Charity
      </button>
    </form>
  );
}

export default AddCharityForm;
