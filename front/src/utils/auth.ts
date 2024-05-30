export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
  return !!token;
};