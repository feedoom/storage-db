# storage-db

精简版indexDB，简易移动端使用。

对 [storage-db](https://github.com/weyos/storage-db) 添加亿点功能

## 安装

```sh
npm install dbstorage
```

## 引入

```js
import StorageDB from 'dbstorage';
```

默认不做任何编译处理

如需编译处理过的js

```js
import StorageDB from 'dbstorage/lib/storage';
```

Promise需自行引入polyfill

## 初始化

```js
/**
 * @param {dbName} string 数据库名称
 * @param {storeName} string store 名称
 * @param {version} number 数据库版本号
 * @description 初始化indexDB
 */

// 不传参数，默认数据库名 baseDB, 默认store为baseStore, 默认版本为1
const dbstorage = new StroageDB(dbName, store, version);
```

## 存储/更新

```js
/**
 * @param {key} string
 * @param {value} any
 * @description 插入数据
 */

dbstorage.setItem('author', 'weyos').then(() => {
  // do something
});
```

## 取值

```js
/**
 * @param {key} string
 * @description 获取数据
 */
dbstorage.getItem('author').then((result) => {
  // do something
});
```

## 获取所有key

```js
/**
 * @description 获取所有key
 */
dbstorage.keys().then((result) => {
  // do something
});
```

## 获取所有数据

```js
/**
 * @description 获取所有数据
 */
dbstorage.values().then((result) => {
  // do something
});
```

## 关闭数据库连接

```js
/**
 * @description 关闭数据库连接
 */
dbstorage.closeDB()

// 同一个数据库建立多个store，需关闭除此之外所有数据库的连接
const store1 = new StroageDB('db', 'store1')
await store1.setItem(age, 1)
await store1.closeDB()
const store2 = new StroageDB('db', 'store2')
await store2.setItem(age, 2)
```

## 删除某条数据

```js
/**
 * @param {key} string
 * @description 删除数据
 */
dbstorage.removeItem('author').then(() => {
  // do something
});
```

## 删除所有数据

```js
/**
 * @description 删除所有数据
 */
dbstorage.clear().then(() => {
  // do something
});
```

## 删除store

```js
/**
 * @param {storeName} string
 * @description 删除store
 */
dbstorage.removeStore(storeName).then(() => {
  // do something
});
```

## 删除数据库

```js
/**
 * @param {dbName} string
 * @description 删除数据库
 */

dbstorage.removeDB('author');
```
