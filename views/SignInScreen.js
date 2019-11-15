import React from 'react';
import {
  Text, ScrollView, StyleSheet, Picker, Alert, RefreshControl, ActivityIndicator,
} from 'react-native';
import { Input, Button } from 'react-native-elements';
import Layout from '../components/Layout';
import Globals from '../Globals';
import Utils from '../Utils';

const styles = StyleSheet.create({
  main: { color: 'white' },
  title: { color: 'white' },
  input: { backgroundColor: 'white', marginBottom: 30, height: 50 },
  picker: { backgroundColor: 'white' },
});

export default class SignInScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      users: null,
      refreshing: false,
    };
  }

  async componentDidMount() {
    const { navigation } = this.props;
    // await Utils.deleteCookie('token');
    Globals.TOKEN = await Utils.getCookie('token');
    if (Globals.TOKEN) {
      navigation.navigate('App');
    } else {
      this.refresh();
    }
  }

  authenticate = (username, password) => {
    const myHeaders = { 'Content-type': 'application/json' };
    const myInit = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({
        username,
        password,
      }),
      mode: 'cors',
      cache: 'default',
    };
    fetch(`${Globals.APIURL}signin`, myInit)
      .then((res) => {
        res.json().then((data) => {
          if (data.token) {
            this.onAuthenticated(data.token);
          } else {
            Alert.alert('Erreur', 'Mauvais mot de passe');
          }
        });
      }).catch(() => {
        Alert.alert('Erreur', 'Erreur inconnue');
      });
  }

  onAuthenticated = (token) => {
    const { navigation } = this.props;
    Globals.TOKEN = token;
    Utils.setCookie('token', token);
    navigation.navigate('App');
  }

  refresh() {
    const myInit = {
      method: 'GET',
      headers: {
        'x-access-token': Globals.TOKEN,
      },
      mode: 'cors',
      cache: 'default',
    };
    fetch(`${Globals.APIURL}users`, myInit).then((res) => {
      res.json().then((data) => {
        const { users } = data;
        const mappedUsers = users.map((usr) => usr.username);
        this.setState({
          users: mappedUsers
            .sort((a, b) => a > b),
          username: mappedUsers[0],
        });
      }).catch((err) => {
        console.log(err);
      });
    }).catch((err) => {
      console.log(err);
    });
  }

  render() {
    const {
      users, username, password, refreshing,
    } = this.state;
    return (
      <Layout>
        <ScrollView refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={this.refresh} />
      }
        >
          {!users ? <ActivityIndicator size="large" color="#0000ff" />
            : (
              <>
                <Text style={styles.title}>Utilisateur :</Text>
                <Picker
                  selectedValue={username}
                  style={styles.picker}
                  onValueChange={(pickedUsername) => this.setState({ username: pickedUsername })}
                >
                  {users.map((user) => <Picker.Item key={user} label={user} value={user} />)}
                </Picker>
                <Text style={styles.title}>Password :</Text>
                <Input
                  autoCapitalize="none"
                  leftIconContainerStyle={{ marginRight: 10 }}
                  leftIcon={{ type: 'font-awesome', name: 'lock' }}
                  secureTextEntry
                  autoCompleteType="password"
                  textContentType="password"
                  placeholder="mot_de_passe"
                  containerStyle={styles.input}
                  onChangeText={(text) => this.setState({ password: text })}
                  value={password}
                />
                <Button
                  icon={{
                    name: 'login',
                    type: 'entypo',
                    size: 15,
                    color: 'white',
                  }}
                  style={styles.button}
                  title="Se connecter"
                  onPress={() => this.authenticate(username, password)}
                />
              </>
            )}
        </ScrollView>
      </Layout>
    );
  }
}
SignInScreen.navigationOptions = {
  title: 'Connexion',
};
