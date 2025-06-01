import React from 'react';

import i18next from '@config/i18next';
import { NavigationContainer } from '@react-navigation/native';

import { RequestProvider } from './src/requests/RequestContext';
import { AuthStackNavigation } from './src/routes/AuthNavigator';

function App(): React.JSX.Element {
  i18next.t;
  return (
    <RequestProvider>
      <NavigationContainer>
        <AuthStackNavigation />
      </NavigationContainer>
    </RequestProvider>
  );
}

export default App;
