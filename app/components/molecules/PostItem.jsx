import { useContext, useRef } from 'react';
import { Image, Pressable } from 'react-native';
import { useMutation } from '@apollo/client';
import { Avatar, Button, Icon, Layout, Text } from '@ui-kitten/components';
import Toast from 'react-native-root-toast';

import { AuthContext } from '../../contexts/auth';
import { LIKE_POST } from '../../graphql/mutations';
import { elapsedTime } from '../../utils/dateFormat';

const PostItem = ({
  _id,
  author,
  content,
  imgUrl,
  tags,
  comments,
  likes,
  createdAt,
  onProfilePress,
  onDetailPress,
}) => {
  const { me } = useContext(AuthContext);

  const likeIconRef = useRef();

  const [onLike] = useMutation(LIKE_POST, {
    variables: { postId: _id },
    onCompleted: () => {
      likeIconRef.current.startAnimation();
    },
    onError: (error) => {
      Toast.show(error.message, { duration: Toast.durations.SHORT });
    },
    refetchQueries: ['GetPosts'],
  });

  const isLiked = likes.some((like) => like.username === me?.username);

  return (
    <Layout
      style={{
        paddingHorizontal: 12,
        paddingTop: 10,
        paddingBottom: 1,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
      }}
    >
      <Layout style={{ flexDirection: 'row', gap: 12 }}>
        <Pressable onPress={onProfilePress}>
          <Avatar
            source={author.imgUrl ? { uri: author.imgUrl } : require('../../assets/person.png')}
          />
        </Pressable>
        <Layout style={{ flex: 1, gap: 2 }}>
          <Pressable onPress={onDetailPress}>
            <Layout style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text category="p1" style={{ fontWeight: 'bold' }}>
                {author.name}
              </Text>
              <Text category="s1" appearance="hint">
                @{author.username} &bull; {elapsedTime(isNaN(+createdAt) ? createdAt : +createdAt)}
              </Text>
            </Layout>
            <Text category="p1">{content}</Text>
            {tags.length > 0 ? (
              <Layout style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginVertical: 2 }}>
                {tags.map((tag, index) => (
                  <Text key={index} category="c1" appearance="hint">
                    #{tag}
                  </Text>
                ))}
              </Layout>
            ) : null}
            {imgUrl && (
              <Image
                source={{ uri: imgUrl }}
                style={{
                  width: '100%',
                  height: 200,
                  borderRadius: 12,
                  marginTop: 8,
                }}
              />
            )}
            <Layout style={{ flexDirection: 'row', gap: 4, marginLeft: -8 }}>
              <Button
                size="small"
                appearance="ghost"
                status="basic"
                accessoryLeft={(props) => (
                  <Icon
                    {...props}
                    name="message-circle-outline"
                    style={[props.style, { marginRight: comments.length > 0 && -4 }]}
                  />
                )}
                style={{ paddingHorizontal: 0 }}
              >
                {comments.length}
              </Button>
              <Button
                size="small"
                appearance="ghost"
                status={isLiked ? 'danger' : 'basic'}
                accessoryLeft={(props) => (
                  <Icon
                    {...props}
                    ref={likeIconRef}
                    animation="pulse"
                    name={isLiked ? 'heart' : 'heart-outline'}
                    style={[props.style, { marginRight: likes.length > 0 && -4 }]}
                  />
                )}
                onPress={onLike}
                style={{ paddingHorizontal: 0 }}
              >
                {likes.length}
              </Button>
            </Layout>
          </Pressable>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default PostItem;
