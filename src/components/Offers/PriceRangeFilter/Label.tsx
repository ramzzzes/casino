import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';

interface LabelProps {
  text: number;
}

const Label: React.FC<LabelProps> = ({text, ...restProps}) => (
  <View style={styles.root} {...restProps}>
    <Text style={styles.text}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 8,
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 16,
    color: 'grey',
  },
});

export default memo(Label);
