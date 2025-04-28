import React from 'react';

const TotIncome = ({ contracts }) => {
  // Calculate the sum of totalCost 

  const totalCost = contracts.reduce((sum, contract) => sum + parseFloat(contract.totalCost || 0), 0);

  return (
    <div className="bg-gray-700 p-6 rounded-lg">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2 text-center">Total Income ($)</h3>
        <p className="text-2xl font-bold text-center text-yellow-500">{totalCost.toFixed(2)}</p>
      </div>
    </div>

  );
};

export default TotIncome;
