import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';

const THUMB_RADIUS = 12;

const Thumb = () => <View style={styles.root} />;

const styles = StyleSheet.create({
  root: {
    width: THUMB_RADIUS * 2,
    height: THUMB_RADIUS * 2,
    borderRadius: THUMB_RADIUS,
    borderWidth: 1,
    borderColor: '#63738e',
    backgroundColor: '#fff',
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: -1},
    shadowOpacity: 0.16,
    shadowRadius: 6,
  },
});

export default memo(Thumb);
