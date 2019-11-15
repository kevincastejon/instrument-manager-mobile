import React from 'react';
import {
  Text, StyleSheet, View,
} from 'react-native';
import Layout from '../components/Layout';
import Utils from '../Utils';

const styles = StyleSheet.create({
  main: { color: 'white' },
  title: { color: 'white' },
  input: { backgroundColor: 'white', marginBottom: 30, height: 50 },
  picker: { backgroundColor: 'white' },
});

export default class SignOutScreen extends React.Component {
  async componentDidMount() {
    const { navigation } = this.props;
    await Utils.deleteCookie('token');
    navigation.navigate('Auth');
  }

  render() {
    return (
      <Layout>
        <View style={styles.main}>
          <Text>Deconnexion</Text>
        </View>
      </Layout>
    );
  }
}
SignOutScreen.navigationOptions = {
  title: 'Connexion',
};
