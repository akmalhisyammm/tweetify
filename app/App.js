import 'react-native-gesture-handler';

import { useContext } from 'react';
import { StatusBar } from 'react-native';
import { RootSiblingParent } from 'react-native-root-siblings';
import { ApolloProvider } from '@apollo/client';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import * as eva from '@eva-design/eva';

import { AuthContext, AuthProvider } from './contexts/auth';
import { AuthStack, MainStack } from './components/templates';
import client from './config/apollo';
import theme from './theme.json';

const NavigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1DA1F2',
  },
};

const Navigation = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return !isAuthenticated ? <AuthStack /> : <MainStack />;
};

const App = () => {
  return (
    <RootSiblingParent>
      <ApplicationProvider {...eva} theme={{ ...eva.light, ...theme }}>
        <ApolloProvider client={client}>
          <AuthProvider>
            <IconRegistry icons={EvaIconsPack} />
            <StatusBar backgroundColor="transparent" />
            <NavigationContainer theme={NavigationTheme}>
              <Navigation />
            </NavigationContainer>
          </AuthProvider>
        </ApolloProvider>
      </ApplicationProvider>
    </RootSiblingParent>
  );
};

export default App;
