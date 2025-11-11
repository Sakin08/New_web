export const validateEmail = (email) => {
  // Only allow @student.sust.edu emails
  return /^[^\s@]+@student\.sust\.edu$/.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};
