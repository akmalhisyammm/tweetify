import { View } from 'react-native';
import { Button, Input, Layout, Spinner } from '@ui-kitten/components';

const RegisterForm = ({ loading, form, setForm, onRegister }) => {
  return (
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
        onChangeText={(value) =>
          setForm((prev) => ({ ...prev, username: value }))
        }
      />
      <Input
        size="large"
        placeholder="Image URL (optional)"
        value={form.imgUrl}
        onChangeText={(value) =>
          setForm((prev) => ({ ...prev, imgUrl: value }))
        }
      />
      <Input
        size="large"
        placeholder="Cover URL (optional)"
        value={form.coverUrl}
        onChangeText={(value) =>
          setForm((prev) => ({ ...prev, coverUrl: value }))
        }
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
        onChangeText={(value) =>
          setForm((prev) => ({ ...prev, password: value }))
        }
      />
      <Button
        appearance={loading ? 'outline' : 'filled'}
        disabled={loading}
        onPress={onRegister}
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
        {!loading ? 'Register' : null}
      </Button>
    </Layout>
  );
};

export default RegisterForm;
