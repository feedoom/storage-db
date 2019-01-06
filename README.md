# storage-db

精简版indexDB，简易移动端使用。

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
 * @param {version} number 数据库版本号
 * @description 初始化indexDB
 */

const dbstorage = new StroageDB(dbName, version);
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

## 删除数据库

```js
/**
 * @param {dbName} string
 * @description 删除数据库
 */

dbstorage.removeDB('author');
```