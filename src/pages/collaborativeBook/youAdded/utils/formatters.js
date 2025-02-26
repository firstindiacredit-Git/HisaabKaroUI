export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString("en-IN", {
    dateStyle: "short",
    timeStyle: "short",
  });
};

export const formatAmount = (amount) => {
  return Number(amount).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
};

export const formatAmountWithoutPrefix = (amount) => {
  const num = Number(amount);
  if (isNaN(num)) return "0.00";
  return Math.abs(num).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
};

export const getHoverClass = (transactionType) => {
  return transactionType === "you will get"
    ? "hover:bg-green-50"
    : "hover:bg-red-50";
};