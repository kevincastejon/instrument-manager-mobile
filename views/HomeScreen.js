import React from 'react';
import {
  Text, StyleSheet, View, Alert, ActivityIndicator, RefreshControl, ScrollView,
} from 'react-native';
import {
  Icon,
} from 'react-native-elements';
import Layout from '../components/Layout';
import Globals from '../Globals';
import Utils from '../Utils';

const styles = StyleSheet.create({
  main: { color: 'white', alignItems: 'center' },
  title: { color: 'white', marginTop: 20 },
  instruCont: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  bodyCont: {
    color: 'white',
  },
});

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: null,
      refreshing: false,
    };
  }

  componentDidMount() {
    this.refresh();
  }

  refresh=() => {
    this.setState({ profile: null });
    const { navigation } = this.props;
    const myInit = {
      method: 'GET',
      headers: {
        'x-access-token': Globals.TOKEN,
      },
      mode: 'cors',
      cache: 'default',
    };
    window.fetch(`${Globals.APIURL}users/self`, myInit).then((res) => {
      res.json().then((data) => {
        if (data.error) {
          if (data.error === 'notAuthenticated') {
            Utils.deleteCookie('token');
            Globals.TOKEN = null;
            navigation.navigate('Auth');
          }
          return;
        }
        const { profile } = data;
        this.setState({ profile });
      }).catch((err) => {
        Alert.alert('Erreur', err.message);
      });
    }).catch((err) => {
      Alert.alert('Erreur', err.message);
    });
  }

  render() {
    const { profile, refreshing } = this.state;
    return (
      <Layout>
        <ScrollView
          contentContainerStyle={styles.main}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={this.refresh} />
        }
        >
          {!profile ? <ActivityIndicator size="large" color="#0000ff" /> : (
            <>
              <Text style={styles.title}>
Bienvenue
                <Text style={{ fontWeight: 'bold' }}>{` ${profile.username}`}</Text>
              </Text>
              <View style={styles.bodyCont}>
                {profile.instruments.length === 0 ? (
                  <View style={styles.bodyCont}>
                    <View style={styles.comCont}>
                      <Text style={styles.title}>Pas d&apos;instrument emprunté</Text>
                    </View>
                  </View>
                ) : (
                  <>
                    <View style={styles.instruCont}>
                      <Icon
                        name="guitar-acoustic"
                        type="material-community"
                        containerStyle={styles.icon}
                        color="white"
                      />
                      <Text style={styles.title}>Instruments empruntés :</Text>
                    </View>
                    {profile.instruments
                      .map((instru) => (
                        <Text
                          style={styles.title}
                          key={instru._id}
                        >
                          {`- ${instru.name}`}
                        </Text>
                      ))}
                  </>
                )}
              </View>
            </>
          )}
        </ScrollView>
      </Layout>
    );
  }
}

HomeScreen.navigationOptions = {
  title: 'Accueil',
};
