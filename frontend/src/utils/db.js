import { openDB } from 'idb';

const dbPromise = openDB('chats-store', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('chats')) {
      db.createObjectStore('chats', {
        keyPath: 'id',
        autoIncrement: true
      });
    }
  }
});

export const saveToDB = async (data) => {
  try {
    const db = await dbPromise;
    const tx = db.transaction('chats', 'readwrite');
    const store = tx.objectStore('chats');
    await store.put(data);
    await tx.done;
  } catch (error) {
    console.error('Error saving data to database:', error);
  }
};

export const readFromDB = async (id) => {
  try {
    const db = await dbPromise;
    const tx = db.transaction('chats', 'readonly');
    const store = tx.objectStore('chats');
    return store.get(id);
  } catch (error) {
    console.error('Error reading data from database:', error);
  }
};

export const readAllFromDB = async () => {
  try {
    const db = await dbPromise;
    const tx = db.transaction('chats', 'readonly');
    const store = tx.objectStore('chats');
    const chats = await store.getAll();
    console.log('chats', chats);
    chats.sort(
      (a, b) =>
        new Date(b.messages.at(-1)?.time) - new Date(a.messages.at(-1)?.time)
    );
    return chats;
  } catch (error) {
    console.error('Error reading all data from database:', error);
  }
};

export const deleteFromDB = async (id) => {
  try {
    const db = await dbPromise;
    const tx = db.transaction('chats', 'readwrite');
    const store = tx.objectStore('chats');
    await store.delete(id);
    await tx.done;
  } catch (error) {
    console.error('Error deleting data from database:', error);
  }
};

export const clearDB = async () => {
  try {
    const db = await dbPromise;
    const tx = db.transaction('chats', 'readwrite');
    const store = tx.objectStore('chats');
    await store.clear();
    await tx.done;
  } catch (error) {
    console.error('Error clearing database:', error);
  }
};
