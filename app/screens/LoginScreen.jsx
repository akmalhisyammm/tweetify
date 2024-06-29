import { useContext, useState } from 'react';
import { useMutation } from '@apollo/client';
import { Link } from '@react-navigation/native';
import { Layout, Text } from '@ui-kitten/components';
import Toast from 'react-native-root-toast';
import * as SecureStore from 'expo-secure-store';

import { AuthContext } from '../contexts/auth';
import { LOGIN_USER } from '../graphql/mutations';
import { LoginForm } from '../components/organisms';

const LoginScreen = () => {
  const [form, setForm] = useState({ username: '', password: '' });

  const { onFetchMe } = useContext(AuthContext);

  const [onLogin, { loading }] = useMutation(LOGIN_USER, {
    variables: { payload: form },
    onCompleted: async (data) => {
      await SecureStore.setItemAsync('token', data.login.token);
      onFetchMe();
    },
    onError: (error) => {
      Toast.show(error.message, { duration: Toast.durations.SHORT });
    },
  });

  return (
    <Layout
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 24,
        padding: 18,
      }}
    >
      <Text category="h2" style={{ width: '100%' }}>
        To get started, first enter your username and password
      </Text>

      <LoginForm
        loading={loading}
        form={form}
        setForm={setForm}
        onLogin={onLogin}
      />

      <Text>
        Don&apos;t have an account yet?{' '}
        <Link
          to={{ screen: 'RegisterStack' }}
          style={{ fontWeight: 'bold', color: '#1DA1F2' }}
        >
          Register
        </Link>
      </Text>
    </Layout>
  );
};

export default LoginScreen;
