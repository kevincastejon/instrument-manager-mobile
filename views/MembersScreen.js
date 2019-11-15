import React from 'react';
import {
  Text, View, StyleSheet, TouchableHighlight, RefreshControl, ScrollView, ActivityIndicator,
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
export default class MemberScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: null,
      filter: '',
      refreshing: false,
    };
  }

  componentDidMount() {
    this.refresh();
  }

  refresh=() => {
    this.setState({ users: null });
    const { navigation } = this.props;
    const myInit = {
      method: 'GET',
      headers: {
        'x-access-token': Globals.TOKEN,
      },
      mode: 'cors',
      cache: 'default',
    };
    window.fetch(`${Globals.APIURL}users`, myInit).then((res) => {
      res.json().then((data) => {
        if (data.error) {
          if (data.error === 'notAuthenticated') {
            navigation.navigate('Auth');
          }
          return;
        }
        const { users } = data;
        this.setState({
          users: users.concat()
            .sort((a, b) => a.username > b.username),
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
      users, refreshing, filter,
    } = this.state;
    const fUsers = users
      ? users.filter((user) => RegExp(filter, 'i').test(user.username))
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
          {!fUsers ? <ActivityIndicator size="large" color="#0000ff" /> : fUsers.map((user) => (
            <TouchableHighlight
              key={user._id}
              onPress={() => {
                navigation.navigate('Member', {
                  ...user,
                });
              }}
            >
              <Card
                wrapperStyle={styles.card}
                containerStyle={styles.cardCont}
              >
                <Text style={styles.text}>
                  {user.username}
                </Text>
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
MemberScreen.navigationOptions = {
  title: 'Members',
};
