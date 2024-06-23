import { useContext, useEffect } from 'react';
import { Image, Pressable, RefreshControl, ScrollView, View } from 'react-native';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Avatar, Button, Divider, Layout, Spinner, Text } from '@ui-kitten/components';
import Toast from 'react-native-root-toast';

import { AuthContext } from '../contexts/auth';
import { PostItem } from '../components/molecules';
import { GET_USER } from '../graphql/queries';
import { FOLLOW_USER } from '../graphql/mutations';

const ProfileScreen = ({ navigation, route }) => {
  const { id } = route.params;

  const { me } = useContext(AuthContext);

  const [onFetchUser, { data, loading, error }] = useLazyQuery(GET_USER, {
    variables: { id },
  });

  const [onFollow, { loading: followLoading }] = useMutation(FOLLOW_USER, {
    variables: { userId: id },
    onError: (error) => {
      Toast.show(error.message, { duration: Toast.durations.SHORT });
    },
    refetchQueries: ['GetUser', 'GetMe'],
  });

  useEffect(() => {
    onFetchUser();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: data ? data.getUser.name : undefined,
    });
  }, [navigation, data]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Spinner />
      </View>
    );
  }

  if (error) {
    return <Text>{error.message}</Text>;
  }

  if (!data) {
    return null;
  }

  const user = data.getUser;
  const isFollowed = user.followers.some((follower) => follower._id === me?._id);

  return (
    <Layout style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={onFetchUser} />}
      >
        <Image
          source={user.coverUrl ? { uri: user.coverUrl } : require('../assets/cover.jpg')}
          style={{ width: '100%', height: 180 }}
        />

        <Layout style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 12 }}>
          <Layout>
            <Avatar
              source={user.imgUrl ? { uri: user.imgUrl } : require('../assets/person.png')}
              style={{
                marginTop: -54,
                borderWidth: 3,
                borderColor: 'white',
                width: 80,
                height: 80,
                backgroundColor: 'white',
              }}
            />
            <Text category="h5" style={{ marginTop: 12 }}>
              {user.name}
            </Text>
            <Text category="s1">@{user.username}</Text>
            <Layout style={{ flexDirection: 'row', marginTop: 12 }}>
              <Pressable
                onPress={() =>
                  navigation.navigate('FollowStack', { type: 'Followers', data: user.followers })
                }
                style={{ flexDirection: 'row', alignItems: 'center' }}
              >
                <Text category="s1" style={{ fontWeight: 'bold' }}>
                  {user.followers.length}
                </Text>
                <Text category="s1" style={{ marginLeft: 4 }}>
                  Followers
                </Text>
              </Pressable>
              <Pressable
                onPress={() =>
                  navigation.navigate('FollowStack', { type: 'Following', data: user.followings })
                }
                style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 12 }}
              >
                <Text category="s1" style={{ fontWeight: 'bold' }}>
                  {user.followings.length}
                </Text>
                <Text category="s1" style={{ marginLeft: 4 }}>
                  Following
                </Text>
              </Pressable>
            </Layout>
          </Layout>

          {me?._id !== user._id && (
            <Layout>
              <Button
                status={isFollowed ? 'basic' : 'primary'}
                disabled={followLoading}
                style={{ borderRadius: 50 }}
                onPress={onFollow}
              >
                {isFollowed ? 'Unfollow' : 'Follow'}
              </Button>
            </Layout>
          )}
        </Layout>

        <Divider />

        {user.posts.length ? (
          user.posts.map((post) => (
            <PostItem
              {...post}
              key={post._id}
              onProfilePress={() => navigation.navigate('ProfileStack', { id: post.author._id })}
              onDetailPress={() => navigation.navigate('PostDetailStack', { id: post._id })}
            />
          ))
        ) : (
          <Text
            category="s1"
            style={{ fontWeight: 'bold', textAlign: 'center', marginVertical: 18 }}
          >
            No posts yet
          </Text>
        )}
      </ScrollView>
    </Layout>
  );
};

export default ProfileScreen;
