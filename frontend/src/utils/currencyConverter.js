// Function to fetch the latest USD to LKR exchange rate
export const getUSDToLKRRate = async () => {
  try {
    // Using exchangerate-api.com's free API
    const response = await fetch(`https://v6.exchangerate-api.com/v6/${process.env.REACT_APP_EXCHANGE_RATE_API_KEY}/latest/USD`);
    const data = await response.json();
    
    if (data.result === 'success') {
      return data.conversion_rates.LKR;
    } else {
      console.error('Failed to fetch exchange rate:', data);
      return 299.45; // Current market rate as fallback
    }
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    return 299.45; // Current market rate as fallback
  }
};

// Function to convert USD to LKR
export const convertUSDToLKR = async (usdAmount) => {
  const rate = await getUSDToLKRRate();
  return usdAmount * rate;
}; 