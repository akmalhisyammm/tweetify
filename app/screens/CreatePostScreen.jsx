import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useMutation } from '@apollo/client';
import { Button, Input, Layout, Spinner, Text } from '@ui-kitten/components';
import Toast from 'react-native-root-toast';

import { ADD_POST } from '../graphql/mutations';

const CreatePostScreen = ({ navigation }) => {
  const [form, setForm] = useState({ content: '', imgUrl: '', tags: '' });

  const [onPost, { loading }] = useMutation(ADD_POST, {
    variables: {
      payload: {
        ...form,
        tags: form.tags ? form.tags.split(',').map((tag) => tag.trim()) : [],
      },
    },
    onCompleted: () => {
      navigation.goBack();
    },
    onError: (error) => {
      Toast.show(error.message, { duration: Toast.durations.SHORT });
    },
    refetchQueries: ['GetPosts', 'GetMe'],
  });

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          size="small"
          appearance={loading ? 'ghost' : 'filled'}
          disabled={loading}
          accessoryLeft={
            loading
              ? (props) => (
                  <View style={[props.style, { justifyContent: 'center', alignItems: 'center' }]}>
                    <Spinner size="small" />
                  </View>
                )
              : undefined
          }
          onPress={onPost}
          style={{ borderRadius: 50 }}
        >
          {!loading ? 'Post' : null}
        </Button>
      ),
    });
  }, [navigation, loading]);

  return (
    <Layout style={{ flex: 1, gap: 24, paddingHorizontal: 12, paddingVertical: 24 }}>
      <Text category="h2" style={{ width: '100%' }}>
        Tweet your thoughts
      </Text>
      <Layout style={{ width: '100%', gap: 18 }}>
        <Input
          label="Content"
          size="large"
          placeholder="What's on your mind?"
          caption="Share your thoughts with the world."
          multiline
          numberOfLines={10}
          value={form.content}
          onChangeText={(value) => setForm((prev) => ({ ...prev, content: value }))}
        />
        <Input
          label="Image URL (optional)"
          size="large"
          placeholder="https://example.com/image.png"
          caption="URL of the image you want to attach."
          value={form.imgUrl}
          onChangeText={(value) => setForm((prev) => ({ ...prev, imgUrl: value }))}
        />
        <Input
          label="Tags (optional)"
          size="large"
          placeholder="music, coding, gaming"
          caption="Tags to categorize your post, separated by commas."
          value={form.tags}
          onChangeText={(value) => setForm((prev) => ({ ...prev, tags: value }))}
        />
      </Layout>
    </Layout>
  );
};

export default CreatePostScreen;
