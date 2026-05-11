import axios from 'axios';

const useAxios = () => {
  const token = localStorage.getItem('token');
  
  const instance = axios.create({
    baseURL: 'http://localhost:3001/api',
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });

  return instance;
};

export default useAxios;
