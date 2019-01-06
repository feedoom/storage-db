import idb from '../utils/idb';

const openDB = Symbol('openDB');
const db = Symbol('db');
const putData = Symbol('putData');
const getData = Symbol('getData');
const removeData = Symbol('removeData');
const removeDB = Symbol('removeDB');

/**
 * @param {dbName} string 数据库名称
 * @param {version} number 数据库版本号
 * @description 初始化indexDB
 */
export default class Storage {
  constructor(dbName, version){
    this.dbName = dbName;
    this.storeName = dbName;
    this.version = version;
    this[db] = null;
  }
  // 打开或创建数据库
  [openDB]() {
    return new Promise((resolve, reject) => {
      const request = idb.open(this.dbName, this.dbVersion);
      request.onerror = (err) => {
        reject(err);
      }
      request.onsuccess = () => {
        this[db] = request.result;
        resolve(this[db]);
      }
      request.onupgradeneeded = (event) => {
        this[db] = event.target.result;
        if(!this[db].objectStoreNames.contains(this.storeName)) {
          const newStore = this[db].createObjectStore(this.storeName, {keyPath: 'id'});
          newStore.transaction.oncomplete = () => {
            resolve(this[db]);
          }
          newStore.transaction.onerror = (err) => {
            reject(err);
          }
        } else {
          resolve(this[db]);
        }
      }
    });
  }
  // 新增及更新
  [putData](key, value) {
    return new Promise((resolve, reject) => {
      const store = this[db].transaction([this.storeName], 'readwrite').objectStore(this.storeName);
      const request = store.put({
        id: key,
        value,
      });
      request.onsuccess = () => {
        resolve(this[db]);
      }
      request.onerror = (err) => {
        reject(err);
      }
    });
  }
  // 获取数据
  [getData](key) {
    return new Promise((resolve, reject) => {
      const store = this[db].transaction([this.storeName]).objectStore(this.storeName);
      const request = store.get(key);
      request.onsuccess = (e) => {
        resolve(e.target.result);
      }
      request.onerror = (err) => {
        reject(err);
      }
    });
  }
  // 删除数据
  [removeData](key) {
    const store = this[db].transaction([this.storeName], 'readwrite').objectStore(this.storeName);
    const request = store.delete(key);
    request.onsuccess = (e) => {
      resolve(this[db]);
    }
    request.onerror = (err) => {
      reject(err);
    }
  }
  // 删除数据库
  [removeDB](dbName) {
    idb.deleteDatabase(dbName);
  }
  /**
   * @param {key} string
   * @param {value} any
   * @description 插入数据
   */
  async setItem(key, value)  {
    if(!this[db]) {
      this[db] = await this[openDB]();
    }
    await this[putData](key, value);
    return this[db];
  }
  /**
   * @param {key} string
   * @description 获取数据
   */
  async getItem(key) {
    if(!this[db]) {
      this[db] = await this[openDB]();
    }
    const data = await this[getData](key);
    return data;
  }
  /**
   * @param {key} string
   * @description 删除数据
   */
  async removeItem(key) {
    if(!this[db]) {
      this[db] = await this[openDB]();
    }
    await this[removeData](key);
  }
  /**
   * @param {dbName} string
   * @description 删除数据库
   */
  removeDB(dbName) {
    this[removeDB](dbName);
  }
}