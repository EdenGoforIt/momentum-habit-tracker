import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getItem<T>(key: string): Promise<T | null> {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    return null;
  }
}

export async function setItem<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
  }
}

export async function removeItem(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
  }
}

export async function getAllKeys(): Promise<string[]> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    return [...keys];
  } catch (error) {
    return [];
  }
}

export async function multiGet(
  keys: string[]
): Promise<Array<[string, string | null]>> {
  try {
    var data = await AsyncStorage.multiGet(keys);
    return [...data];
  } catch (error) {
    return [];
  }
}

export async function getAllValues(): Promise<Record<string, any>> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const keyValuePairs = await AsyncStorage.multiGet(keys);

    const result: Record<string, any> = {};

    keyValuePairs.forEach(([key, value]) => {
      if (value !== null) {
        try {
          // Try to parse JSON values
          result[key] = JSON.parse(value);
        } catch {
          // If not JSON, store as string
          result[key] = value;
        }
      } else {
        result[key] = null;
      }
    });

    return result;
  } catch (error) {
    return {};
  }
}

export async function dumpStorage(): Promise<void> {
  try {
    const allValues = await getAllValues();
  } catch (error) {
  }
}

export async function multiSet(
  keyValuePairs: Array<[string, string]>
): Promise<void> {
  try {
    await AsyncStorage.multiSet(keyValuePairs);
  } catch (error) {
  }
}

export async function multiRemove(keys: string[]): Promise<void> {
  try {
    await AsyncStorage.multiRemove(keys);
  } catch (error) {
  }
}

export async function clear(): Promise<void> {
  try {
    await AsyncStorage.clear();
  } catch (error) {
  }
}
