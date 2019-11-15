import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Alert } from 'react-native';
import { Icon } from 'react-native-elements';
import SignInScreen from './views/SignInScreen';
import SignOutScreen from './views/SignOutScreen';
import HomeScreen from './views/HomeScreen';
import InstrumentsScreen from './views/InstrumentsScreen';
import InstrumentScreen from './views/InstrumentScreen';
import MembersScreen from './views/MembersScreen';
import MemberScreen from './views/MemberScreen';

const TabNavigator = createBottomTabNavigator(
  {
    Home: createStackNavigator({
      Home: HomeScreen,
    }, {
      navigationOptions: {
        tabBarLabel: 'Home',
        tabBarIcon: ({ tintColor }) => (
          <Icon type="ionicon" name="md-home" color={tintColor} size={25} />
        ),
      },
    }),
    Instruments: createStackNavigator({
      Instruments: InstrumentsScreen,
      Instrument: InstrumentScreen,
    }, {
      navigationOptions: {
        tabBarLabel: 'Instruments',
        tabBarIcon: ({ tintColor }) => (
          <Icon type="material-community" name="guitar-acoustic" color={tintColor} size={25} />
        ),
      },
    }),
    Members: createStackNavigator({
      Members: MembersScreen,
      Member: MemberScreen,
    }, {
      navigationOptions: {
        tabBarLabel: 'Membres',
        tabBarIcon: ({ tintColor }) => (
          <Icon type="font-awesome" name="users" color={tintColor} size={20} />
        ),
      },
    }),
    SignOut: createStackNavigator({
      SignOut: SignOutScreen,
    }, {
      navigationOptions: {
        tabBarOnPress: ({ navigation }) => {
          Alert.alert('Deconnexion', 'Voulez-vous vraiment vous déconnecter?', [
            {
              text: 'Annuler',
              style: 'cancel',
            },
            { text: 'OK', onPress: () => navigation.navigate('SignOut') },
          ]);
        },
        tabBarLabel: 'SignOut',
        tabBarIcon: ({ tintColor }) => (
          <Icon type="font-awesome" name="sign-out" color={tintColor} size={20} />
        ),
      },
    }),
  },
  {
    tabBarOptions: {
      activeTintColor: 'blue',
      inactiveTintColor: 'gray',
    },
  },
);
export default createAppContainer(
  createSwitchNavigator({
    Auth: createStackNavigator({
      SignIn: SignInScreen,
    }, { initialRouteName: 'SignIn' }),
    App: TabNavigator
    ,
  }),
);
