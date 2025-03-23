import React from 'react';

const TotIncomeLKR = ({ contracts }) => {
  // Calculate the sum of totalCostLKR
  const totalCostLKR = contracts.reduce((sum, contract) => sum + parseFloat(contract.totalCostLKR || 0), 0);

  return (
    <div className="bg-gray-700 p-6 rounded-lg">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2 text-center">Total Income (LKR)</h3>
        <p className="text-2xl font-bold text-center text-yellow-500">{totalCostLKR.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default TotIncomeLKR;
