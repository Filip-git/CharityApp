import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Link } from "react-router-dom";

function CharityList() {
  const [charities, setCharities] = useState([]);

  useEffect(() => {
    const fetchCharities = async () => {
      const charityCollection = collection(db, "charities");
      const charitySnapshot = await getDocs(charityCollection);
      const charityList = charitySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCharities(charityList);
    };

    fetchCharities();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Charities</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {charities.map((charity) => (
          <div key={charity.id} className="bg-white shadow-md p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-2">{charity.name}</h2>
            <p className="text-gray-700 mb-4">{charity.description}</p>
            <Link to={`/charity/${charity.id}`} className="text-blue-500 hover:underline">
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CharityList;
