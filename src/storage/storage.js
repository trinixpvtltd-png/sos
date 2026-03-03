import AsyncStorage from '@react-native-async-storage/async-storage';

const safeParse = (value, fallbackValue) => {
  if (value == null) {
    return fallbackValue;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    console.warn('[storage] Failed to parse value', error);
    return fallbackValue;
  }
};

export const storage = {
  async getJSON(key, fallbackValue) {
    try {
      const value = await AsyncStorage.getItem(key);
      return safeParse(value, fallbackValue);
    } catch (error) {
      console.warn(`[storage] Failed to read ${key}`, error);
      return fallbackValue;
    }
  },

  async setJSON(key, value) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`[storage] Failed to save ${key}`, error);
      return false;
    }
  },

  async getString(key, fallbackValue = '') {
    try {
      const value = await AsyncStorage.getItem(key);
      return value == null ? fallbackValue : value;
    } catch (error) {
      console.warn(`[storage] Failed to read string ${key}`, error);
      return fallbackValue;
    }
  },

  async setString(key, value) {
    try {
      await AsyncStorage.setItem(key, String(value));
      return true;
    } catch (error) {
      console.warn(`[storage] Failed to save string ${key}`, error);
      return false;
    }
  },

  async remove(key) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`[storage] Failed to remove ${key}`, error);
      return false;
    }
  },
};
