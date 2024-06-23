import { useContext, useEffect, useRef, useState } from 'react';
import { Image, Pressable, RefreshControl, ScrollView } from 'react-native';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Avatar, Button, Divider, Icon, Input, Layout, Spinner, Text } from '@ui-kitten/components';
import Toast from 'react-native-root-toast';

import { AuthContext } from '../contexts/auth';
import { GET_POST } from '../graphql/queries';
import { COMMENT_POST, LIKE_POST } from '../graphql/mutations';
import { elapsedTime, timeTo12H, timeToMediumDate } from '../utils/dateFormat';

const PostDetailScreen = ({ navigation, route }) => {
  const { id } = route.params;

  const [comment, setComment] = useState('');

  const { me } = useContext(AuthContext);

  const likeIconRef = useRef();

  const [onFetchPost, { data, loading, error }] = useLazyQuery(GET_POST, {
    variables: { id },
  });

  const [onLike] = useMutation(LIKE_POST, {
    variables: { postId: id },
    onCompleted: () => {
      likeIconRef.current.startAnimation();
    },
    onError: (error) => {
      Toast.show(error.message, { duration: Toast.durations.SHORT });
    },
    refetchQueries: ['GetPost'],
  });

  const [onComment] = useMutation(COMMENT_POST, {
    variables: { postId: id, content: comment },
    onCompleted: () => {
      setComment('');
    },
    onError: (error) => {
      Toast.show(error.message, { duration: Toast.durations.SHORT });
    },
    refetchQueries: ['GetPost'],
  });

  useEffect(() => {
    onFetchPost();
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

  const post = data.getPost;
  const isLiked = post.likes.some((like) => like.username === me?.username);

  return (
    <Layout style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={onFetchPost} />}
      >
        <Layout style={{ padding: 12 }}>
          <Pressable onPress={() => navigation.navigate('ProfileStack', { id: post.author._id })}>
            <Layout style={{ flexDirection: 'row', paddingVertical: 4 }}>
              <Avatar
                source={
                  post.author.imgUrl ? { uri: post.author.imgUrl } : require('../assets/person.png')
                }
                size="large"
              />
              <Layout style={{ marginLeft: 12 }}>
                <Text category="h6" style={{ fontSize: 16 }}>
                  {post.author.name}
                </Text>
                <Text category="s2" appearance="hint">
                  @{post.author.username}
                </Text>
              </Layout>
            </Layout>
          </Pressable>

          <Layout style={{ paddingVertical: 8, gap: 8 }}>
            <Text category="p1">{post.content}</Text>
            <Layout style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>
              {post.tags.map((tag) => (
                <Text key={tag} category="c1" appearance="hint">
                  #{tag}
                </Text>
              ))}
            </Layout>
            {post.imgUrl && (
              <Image
                source={post.imgUrl ? { uri: post.imgUrl } : require('../assets/person.png')}
                style={{ width: '100%', height: 300, borderRadius: 12 }}
              />
            )}
            <Text category="s2" appearance="hint">
              {timeTo12H(isNaN(+post.createdAt) ? post.createdAt : +post.createdAt)} &bull;{' '}
              {timeToMediumDate(isNaN(+post.createdAt) ? post.createdAt : +post.createdAt)}
            </Text>
          </Layout>

          <Divider />

          <Layout style={{ flexDirection: 'row', gap: 16, paddingVertical: 12 }}>
            <Layout style={{ flexDirection: 'row', gap: 4 }}>
              <Text category="s1" style={{ fontWeight: 'bold' }}>
                {post.comments.length}
              </Text>
              <Text category="s1">Comments</Text>
            </Layout>
            <Layout style={{ flexDirection: 'row', gap: 4 }}>
              <Text category="s1" style={{ fontWeight: 'bold' }}>
                {post.likes.length}
              </Text>
              <Text category="s1">Likes</Text>
            </Layout>
          </Layout>

          <Divider />

          <Layout
            style={{ flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 12 }}
          >
            <Button
              appearance="ghost"
              status="basic"
              accessoryLeft={(props) => (
                <Icon
                  {...props}
                  name="message-circle-outline"
                  style={[props.style, { marginHorizontal: -2, marginVertical: -2 }]}
                />
              )}
            />
            <Button
              appearance="ghost"
              status={isLiked ? 'danger' : 'basic'}
              accessoryLeft={(props) => (
                <Icon
                  {...props}
                  ref={likeIconRef}
                  animation="pulse"
                  name={isLiked ? 'heart' : 'heart-outline'}
                  style={[props.style, { marginHorizontal: -2, marginVertical: -2 }]}
                />
              )}
              onPress={onLike}
            />
          </Layout>

          <Divider />

          {post.comments.length
            ? post.comments.map((comment, index) => (
                <Layout key={index}>
                  <Layout style={{ flexDirection: 'row', gap: 12, paddingVertical: 12 }}>
                    <Pressable
                      onPress={() =>
                        navigation.navigate('ProfileStack', { id: comment.author._id })
                      }
                    >
                      <Avatar
                        source={
                          comment.author?.imgUrl
                            ? { uri: comment.author.imgUrl }
                            : require('../assets/person.png')
                        }
                        size="small"
                      />
                    </Pressable>
                    <Layout style={{ flex: 1 }}>
                      <Layout style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Text category="s1" style={{ fontWeight: 'bold' }}>
                          {comment.author?.name}
                        </Text>
                        <Text category="s1" appearance="hint">
                          @{comment.author?.username} &bull;{' '}
                          {elapsedTime(
                            isNaN(+comment.createdAt) ? comment.createdAt : +comment.createdAt
                          )}
                        </Text>
                      </Layout>
                      <Text category="p1">{comment.content}</Text>
                    </Layout>
                  </Layout>
                  <Divider />
                </Layout>
              ))
            : null}
        </Layout>
      </ScrollView>

      <Divider />

      <Layout
        style={{
          position: 'fixed',
          flexDirection: 'row',
          bottom: 0,
          padding: 12,
          gap: 8,
        }}
      >
        <Input
          size="large"
          placeholder="Add your comment"
          style={{ flexGrow: 1 }}
          value={comment}
          onChangeText={setComment}
        />
        <Button
          accessoryLeft={(props) => <Icon {...props} name="paper-plane-outline" />}
          onPress={onComment}
        />
      </Layout>
    </Layout>
  );
};

export default PostDetailScreen;
