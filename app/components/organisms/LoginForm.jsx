import { View } from 'react-native';
import { Button, Input, Layout, Spinner } from '@ui-kitten/components';

const LoginForm = ({ loading, form, setForm, onLogin }) => {
  return (
    <Layout style={{ width: '100%', gap: 8 }}>
      <Input
        size="large"
        placeholder="Username"
        value={form.username}
        onChangeText={(value) =>
          setForm((prev) => ({ ...prev, username: value }))
        }
      />
      <Input
        size="large"
        placeholder="Password"
        secureTextEntry
        value={form.password}
        onChangeText={(value) =>
          setForm((prev) => ({ ...prev, password: value }))
        }
      />
      <Button
        appearance={loading ? 'outline' : 'filled'}
        disabled={loading}
        onPress={onLogin}
        accessoryLeft={
          loading
            ? (props) => (
                <View
                  style={[
                    props.style,
                    { justifyContent: 'center', alignItems: 'center' },
                  ]}
                >
                  <Spinner size="small" />
                </View>
              )
            : undefined
        }
      >
        {!loading ? 'Login' : null}
      </Button>
    </Layout>
  );
};

export default LoginForm;
