import React from 'react';
import {
  Text, View, Alert, StyleSheet, TouchableHighlight, RefreshControl, ScrollView, ActivityIndicator,
} from 'react-native';
import { Icon, Card, Input } from 'react-native-elements';
import Globals from '../Globals';
// import Utils from '../Utils';
import Layout from '../components/Layout';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  cardCont: {
    borderRadius: 5,
  },
  arrowIconCont: {
    flex: 1,
    flexGrow: 1,
    flexDirection: 'row-reverse',
  },
  arrowIcon: {

  },
  text: {
    fontWeight: 'bold',
    marginLeft: 10,
    marginRight: 10,
  },
  button: {
    width: 50,
    marginLeft: 10,
  },
});
export default class InstrumentsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      instruments: null,
      profile: null,
      takeDropInstrumentID: null,
      filter: '',
      refreshing: false,
    };
  }

  componentDidMount() {
    this.refresh();
  }

  onTake = (com) => {
    const { onExpiredAuth } = this.props;
    const { instruments, profile, takeDropInstrumentID } = this.state;
    const oldInstrument = instruments.find((ins) => ins._id === takeDropInstrumentID);
    const body = JSON.stringify({
      id: oldInstrument._id,
      name: oldInstrument.name,
      user: profile._id,
      com,
    });
    const myInit = {
      method: 'POST',
      headers: {
        'x-access-token': Globals.TOKEN,
        'Content-type': 'application/json',
      },
      body,
      mode: 'cors',
      cache: 'default',
    };
    window.fetch(`${Globals.APIURL}instruments/update`, myInit).then((res) => {
      res.json().then((data) => {
        if (data.error) {
          if (data.error === 'notAuthenticated') {
            onExpiredAuth();
          }
          return;
        }
        Alert.alert('Succès', 'Instrument emprunté!');
        this.setState({
          takeDropInstrumentID: null,
        });
        this.refresh();
      }).catch((err) => {
        console.log(err);
      });
    }).catch((err) => {
      console.log(err);
    });
  }

  onDrop = (com) => {
    const { onExpiredAuth } = this.props;
    const { instruments, takeDropInstrumentID } = this.state;
    const newInstrument = instruments.find((ins) => ins._id === takeDropInstrumentID);
    const body = JSON.stringify({
      id: newInstrument._id,
      name: newInstrument.name,
      user: null,
      com,
    });
    const myInit = {
      method: 'POST',
      headers: {
        'x-access-token': Globals.TOKEN,
        'Content-type': 'application/json',
      },
      body,
      mode: 'cors',
      cache: 'default',
    };
    window.fetch(`${Globals.APIURL}instruments/update`, myInit).then((res) => {
      res.json().then((data) => {
        if (data.error) {
          if (data.error === 'notAuthenticated') {
            onExpiredAuth();
          }
          return;
        }
        Alert.alert('Succès', 'Instrument deposé!');
        this.setState({
          takeDropInstrumentID: null,
        });
        this.refresh();
      }).catch((err) => {
        console.log(err);
      });
    }).catch((err) => {
      console.log(err);
    });
  }

  refresh=() => {
    this.setState({ instruments: null });
    const { navigation } = this.props;
    const myInit = {
      method: 'GET',
      headers: {
        'x-access-token': Globals.TOKEN,
      },
      mode: 'cors',
      cache: 'default',
    };
    window.fetch(`${Globals.APIURL}instruments`, myInit).then((res) => {
      res.json().then((data) => {
        if (data.error) {
          if (data.error === 'notAuthenticated') {
            navigation.navigate('Auth');
          }
          return;
        }
        const { instruments, profile } = data;
        this.setState({
          instruments: instruments.concat()
            .sort((a, b) => a.name > b.name),
          profile,
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
      instruments, refreshing, profile, filter,
    } = this.state;
    const fInstruments = instruments
      ? instruments.filter((instru) => RegExp(filter, 'i').test(instru.name))
      : null;
    const { navigation } = this.props;
    return (
      <Layout>
        <ScrollView refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={this.refresh} />
        }
        >
          <Input
            inputStyle={{ color: 'white' }}
            value={filter}
            leftIcon={{ type: 'font-awesome', name: 'search', color: 'white' }}
            leftIconContainerStyle={{ marginRight: 10 }}
            onChangeText={(text) => this.setState({ filter: text })}
          />
          {!fInstruments ? <ActivityIndicator size="large" color="#0000ff" /> : fInstruments.map((instru) => (
            <TouchableHighlight
              key={instru._id}
              onPress={() => {
                this.setState({ takeDropInstrumentID: instru._id });
                navigation.navigate('Instrument', {
                  ...instru,
                  owned: instru.user !== null && instru.user._id === profile._id,
                  onTake: this.onTake,
                  onDrop: this.onDrop,
                });
              }}
            >
              <Card
                wrapperStyle={styles.card}
                containerStyle={styles.cardCont}
              >
                <Icon
                  name="circle"
                  type="font-awesome"
                  color={instru.user ? 'red' : 'green'}
                />
                <Text style={styles.text}>
                  {instru.name}
                </Text>
                {!instru.com ? null : (
                  <Icon
                    name="comment"
                    type="font-awesome"
                  />
                )}
                <View style={styles.arrowIconCont}>
                  <Icon
                    style={styles.arrowIcon}
                    type="ionicon"
                    name="ios-arrow-forward"
                  />
                </View>
              </Card>
            </TouchableHighlight>
          ))}
        </ScrollView>
      </Layout>
    );
  }
}
InstrumentsScreen.navigationOptions = {
  title: 'Instruments',
};
