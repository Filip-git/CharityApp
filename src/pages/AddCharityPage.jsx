import React, { useState } from 'react';
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from '../firebaseConfig';

const AddCharityPage = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [amountNeeded, setAmountNeeded] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Add charity data to Firestore
    await addDoc(collection(db, 'charities'), {
      name,
      description,
      amountNeeded: parseFloat(amountNeeded),
      date: serverTimestamp(), // auto-generates date and time
    });

    // Clear the form fields after submission
    setName('');
    setDescription('');
    setAmountNeeded('');
    setDate('');
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-4">Add Charity</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Charity Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="block w-full mb-4 p-2 border"
        />
        <textarea
          placeholder="Charity Description"
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
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Add Charity</button>
      </form>
    </div>
  );
};

export default AddCharityPage;
