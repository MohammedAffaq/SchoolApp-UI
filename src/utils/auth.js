// Authentication utility functions
export const getAuthToken = () => {
  try {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return currentUser?.token;
  } catch (error) {
    return null;
  }
};

export const getCurrentUser = () => {
  try {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return currentUser;
  } catch (error) {
    return null;
  }
};

export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const payload = JSON.parse(jsonPayload);
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    return true;
  }
};

export const validateAuth = () => {
  const token = getAuthToken();
  const user = getCurrentUser();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  // 1. Check for token-based authentication
  if (token && user) {
    if (isTokenExpired(token)) {
      return { isValid: false, error: 'Session expired. Please login again.' };
    }
    return { isValid: true, user, token };
  }

  // 2. Fallback for local/legacy authentication (e.g. local admin without token)
  if (user && isLoggedIn) {
    return { isValid: true, user, token: null };
  }

  return { isValid: false, error: 'No authentication found' };
};

export const logout = async () => {
  try {
    const token = getAuthToken();
    const user = getCurrentUser();

    if (token && user) {
      // Determine logout endpoint based on user role
      const logoutEndpoint = user.role === 'admin' ? 'http://localhost:5000/auth/logout' : 'http://localhost:5000/api/logout';

      await fetch(logoutEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    }
  } catch (error) {
    console.error('Logout API call failed:', error);
  }

  // Clear localStorage regardless of API call success
  localStorage.removeItem('currentUser');
  localStorage.removeItem('userRole');
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userName');
  localStorage.removeItem('token');
  // Clear parent-specific data
  localStorage.removeItem('parentName');
  localStorage.removeItem('childName');
  localStorage.removeItem('childGrade');
  window.location.href = '/';
};
