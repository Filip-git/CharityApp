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
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-600 text-white py-20">
        <h1 className="text-5xl font-bold text-center">Welcome to CharityApp</h1>
        <p className="text-lg text-center mt-4">
          Make a difference today by supporting the charities you care about!
        </p>
        <div className="text-center mt-10">
          <Link className="bg-white text-blue-600 px-6 py-2 rounded-md font-semibold" to='/charities'>
            View Charities
          </Link>
        </div>
      </div>
      <div className="py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
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
    </div>
  );
};

export default Homepage;
