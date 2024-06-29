import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Link } from '@react-navigation/native';
import { Layout, Text } from '@ui-kitten/components';
import Toast from 'react-native-root-toast';

import { REGISTER_USER } from '../graphql/mutations';
import { RegisterForm } from '../components/organisms';

const RegisterScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    name: '',
    username: '',
    imgUrl: '',
    coverUrl: '',
    email: '',
    password: '',
  });

  const [onRegister, { loading }] = useMutation(REGISTER_USER, {
    variables: { payload: form },
    onCompleted: async () => {
      navigation.navigate('LoginStack');
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
        See what's happening in the world right now
      </Text>

      <RegisterForm
        loading={loading}
        form={form}
        setForm={setForm}
        onRegister={onRegister}
      />

      <Text>
        Have an account already?{' '}
        <Link
          to={{ screen: 'LoginStack' }}
          style={{ fontWeight: 'bold', color: '#1DA1F2' }}
        >
          Log in
        </Link>
      </Text>
    </Layout>
  );
};

export default RegisterScreen;
