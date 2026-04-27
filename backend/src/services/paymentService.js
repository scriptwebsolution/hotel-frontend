const processPayment = async (paymentData) => {
  return {
    success: true,
    transactionId: `txn-${Date.now()}`,
    amount: paymentData?.amount || 0,
  };
};

module.exports = { processPayment };
