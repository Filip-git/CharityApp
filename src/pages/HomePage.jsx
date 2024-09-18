import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

const Homepage = () => {
  const [charities, setCharities] = useState([]);

  useEffect(() => {
    const fetchCharities = async () => {
      const querySnapshot = await getDocs(collection(db, "charities"));
      const charityList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCharities(charityList);
    };

    fetchCharities();
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-10">
      <h1 className="text-4xl font-bold text-center mb-8">Welcome to Charity App</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {charities.map((charity) => (
          <div key={charity.id} className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-xl font-semibold">{charity.name}</h2>
            <p className="text-gray-700 mt-2">{charity.description}</p>
            <Link
              to={`/charity/${charity.id}`}
              className="inline-block mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              View Charity
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Homepage;
