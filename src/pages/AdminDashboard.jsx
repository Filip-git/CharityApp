import { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { toast } from "react-hot-toast"; 

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [charities, setCharities] = useState([]);
  const [donations, setDonations] = useState([]);
  const [editingCharityId, setEditingCharityId] = useState(null);
  const [editedCharityData, setEditedCharityData] = useState({ name: "", description: "", amountNeeded: 0 });

  useEffect(() => {
    const fetchData = async () => {
      const usersSnapshot = await getDocs(collection(db, "users"));
      const usersList = usersSnapshot.docs.map(doc => doc.data());
      setUsers(usersList);

      const charitiesSnapshot = await getDocs(collection(db, "charities"));
      const charitiesList = charitiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCharities(charitiesList);

      const donationsSnapshot = await getDocs(collection(db, "donations"));
      const donationsList = donationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDonations(donationsList);
    };

    fetchData();
  }, []);

  const handleEditCharity = (charity) => {
    setEditingCharityId(charity.id);
    setEditedCharityData({ name: charity.name, description: charity.description, amountNeeded: charity.amountNeeded });
  };

  const saveCharityEdit = async (charityId) => {
    const charityRef = doc(db, "charities", charityId);
    await updateDoc(charityRef, editedCharityData);
    toast.success("Charity updated!");
    setEditingCharityId(null);
    setEditedCharityData({ name: "", description: "", amountNeeded: 0 });
  };

  const handleDeleteCharity = async (charityId) => {
    const charityRef = doc(db, "charities", charityId);
    await deleteDoc(charityRef);
    toast.success("Charity deleted!");
    setCharities(charities.filter(charity => charity.id !== charityId));
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Users</h2>
        <ul>
          {users.map((user, index) => (
            <li key={index} className="bg-gray-100 p-4 rounded-lg mb-2">
              <p>{user.name}</p>
              <p>{user.email}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Charities</h2>
        <ul>
          {charities.map((charity) => (
            <li key={charity.id} className="bg-gray-100 p-4 rounded-lg mb-2">
              {editingCharityId === charity.id ? (
                <>
                  <input
                    type="text"
                    value={editedCharityData.name}
                    onChange={(e) => setEditedCharityData({ ...editedCharityData, name: e.target.value })}
                    placeholder="Charity Name"
                    className="border p-2 mb-2"
                  />
                  <input
                    type="text"
                    value={editedCharityData.description}
                    onChange={(e) => setEditedCharityData({ ...editedCharityData, description: e.target.value })}
                    placeholder="Description"
                    className="border p-2 mb-2"
                  />
                  <input
                    type="number"
                    value={editedCharityData.amountNeeded}
                    onChange={(e) => setEditedCharityData({ ...editedCharityData, amountNeeded: parseFloat(e.target.value) })}
                    placeholder="Amount Needed"
                    className="border p-2 mb-2"
                  />
                  <button onClick={() => saveCharityEdit(charity.id)} className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
                  <button onClick={() => setEditingCharityId(null)} className="ml-2 bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
                </>
              ) : (
                <>
                  <p>{charity.name}</p>
                  <p>{charity.description}</p>
                  <button onClick={() => handleEditCharity(charity)} className="bg-yellow-500 text-white px-4 py-2 rounded">Edit</button>
                  <button onClick={() => handleDeleteCharity(charity.id)} className="ml-2 bg-red-500 text-white px-4 py-2 rounded">Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="text-xl font-semibold">Donations</h2>
        <ul>
          {donations.map((donation, index) => (
            <li key={index} className="bg-gray-100 p-4 rounded-lg mb-2">
              <p>Amount: {donation.amount}</p>
              <p>Date: {new Date(donation.date).toLocaleDateString()}</p>
              <p>User: {donation.userName}</p>
              <p>Charity: {donation.charityName}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AdminDashboard;
