import React from 'react';
import {
  StyleSheet, View, Text,
} from 'react-native';
import {
  Card, Icon, Button, Input,
} from 'react-native-elements';
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

export default class InstrumentScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: null,
      newCom: '',
    };
  }

  render() {
    const { navigation } = this.props;
    const { editing, newCom } = this.state;
    const {
      name, com, user, owned, onTake, onDrop,
    } = navigation.state.params;
    return (
      <Layout>
        <View style={styles.main}>
          <Card
            wrapperStyle={styles.card}
            containerStyle={styles.cardCont}
          >
            {editing
              ? (
                <>
                  <View style={styles.titleCont}>
                    <Text style={styles.title}>{(owned ? 'Déposer ' : 'Emprunter ') + name}</Text>
                  </View>
                  <View style={styles.bodyCont}>
                    <View style={styles.comCont}>
                      <Icon
                        name="comment"
                        type="font-awesome"
                        containerStyle={styles.icon}
                      />
                      <Text>Commentaire (optionnel) :</Text>
                    </View>
                    <Input placeholder="Taper votre commentaire" value={newCom} onChangeText={(text) => this.setState({ newCom: text })} />
                    <View style={styles.confBtnCont}>
                      <Button
                        title="Annuler"
                        onPress={() => {
                          navigation.goBack();
                        }}
                      />
                      <Button
                        title="OK"
                        onPress={() => {
                          if (owned) {
                            onDrop(newCom);
                            navigation.goBack();
                          } else {
                            onTake(newCom);
                            navigation.goBack();
                          }
                        }}
                      />
                    </View>
                  </View>
                </>
              )
              : (
                <>
                  <View style={styles.titleCont}>
                    <Text style={styles.title}>{name}</Text>
                  </View>
                  <View style={styles.bodyCont}>
                    <View style={styles.userCont}>
                      <Icon
                        name="circle"
                        type="font-awesome"
                        color={user ? 'red' : 'green'}
                        containerStyle={styles.icon}
                      />
                      {!user ? (
                        <Text>
                  Disponible
                        </Text>
                      )
                        : (
                          <Text>
                  Emprunté par
                            {' '}
                            <Text style={{ fontWeight: 'bold' }}>{user.username}</Text>
                          </Text>
                        )}
                    </View>
                    {!com ? null : (
                      <View style={styles.comCont}>
                        <Icon
                          name="comment"
                          type="font-awesome"
                          containerStyle={styles.icon}
                        />
                        <Text style={styles.com}>{com}</Text>
                      </View>
                    )}
                    <Button
                      icon={{
                        name: !owned ? 'upload' : 'download',
                        type: 'antdesign',
                        size: 15,
                        color: 'white',
                      }}
                      title={!owned ? 'Emprunter l\'instrument' : 'Déposer l\'instrument'}
                      onPress={() => {
                        this.setState({ editing: true });
                      }}
                    />
                  </View>
                </>
              )}
          </Card>
        </View>
      </Layout>
    );
  }
}

InstrumentScreen.navigationOptions = {
  title: 'Détails instrument',
};
