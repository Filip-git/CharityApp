import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from "firebase/firestore";
import { db } from '../firebaseConfig';

const CharityDetailsPage = () => {
  const { id } = useParams();
  const [charity, setCharity] = useState(null);

  useEffect(() => {
    const fetchCharity = async () => {
      const charityRef = doc(db, 'charities', id);
      const charitySnapshot = await getDoc(charityRef);
      setCharity(charitySnapshot.data());
    };
    fetchCharity();
  }, [id]);

  if (!charity) return <p>Loading...</p>;

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-4">{charity.name}</h2>
      <p>{charity.description}</p>
    </div>
  );
};

export default CharityDetailsPage;
