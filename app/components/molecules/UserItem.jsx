import { Pressable } from 'react-native';
import { Avatar, Divider, Layout, Text } from '@ui-kitten/components';

const UserItem = ({ name, username, imgUrl, onPress }) => {
  return (
    <Pressable onPress={onPress}>
      <Layout style={{ flexDirection: 'row', alignItems: 'center', padding: 12 }}>
        <Avatar
          source={imgUrl ? { uri: imgUrl } : require('../../assets/person.png')}
          size="medium"
        />
        <Layout style={{ marginLeft: 12 }}>
          <Text category="s1" style={{ fontWeight: 'bold' }}>
            {name}
          </Text>
          <Text category="s1" appearance="hint">
            @{username}
          </Text>
        </Layout>
      </Layout>
      <Divider />
    </Pressable>
  );
};

export default UserItem;
