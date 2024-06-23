import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from '@ui-kitten/components';

import MainDrawer from './MainDrawer';
import PostDetailScreen from '../../screens/PostDetailScreen';
import CreatePostScreen from '../../screens/CreatePostScreen';
import FollowScreen from '../../screens/FollowScreen';
import ProfileScreen from '../../screens/ProfileScreen';

const { Navigator, Group, Screen } = createNativeStackNavigator();

const MainStack = () => {
  return (
    <Navigator initialRouteName="HomeStack">
      <Group>
        <Screen
          name="HomeStack"
          component={MainDrawer}
          options={{ title: 'Home', headerShown: false }}
        />
        <Screen name="PostDetailStack" component={PostDetailScreen} options={{ title: 'Post' }} />
        <Screen
          name="CreatePostStack"
          component={CreatePostScreen}
          options={{
            title: 'Tweet',
            headerTitle: '',
            headerRight: () => (
              <Button size="small" style={{ borderRadius: 50 }}>
                Post
              </Button>
            ),
          }}
        />
        <Screen
          name="ProfileStack"
          component={ProfileScreen}
          options={{
            title: 'Profile',
            headerTransparent: true,
            headerTintColor: 'white',
          }}
        />
      </Group>
      <Group screenOptions={{ presentation: 'modal' }}>
        <Screen name="FollowStack" component={FollowScreen} options={{ title: 'Follow' }} />
      </Group>
    </Navigator>
  );
};

export default MainStack;
