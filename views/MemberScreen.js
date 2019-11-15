import React from 'react';
import {
  StyleSheet, View, Text, ActivityIndicator,
} from 'react-native';
import {
  Card, Icon,
} from 'react-native-elements';
import Globals from '../Globals';
import Layout from '../components/Layout';

const styles = StyleSheet.create({
  main: {
    color: 'white',
    alignItems: 'center',
    flex: 1,
  },
  cardCont: {
    borderRadius: 5,
    width: '100%',
  },
  card: {
    flexDirection: 'column',
  },
  titleCont: {
    marginBottom: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  bodyCont: {
  },
  userCont: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  icon: {
    marginRight: 10,
  },
  comCont: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginBottom: 10,
  },
  com: {
    backgroundColor: '#ececec',
    borderRadius: 3,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
  },
  confBtnCont: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 10,
  },
});

export default class MemberScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      instruments: null,
    };
  }

  componentDidMount() {
    this.refresh();
  }

  refresh=() => {
    const { navigation } = this.props;
    const {
      _id,
    } = navigation.state.params;
    const myInit = {
      method: 'GET',
      headers: {
        'x-access-token': Globals.TOKEN,
      },
      mode: 'cors',
      cache: 'default',
    };
    window.fetch(`${Globals.APIURL}instruments/${_id}`, myInit).then((res) => {
      res.json().then((data) => {
        if (data.error) {
          if (data.error === 'notAuthenticated') {
            navigation.navigate('Auth');
          }
          return;
        }
        const { instruments } = data;
        this.setState({
          instruments: instruments.concat()
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
    const { navigation } = this.props;
    const { instruments } = this.state;
    const { username } = navigation.state.params;
    return (
      <Layout>
        <View style={styles.main}>
          <Card
            wrapperStyle={styles.card}
            containerStyle={styles.cardCont}
          >

            <View style={styles.titleCont}>
              <Text style={styles.title}>{username}</Text>
            </View>
            {!instruments ? <ActivityIndicator size="large" color="#0000ff" /> : (
              <View style={styles.bodyCont}>
                {instruments.length === 0 ? (
                  <View style={styles.bodyCont}>
                    <View style={styles.comCont}>
                      <Text>Pas d&apos;instrument emprunté</Text>
                    </View>
                  </View>
                ) : (
                  <>
                    <View style={styles.comCont}>
                      <Icon
                        name="guitar-acoustic"
                        type="material-community"
                        containerStyle={styles.icon}
                      />
                      <Text>Instruments empruntés :</Text>
                    </View>
                    {instruments.map((instru) => <Text key={instru._id}>{instru.name}</Text>)}
                  </>
                )}
              </View>
            )}
          </Card>
        </View>
      </Layout>
    );
  }
}

MemberScreen.navigationOptions = {
  title: 'Détails membre',
};
