export const handleAuthError = (error: any, dispatch: any, navigate: any) => {
  if (error.response?.status === 401 || 
      error.response?.data?.message?.includes('Invalid token') ||
      error.response?.data?.message?.includes('Authentication token is required')) {
    // Clear auth state
    dispatch({ type: 'LOGOUT' });
    // Redirect to login
    navigate('/login', { 
      state: { message: 'Your session has expired. Please log in again.' }
    });
    return true; // Indicates auth error was handled
  }
  return false; // Not an auth error
};