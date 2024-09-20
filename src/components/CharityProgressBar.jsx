function CharityProgressBar({ donated, amountNeeded }) {
  if (amountNeeded === 0) {
    return (
      <div className="w-full bg-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-300 text-center text-sm py-2 text-white">
          No goal set
        </div>
      </div>
    );
  }

  const percentage = (donated / amountNeeded) * 100;
  const goalReached = percentage >= 100;

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Charity Progress</h2>
            <div className="w-full bg-gray-200 rounded-lg overflow-hidden mb-4">
            <div
          className={`text-center text-sm py-1 text-white font-semibold ${goalReached ? 'bg-green-600' : 'bg-green-500'}`}
          style={{ width: `${Math.min(percentage, 100)}%`, transition: 'width 0.5s ease-in-out' }}
        >
        {Math.round(percentage)}% of Goal Reached
      </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <p className="text-gray-700"><strong>Donated:</strong> ${donated.toFixed(2)}</p>
        <p className="text-gray-700"><strong>Goal:</strong> ${amountNeeded.toFixed(2)}</p>
        <p className={`text-sm font-bold ${goalReached ? 'text-green-600' : 'text-red-600'}`}>
          {goalReached ? 'Goal Achieved!' : `${Math.round(percentage)}% towards goal`}
        </p>
      </div>
      
    </div>
  );
}

export default CharityProgressBar;