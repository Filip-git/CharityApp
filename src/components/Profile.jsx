import { useState, useEffect } from "react";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

function Profile() {
  const [userData, setUserData] = useState(null);
  const [donations, setDonations] = useState([]);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [newName, setNewName] = useState("");
  const [donationGoal, setDonationGoal] = useState(0);
  const [totalDonations, setTotalDonations] = useState(0);

  useEffect(() => {
    const fetchUserProfile = async () => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          // Fetch user data
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
            setNewName(userDoc.data().name);
            setDonationGoal(userDoc.data().donationGoal || 0);

            // Fetch user donations
            const q = query(collection(db, "donations"), where("userId", "==", user.uid));
            const donationDocs = await getDocs(q);
            
            // Map donations to include charity names
            const userDonations = await Promise.all(
              donationDocs.docs.map(async (donationDoc) => {
                const donationData = donationDoc.data();
                const charityDoc = await getDoc(doc(db, "charities", donationData.charityId));
                return {
                  ...donationData,
                  charityName: charityDoc.exists() ? charityDoc.data().name : "Unknown Charity",
                };
              })
            );

            setDonations(userDonations);

            // Sum user donations
            const total = userDonations.reduce((acc, curr) => acc + curr.amount, 0);
            setTotalDonations(total);
          } else {
            console.error("User document does not exist");
          }
        }
      });
    };

    fetchUserProfile();
  }, []);

  const handleUpdateProfile = async () => {
    const userRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(userRef, { name: newName, donationGoal });

    // Update the username in all donations
    const donationQuery = query(collection(db, "donations"), where("userId", "==", auth.currentUser.uid));
    const donationDocs = await getDocs(donationQuery);
    donationDocs.forEach(async (doc) => {
      await updateDoc(doc.ref, { username: newName });
    });

    setIsEditingName(false);
    setIsEditingGoal(false);
  };

  const donationProgress = (totalDonations / donationGoal) * 100;
  const percentage = (totalDonations / donationGoal) * 100;
  const goalReached = percentage >= 100;

  if (!userData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      
      <div className="bg-white shadow-md p-6 rounded-lg mb-8">
        {/* Name Section */}
        <div className="mb-6">
          {isEditingName ? (
            <>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="border p-2 mb-4 w-full rounded"
              />
              <button
                onClick={handleUpdateProfile}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              >
                Save Name
              </button>
            </>
          ) : (
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Name: {userData.name}</h2>
              <button
                onClick={() => setIsEditingName(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Edit
              </button>
            </div>
          )}
        </div>

        {/* Donation Goal Section */}
        <div className="mb-6">
          {isEditingGoal ? (
            <>
              <input
                type="number"
                value={donationGoal}
                onChange={(e) => setDonationGoal(Number(e.target.value))}
                className="border p-2 mb-4 w-full rounded"
                placeholder="Set your donation goal"
              />
              <button
                onClick={handleUpdateProfile}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              >
                Save Goal
              </button>
            </>
          ) : (
            <div className="flex justify-between items-center">
              <p className="text-lg">Donation Goal: ${donationGoal}</p>
              <button
                onClick={() => setIsEditingGoal(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Edit Goal
              </button>
            </div>
          )}
        </div>

        {/* Email Section */}
        <p className="text-gray-700 mb-6 text-lg">Email: {userData.email}</p>
      </div>

      {/* Progress Bar Section */}
<div className="mb-8">
  <h3 className="text-lg font-semibold">Total Donations: ${totalDonations} / ${donationGoal}</h3>
  <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden"> {/* Increased height */}
    <div
      className="bg-green-500 h-full text-center text-sm text-white leading-none" 
      style={{ width: `${donationProgress > 100 ? 100 : donationProgress}%` }}
    >
      {goalReached ? "Goal Achieved!" : `${Math.round(percentage)}% towards goal`}
    </div>
  </div>
</div>

      {/* Donation List */}
      <div className="mt-8">
        <h3 className="text-xl font-bold">Donations</h3>
        {donations.length > 0 ? (
          <ul className="mt-4 space-y-4">
            {donations.map((donation, index) => (
              <li key={index} className="bg-gray-100 p-4 rounded-lg shadow-md">
                <p className="font-semibold">Charity: {donation.charityName}</p>
                <p>Amount: ${donation.amount}</p>
                <p>Date: {new Date(donation.date.seconds * 1000).toLocaleDateString()}</p>
                <p>Anonymous: {donation.anonymous ? "Yes" : "No"}</p>
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
