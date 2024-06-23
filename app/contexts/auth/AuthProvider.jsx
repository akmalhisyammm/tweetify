import { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import * as SecureStore from 'expo-secure-store';

import { GET_ME } from '../../graphql/queries';
import AuthContext from './AuthContext';

const AuthProvider = ({ children }) => {
  const [me, setMe] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [onFetchMe, { loading }] = useLazyQuery(GET_ME, {
    onCompleted: (data) => {
      setMe(data.getMe);
      setIsAuthenticated(true);
    },
    onError: () => {
      setMe(null);
      setIsAuthenticated(false);
    },
    fetchPolicy: 'network-only',
  });

  const onLogout = async () => {
    await SecureStore.deleteItemAsync('token');
    setMe(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    (async () => {
      const token = await SecureStore.getItemAsync('token');

      if (token) {
        onFetchMe();
      }
    })();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{ me, isAuthenticated, setMe, setIsAuthenticated, onFetchMe, onLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
