import React from 'react';
import {
  View, Image, StyleSheet,
} from 'react-native';
import logo from '../assets/logo.png';

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: 'black',
  },
  logo: {
    flex: 1,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  body: {
    flex: 10,
    marginLeft: 20,
    marginRight: 20,
  },
});

export default function Layout(props) {
  const { children } = props;
  return (
    <View style={styles.main}>
      <Image style={styles.logo} source={logo} />
      <View style={styles.body}>
        {children}
      </View>
    </View>
  );
}
