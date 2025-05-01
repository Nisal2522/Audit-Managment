import React from 'react';

const TotIncome = ({ contracts }) => {
  // Ensure we have an array of contracts
  if (!Array.isArray(contracts)) {
    console.error('Contracts is not an array:', contracts);
    return null;
  }

  // Calculate totals for both pending and approved contracts
  const pendingContracts = contracts.filter(contract => contract.status === "Pending");
  const approvedContracts = contracts.filter(contract => contract.status === "Approved");

  const pendingTotal = pendingContracts.reduce((sum, contract) => {
    const cost = Number(contract.totalCost || 0);
    return sum + cost;
  }, 0);

  const approvedTotal = approvedContracts.reduce((sum, contract) => {
    const cost = Number(contract.totalCost || 0);
    return sum + cost;
  }, 0);

  return (
    <div className="bg-gray-700 p-6 rounded-lg">
      <div className="text-center space-y-4">
        <h3 className="text-lg font-semibold mb-2 text-center">Total Income ($)</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400">Pending</p>
            <p className="text-xl font-bold text-orange-500">${pendingTotal.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Approved</p>
            <p className="text-xl font-bold text-green-500">${approvedTotal.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotIncome;
