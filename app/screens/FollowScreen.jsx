import { useEffect } from 'react';
import { Layout, Text } from '@ui-kitten/components';

import { UserItem } from '../components/molecules';

const FollowScreen = ({ navigation, route }) => {
  const { type, data } = route.params;

  useEffect(() => {
    navigation.setOptions({
      title: type,
    });
  }, [navigation, type]);

  return (
    <Layout style={{ flex: 1 }}>
      {data.length ? (
        data.map((user) => (
          <UserItem
            key={user._id}
            {...user}
            onPress={() => navigation.navigate('ProfileStack', { id: user._id })}
          />
        ))
      ) : (
        <Text category="s1" style={{ textAlign: 'center', padding: 16, fontWeight: 'bold' }}>
          No {type.toLowerCase()} found
        </Text>
      )}
    </Layout>
  );
};

export default FollowScreen;
