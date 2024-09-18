import { useState, useEffect } from "react";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

function Profile() {
  const [userData, setUserData] = useState(null);
  const [donations, setDonations] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [donationGoal, setDonationGoal] = useState(1000); // Example goal
  const [totalDonations, setTotalDonations] = useState(0);

  useEffect(() => {
    const fetchUserProfile = async () => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          // Fetch user data
          const userDoc = await getDoc(doc(db, "users", user.uid));
          setUserData(userDoc.data());
          setNewName(userDoc.data().name);

          // Fetch user donations
          const q = query(collection(db, "donations"), where("userId", "==", user.uid));
          const donationDocs = await getDocs(q);
          const userDonations = donationDocs.docs.map((doc) => doc.data());
          setDonations(userDonations);

          // Sum user donations
          const total = userDonations.reduce((acc, curr) => acc + curr.amount, 0);
          setTotalDonations(total);
        }
      });
    };

    fetchUserProfile();
  }, []);

  const handleUpdateProfile = async () => {
    const userRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(userRef, { name: newName });
    setIsEditing(false);
  };

  const donationProgress = (totalDonations / donationGoal) * 100;

  if (!userData) {
    return <p>Loading...</p>;
  }

  const progress = 0;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      <div className="bg-white shadow-md p-6 rounded-lg">
        {isEditing ? (
          <>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="border p-2 mb-4"
            />
            <button
              onClick={handleUpdateProfile}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Save
            </button>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold mb-2">Name: {userData.name}</h2>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Edit Name
            </button>
          </>
        )}
        <p className="text-gray-700 mb-2">Email: {userData.email}</p>
        <p className="text-gray-700 mb-2">Role: {userData.role}</p>
      </div>
      <div className="mt-8">
        <h3 className="text-xl font-bold">Donations</h3>
        <p className="text-gray-600 mb-4">Total Donations: ${totalDonations}</p>
        <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
          <div
            className="bg-green-500 h-4 rounded-full"
            style={{ width: `${donationProgress}%` }}
          ></div>
        </div>
        <p className="text-gray-700 mb-2">Donation Goal: ${donationGoal}</p>
        <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
  <div
    className="bg-blue-600 h-4 rounded-full text-center text-xs font-medium leading-none text-white"
    style={{ width: `${progress}%` }}
  >
    {progress}%
  </div>
</div>


        {donations.length > 0 ? (
          <ul className="mt-4">
            {donations.map((donation, index) => (
              <li key={index} className="bg-gray-100 p-4 rounded-lg mb-2">
                <p>Amount: {donation.amount}</p>
                <p>Date: {new Date(donation.date).toLocaleDateString()}</p>
                <p>Charity: {donation.charityName}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No donations found.</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
