import { useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { Input, Layout, Spinner, Text } from '@ui-kitten/components';

import { UserItem } from '../components/molecules';
import { SEARCH_USERS } from '../graphql/queries';

const SearchScreen = ({ navigation }) => {
  const [onSearch, { data, loading, error }] = useLazyQuery(SEARCH_USERS);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Input
          placeholder="Search people"
          style={{ width: '100%', borderRadius: 50 }}
          onChangeText={(value) => onSearch({ variables: { keyword: value } })}
        />
      ),
    });
  }, [navigation]);

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

  const users = data?.searchUser || [];

  return (
    <Layout style={{ flex: 1 }}>
      {users.length ? (
        users.map((user) => (
          <UserItem
            key={user._id}
            {...user}
            onPress={() => navigation.navigate('ProfileStack', { id: user._id })}
          />
        ))
      ) : (
        <Text category="s1" style={{ fontWeight: 'bold', textAlign: 'center', marginVertical: 18 }}>
          Try searching for people by name or username
        </Text>
      )}
    </Layout>
  );
};

export default SearchScreen;
