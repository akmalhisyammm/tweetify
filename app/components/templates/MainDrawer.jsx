import { useContext } from 'react';
import { Pressable } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { Avatar, Button, Icon, Layout, Text } from '@ui-kitten/components';

import { AuthContext } from '../../contexts/auth';
import MainTab from './MainTab';

const { Navigator, Screen } = createDrawerNavigator();

const MainDrawer = () => {
  const { me, onLogout } = useContext(AuthContext);

  return (
    <Navigator
      initialRouteName="HomeDrawer"
      screenOptions={{
        headerLeftContainerStyle: { paddingLeft: 12 },
        headerRightContainerStyle: { paddingRight: 12 },
      }}
      drawerContent={(props) => (
        <DrawerContentScrollView {...props}>
          <Layout style={{ padding: 20, gap: 12 }}>
            <Pressable onPress={() => props.navigation.navigate('ProfileStack', { id: me?._id })}>
              <Avatar
                source={me?.imgUrl ? { uri: me?.imgUrl } : require('../../assets/person.png')}
              />
            </Pressable>
            <Pressable onPress={() => props.navigation.navigate('ProfileStack', { id: me?._id })}>
              <Layout>
                <Text category="h6">{me?.name}</Text>
                <Text category="s1">@{me?.username}</Text>
              </Layout>
            </Pressable>
            <Layout style={{ flexDirection: 'row' }}>
              <Pressable
                onPress={() =>
                  props.navigation.navigate('FollowStack', {
                    type: 'Followers',
                    data: me?.followers,
                  })
                }
                style={{ flexDirection: 'row', alignItems: 'center' }}
              >
                <Text category="s1" style={{ fontWeight: 'bold' }}>
                  {me?.followers.length}
                </Text>
                <Text category="s1" style={{ marginLeft: 4 }}>
                  Followers
                </Text>
              </Pressable>
              <Pressable
                onPress={() =>
                  props.navigation.navigate('FollowStack', {
                    type: 'Following',
                    data: me?.followings,
                  })
                }
                style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 12 }}
              >
                <Text category="s1" style={{ fontWeight: 'bold' }}>
                  {me?.followings.length}
                </Text>
                <Text category="s1" style={{ marginLeft: 4 }}>
                  Following
                </Text>
              </Pressable>
            </Layout>
          </Layout>

          <Layout style={{ borderTopWidth: 1, borderTopColor: '#f0f0f0' }}>
            <Button
              size="large"
              status="control"
              accessoryLeft={(props) => <Icon {...props} name="person-outline" />}
              onPress={() => props.navigation.navigate('ProfileStack', { id: me?._id })}
              style={{ justifyContent: 'start' }}
            >
              Profile
            </Button>
            <Button
              size="large"
              status="danger"
              appearance="ghost"
              accessoryLeft={(props) => <Icon {...props} name="log-out-outline" />}
              onPress={onLogout}
              style={{ justifyContent: 'start' }}
            >
              Logout
            </Button>
          </Layout>
        </DrawerContentScrollView>
      )}
    >
      <Screen
        name="HomeDrawer"
        component={MainTab}
        options={{
          title: 'Home',
          headerShown: false,
          drawerIcon: ({ focused, color, size }) => (
            <Icon
              name={focused ? 'home' : 'home-outline'}
              fill={color}
              style={{ width: size, height: size }}
            />
          ),
        }}
      />
    </Navigator>
  );
};

export default MainDrawer;
