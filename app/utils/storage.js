import AsyncStorage from "@react-native-async-storage/async-storage";

const storeData = (key, value) => {
  return new Promise(async (resolve, reject) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      resolve(value);
    } catch (e) {
      reject(e);
    }
  });
};

const getData = (key) => {
  return new Promise(async (resolve, reject) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      resolve(jsonValue != null ? JSON.parse(jsonValue) : null);
    } catch (e) {
      reject(e);
    }
  });
};

export { storeData, getData };
