import React from 'react';
import {SafeAreaView} from 'react-native';
import Offers from './src/components/Offers/Offers';

export const APP_URL = 'https://www.lider-bet.com/api';
export const STATIC_URL = 'https://staticdata.lider-bet.com/images';

function App(): Element {
  return (
    <SafeAreaView>
      <Offers />
    </SafeAreaView>
  );
}

export default App;
