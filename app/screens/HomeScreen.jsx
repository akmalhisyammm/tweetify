import { useEffect } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { useLazyQuery } from '@apollo/client';
import { Layout, Spinner, Text } from '@ui-kitten/components';

import { GET_POSTS } from '../graphql/queries';
import { PostItem } from '../components/molecules';
import { FloatingButton } from '../components/atoms';

const HomeScreen = ({ navigation }) => {
  const [onFetchPosts, { data, loading, error }] = useLazyQuery(GET_POSTS);

  useEffect(() => {
    onFetchPosts();
  }, []);

  if (loading) {
    return (
      <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Spinner />
      </Layout>
    );
  }

  if (error) {
    return <Text>{error.message}</Text>;
  }

  if (!data) {
    return null;
  }

  const posts = data.getPosts;

  return (
    <Layout style={{ flex: 1 }}>
      <FloatingButton
        iconName="plus-outline"
        onPress={() => navigation.navigate('CreatePostStack')}
      />

      <FlatList
        refreshControl={<RefreshControl refreshing={loading} onRefresh={onFetchPosts} />}
        data={posts}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <PostItem
            {...item}
            onProfilePress={() => navigation.navigate('ProfileStack', { id: item.author._id })}
            onDetailPress={() => navigation.navigate('PostDetailStack', { id: item._id })}
          />
        )}
      />
    </Layout>
  );
};

export default HomeScreen;
