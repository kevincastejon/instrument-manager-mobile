import { AsyncStorage } from 'react-native';

export default class Utils {
  static deleteCookie = async (name) => {
    try {
      await AsyncStorage.removeItem(name);
    } catch (error) {
      console.log(error);
    }
  };

  static setCookie = async (name, value) => {
    try {
      await AsyncStorage.setItem(name, value);
    } catch (error) {
      console.log(error);
    }
  };

  static getCookie = async (name) => {
    try {
      const value = await AsyncStorage.getItem(name);
      if (value !== null) {
        return (value);
      }
      return null;
    } catch (error) {
      return (error);
    }
  };
}
