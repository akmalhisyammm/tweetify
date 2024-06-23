import { useState } from 'react';
import { View } from 'react-native';
import { useMutation } from '@apollo/client';
import { Link } from '@react-navigation/native';
import { Button, Input, Layout, Spinner, Text } from '@ui-kitten/components';
import Toast from 'react-native-root-toast';

import { REGISTER_USER } from '../graphql/mutations';

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
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 24, padding: 18 }}
    >
      <Text category="h2" style={{ width: '100%' }}>
        See what's happening in the world right now
      </Text>

      <Layout style={{ width: '100%', gap: 8 }}>
        <Input
          size="large"
          placeholder="Name (optional)"
          value={form.name}
          onChangeText={(value) => setForm((prev) => ({ ...prev, name: value }))}
        />
        <Input
          size="large"
          placeholder="Username"
          value={form.username}
          onChangeText={(value) => setForm((prev) => ({ ...prev, username: value }))}
        />
        <Input
          size="large"
          placeholder="Image URL (optional)"
          value={form.imgUrl}
          onChangeText={(value) => setForm((prev) => ({ ...prev, imgUrl: value }))}
        />
        <Input
          size="large"
          placeholder="Cover URL (optional)"
          value={form.coverUrl}
          onChangeText={(value) => setForm((prev) => ({ ...prev, coverUrl: value }))}
        />
        <Input
          size="large"
          placeholder="Email"
          value={form.email}
          onChangeText={(value) => setForm((prev) => ({ ...prev, email: value }))}
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
          onPress={onRegister}
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
          {!loading ? 'Register' : null}
        </Button>
      </Layout>

      <Text>
        Have an account already?{' '}
        <Link to={{ screen: 'LoginStack' }} style={{ fontWeight: 'bold', color: '#1DA1F2' }}>
          Log in
        </Link>
      </Text>
    </Layout>
  );
};

export default RegisterScreen;
