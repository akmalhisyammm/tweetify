import { Image } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../../screens/LoginScreen';
import RegisterScreen from '../../screens/RegisterScreen';

const { Navigator, Screen } = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Navigator
      initialRouteName="LoginStack"
      screenOptions={{
        headerTitleAlign: 'center',
        headerTransparent: true,
        headerTitle: () => (
          <Image
            source={require('../../assets/icon.png')}
            style={{ width: 30, height: 30, resizeMode: 'contain' }}
          />
        ),
      }}
    >
      <Screen name="LoginStack" component={LoginScreen} />
      <Screen name="RegisterStack" component={RegisterScreen} />
    </Navigator>
  );
};

export default AuthStack;
