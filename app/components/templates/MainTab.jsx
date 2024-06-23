import { useContext } from 'react';
import { Image, Pressable } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Avatar, Icon, Input } from '@ui-kitten/components';

import { AuthContext } from '../../contexts/auth';
import SearchScreen from '../../screens/SearchScreen';
import HomeScreen from '../../screens/HomeScreen';

const { Navigator, Screen } = createBottomTabNavigator();

const MainTab = () => {
  const { me, onLogout } = useContext(AuthContext);

  return (
    <Navigator
      initialRouteName="HomeTab"
      screenOptions={({ navigation, route }) => ({
        headerTitleAlign: 'center',
        headerLeftContainerStyle: { paddingLeft: 16 },
        headerRightContainerStyle: { paddingRight: 16 },
        tabBarShowLabel: false,
        headerLeft: () => (
          <Pressable onPress={navigation.toggleDrawer}>
            <Avatar
              source={me?.imgUrl ? { uri: me?.imgUrl } : require('../../assets/person.png')}
              size="small"
            />
          </Pressable>
        ),
        headerRight: () => (
          <Pressable onPress={onLogout}>
            <Icon name="log-out" fill="#FF3D71" style={{ width: 24, height: 24 }} />
          </Pressable>
        ),
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'SearchTab') {
            iconName = focused ? 'search' : 'search-outline';
          }

          return <Icon name={iconName} fill={color} style={{ width: size, height: size }} />;
        },
      })}
    >
      <Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          title: 'Home',
          headerTitle: () => (
            <Image
              source={require('../../assets/icon.png')}
              style={{ width: 30, height: 30, resizeMode: 'contain' }}
            />
          ),
        }}
      />
      <Screen
        name="SearchTab"
        component={SearchScreen}
        options={{
          title: 'Search',
          headerTitleContainerStyle: { width: '100%' },
          headerTitle: () => (
            <Input placeholder="Search people" style={{ width: '100%', borderRadius: 50 }} />
          ),
        }}
      />
    </Navigator>
  );
};

export default MainTab;
