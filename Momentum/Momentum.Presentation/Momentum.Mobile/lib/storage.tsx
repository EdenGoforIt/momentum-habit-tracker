import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getItem<T>(key: string): Promise<T | null> {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error(`Error getting item ${key}:`, error);
    return null;
  }
}

export async function setItem<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting item ${key}:`, error);
  }
}

export async function removeItem(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing item ${key}:`, error);
  }
}

export async function getAllKeys(): Promise<string[]> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    return [...keys];
  } catch (error) {
    console.error("Error getting all keys:", error);
    return [];
  }
}

export async function multiGet(
  keys: string[]
): Promise<Array<[string, string | null]>> {
  try {
    return await AsyncStorage.multiGet(keys);
  } catch (error) {
    console.error("Error getting multiple items:", error);
    return [];
  }
}

export async function multiSet(
  keyValuePairs: Array<[string, string]>
): Promise<void> {
  try {
    await AsyncStorage.multiSet(keyValuePairs);
  } catch (error) {
    console.error("Error setting multiple items:", error);
  }
}

export async function multiRemove(keys: string[]): Promise<void> {
  try {
    await AsyncStorage.multiRemove(keys);
  } catch (error) {
    console.error("Error removing multiple items:", error);
  }
}

export async function clear(): Promise<void> {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error("Error clearing storage:", error);
  }
}
