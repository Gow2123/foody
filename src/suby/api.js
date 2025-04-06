// export const API_URL = "https://q-backend-510k.onrender.com"

export const API_URL = "http://localhost:4000"

export const authHeader = () => {
  const token = localStorage.getItem('userToken');
  
  if (token) {
    return { 'Authorization': `Bearer ${token}` };
  } else {
    return {};
  }
};