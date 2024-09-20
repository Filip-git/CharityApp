function UserProgressBar({ totalDonations, yearlyGoal = 500 }) {
  const percentage = (totalDonations / yearlyGoal) * 100;

  return (
    <div className="w-full bg-neutral-200 mt-4 h-6 rounded-lg overflow-hidden">
      <div
        className="bg-blue-500 text-center text-xs p-1 text-white flex items-center justify-center"
        style={{ width: `${percentage}%`, fontSize: "0.75rem", height: "100%" }}
      >
        {Math.round(percentage)}% of Yearly Goal
      </div>
    </div>
  );
}

export default UserProgressBar;
