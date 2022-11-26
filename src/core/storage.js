import idb from '../utils/idb';

const openDB = Symbol('openDB');
const db = Symbol('db');
const putData = Symbol('putData');
const getData = Symbol('getData');
const removeData = Symbol('removeData');
const removeDB = Symbol('removeDB');
const getVersion = Symbol('getVersion');
const isIncludeStore = Symbol('isIncludeStore');
const close = Symbol('close');
const removeStore = Symbol('removeStore');
const getAllKeys = Symbol('getAllKeys');
const getAllValues = Symbol('getAllValues');
const removeAllData = Symbol('removeAllData');

/**
 * @param {dbName} string 数据库名称
 * @param {storeName} string store 名称
 * @param {version} number 数据库版本号
 * @description 初始化indexDB
 */
export default class Storage {
  constructor(dbName, storeName, version){
    this.dbName = dbName;
    this.storeName = storeName;
    this.version = version;
    this[db] = null;
  }
  // 打开或创建数据库
  [openDB]() {
    return new Promise((resolve, reject) => {
      const request = idb.open(this.dbName, this.version);
      request.onerror = (err) => {
        reject(err);
      }
      request.onsuccess = async () => {
        this[db] = request.result;
        if (this[isIncludeStore](this.storeName)) {
          resolve(this[db]);
        } else {
          this.version = this[getVersion]() + 1
          await this[close]()
          this[db] = await this[openDB]()
          resolve(this[db])
        }
        // this[db] = request.result;
        // resolve(this[db]);
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
  // 获取所有key
  [getAllKeys]() {
    return new Promise((resolve, reject) => {
      const store = this[db].transaction([this.storeName]).objectStore(this.storeName);
      const request = store.getAllKeys()
      request.onsuccess = (e) => {
        resolve(e.target.result);
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
  // 获取所有数据
  [getAllValues](key) {
    return new Promise((resolve, reject) => {
      const store = this[db].transaction([this.storeName]).objectStore(this.storeName);
      const request = store.getAll(key);
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
    return new Promise((resolve, reject) => {
      const store = this[db].transaction([this.storeName], 'readwrite').objectStore(this.storeName);
      const request = store.delete(key);
      request.onsuccess = (e) => {
        resolve(this[db]);
      }
      request.onerror = (err) => {
        reject(err);
      }
    })
  }
  // 删除所有数据
  [removeAllData]() {
    return new Promise((resolve, reject) => {
      const store = this[db].transaction([this.storeName], 'readwrite').objectStore(this.storeName);
      const request = store.clear();
      request.onsuccess = (e) => {
        resolve(this[db]);
      }
      request.onerror = (err) => {
        reject(err);
      }
    })
  }
  // 删除数据库
  [removeDB](dbName) {
    idb.deleteDatabase(dbName);
  }
  // 删除store
  async [removeStore] (storeName) {
    if (!this[db]) {
      this[db] = await this[openDB]()
    }
    this.version = this[getVersion]() + 1
    await this[close]()
    this[db] = await this[openDB]()
    this[db].deleteObjectStore(storeName)
  }
  // 获取数据库版本
  [getVersion] () {
    return this[db].version
  }
  // 数据库是否存在store
  [isIncludeStore] (storeName) {
    return this[db].objectStoreNames.contains(storeName)
  }
  // 关闭数据库
  [close] () {
    return this[db].close()
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
   * @description 获取所有key
   */
  async keys() {
    if(!this[db]) {
      this[db] = await this[openDB]();
    }
    const data = await this[getAllKeys]();
    return data;
  }
  /**
   * @description 获取所有数据
   */
  async values(key) {
    if(!this[db]) {
      this[db] = await this[openDB]();
    }
    const data = await this[getAllValues]();
    return data;
  }
  /**
   * @description 关闭数据库连接
   */
  async closeDB() {
    this[close]()
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
   * @description 删除所有数据
   */
  async clear() {
    if(!this[db]) {
      this[db] = await this[openDB]();
    }
    await this[removeAllData]();
  }
  /**
   * @param {storeName} string
   * @description 删除store
   */
  async removeStore(storeName) {
    await this[removeStore](storeName);
  }
  /**
   * @param {dbName} string
   * @description 删除数据库
   */
  removeDB(dbName) {
    this[removeDB](dbName);
  }
}
