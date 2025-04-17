import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Logs all AsyncStorage keys and values to the console
 * @returns {Promise<[string, string | null][]>} Array of key-value pairs
 */
export const logAllStorage = async (): Promise<[string, string | null][]> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    console.log("AsyncStorage keys:", keys);

    const items = await AsyncStorage.multiGet(keys);
    console.log("AsyncStorage contents:", JSON.stringify(items, null, 2));

    // Log each item individually for better readability
    items.forEach((item) => {
      console.log(`${item[0]}: ${item[1]}`);
    });

    return [...items];
  } catch (error) {
    console.error("Error debugging AsyncStorage:", error);
    return [];
  }
};

/**
 * Logs a specific AsyncStorage item to the console
 * @param {string} key - The key to retrieve
 * @returns {Promise<string | null>} The value for the key
 */
export const logStorageItem = async (key: string): Promise<string | null> => {
  try {
    const value = await AsyncStorage.getItem(key);
    console.log(`AsyncStorage item ${key}:`, value);
    return value;
  } catch (error) {
    console.error(`Error getting AsyncStorage item ${key}:`, error);
    return null;
  }
};

/**
 * Clears all AsyncStorage items and logs the result
 */
export const clearAllStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
    console.log("AsyncStorage cleared successfully");
  } catch (error) {
    console.error("Error clearing AsyncStorage:", error);
  }
};
