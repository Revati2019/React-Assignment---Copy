import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { logout } from '../redux/AuthSlice';

const useAuthToken = () => {
  const token = useSelector(state => state.auth.token) || localStorage.getItem('token');
  const dispatch = useDispatch();

  const clearAuth = () => {
    localStorage.removeItem('token');
    dispatch(logout());
  };

  return { token, clearAuth };
};

export default useAuthToken;
