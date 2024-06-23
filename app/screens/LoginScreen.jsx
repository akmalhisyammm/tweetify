import { useContext, useState } from 'react';
import { View } from 'react-native';
import { useMutation } from '@apollo/client';
import { Link } from '@react-navigation/native';
import { Button, Input, Layout, Spinner, Text } from '@ui-kitten/components';
import Toast from 'react-native-root-toast';
import * as SecureStore from 'expo-secure-store';

import { AuthContext } from '../contexts/auth';
import { LOGIN_USER } from '../graphql/mutations';

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
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 24, padding: 18 }}
    >
      <Text category="h2" style={{ width: '100%' }}>
        To get started, first enter your username and password
      </Text>

      <Layout style={{ width: '100%', gap: 8 }}>
        <Input
          size="large"
          placeholder="Username"
          value={form.username}
          onChangeText={(value) => setForm((prev) => ({ ...prev, username: value }))}
        />
        <Input
          size="large"
          placeholder="Password"
          secureTextEntry
          value={form.password}
          onChangeText={(value) => setForm((prev) => ({ ...prev, password: value }))}
        />
        <Button
          appearance={loading ? 'outline' : 'filled'}
          disabled={loading}
          onPress={onLogin}
          accessoryLeft={
            loading
              ? (props) => (
                  <View style={[props.style, { justifyContent: 'center', alignItems: 'center' }]}>
                    <Spinner size="small" />
                  </View>
                )
              : undefined
          }
        >
          {!loading ? 'Login' : null}
        </Button>
      </Layout>

      <Text>
        Don&apos;t have an account yet?{' '}
        <Link to={{ screen: 'RegisterStack' }} style={{ fontWeight: 'bold', color: '#1DA1F2' }}>
          Register
        </Link>
      </Text>
    </Layout>
  );
};

export default LoginScreen;
