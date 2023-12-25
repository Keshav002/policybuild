import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser, removeUser } from '../store/userSlice';
import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';
import { useNavigate, useLocation } from 'react-router-dom';
function UserDataPersistence() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const accessToken = Cookies.get('accessToken');
    const publicRoutes = ['/', '/signup'];

    if (!accessToken && !publicRoutes.includes(location.pathname)) {
      dispatch(removeUser());
      navigate('/');
      return;
    }
    if (accessToken) {
      const decodedToken = jwtDecode(accessToken);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp > currentTime) {
        dispatch(setUser(decodedToken));
      } else {
        dispatch(removeUser());
      }
    }
  }, []);

  return null;
}

export default UserDataPersistence;
