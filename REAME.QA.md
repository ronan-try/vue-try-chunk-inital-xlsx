
```js
splitChunks: {
  cacheGroups: {
    xlsx: {
      name: 'chunk-xlsx',
      test: /[\\/]node_modules[\\/]xlsx[\\/]/,
      priority: 20,
      chunks: 'all'
    }
  }
},
```
修改webapck配置文件后，chunkhash肯定要发生一次变化
1. chunk-xlsx 应该是随着业务代码如何变动，都不会改变chunkhash的。 因为xlsx的入口文件依赖关系没发生变化。

2. chunk-vendors 是否随着业务代码变动而变动？如何维护chunkhash 以保证 有效的缓存机制？