export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validateRating = (rating: number): boolean => {
  return rating >= 1 && rating <= 5 && Number.isInteger(rating);
};

export const validatePagination = (page?: string, limit?: string) => {
  const pageNum = page ? parseInt(page, 10) : 1;
  const limitNum = limit ? parseInt(limit, 10) : 10;
  
  return {
    page: Math.max(1, pageNum),
    limit: Math.min(Math.max(1, limitNum), 100) // Max 100 items per page
  };
};
