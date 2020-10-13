# vue-try-chunk-inital-xlsx

## 🙄 Target 仅调用test(),为何xlsx会被bundle？为何xlsx出现在vendors中？
环境：vue2、webpack4

实验：@/utils/index中1个xlsx函数，1个test函数。组件仅用test(),为何xlsx会被bundle？为何xlsx出现在vendors中？

代码：@/utils/index.js
```js
import * as XLSX from 'xlsx'

export const excelToJson = () => {
    console.warn('@/utils/index.excelToJson is used')
    return XLSX + 'excelToJson';
}

export const test = () => {
    console.warn('@/utils/index.test is used')
    return 'test'
}

export const test2 = () => {
    console.warn('@/utils/index.test2 is used')
    return 'test2'
}
```

## 🤔 Try 几个场景
### - Try000 没有使用任何`@/utils/index`函数
显然：有`chunk: inital`中的`vue, vue-router, core-js`，没有`xlsx`

截图：
![try000](./log_imgs/000.png)


### - Try010 仅`Home.vue`使用`test()`
代码：`Home.vue`
```js
import { test } from '../utils/index.js'

export default {
  name: 'Home',
  created () {
    console.log(test())
  },
}
```
😳 显然：有了`xlsx`。但是并没有使用到`excelToJson()`, 

🤔 猜测：因为webpack4使用了变量提升，`@/utils/index`中涉及的code都会被编译进去

截图：
![try010](./log_imgs/010.png)


### - Try020 仅`About.vue`使用`test()`
代码：`About.vue`
```js
import { test } from '../utils/index.js'

export default {
  name: 'About',
  created () {
    console.log(test())
  },
}
```
😳 显然：有了`xlsx`。但是并没有使用到`excelToJson()`, 

🤔 猜测：因为webpack4使用了变量提升，`@/utils/index`中涉及的code都会被编译进去

截图：
![try010](./log_imgs/020.png)



## 😘 上面的几个Try，可以证实/推断出一下几点
webpack配置代码
```js
splitChunks: {
  cacheGroups: {
    vendors: {
      name: 'chunk-vendors',
      test: /[\\\/]node_modules[\\\/]/,
      priority: -10,
      chunks: 'initial'
    },
    common: {
      name: 'chunk-common',
      minChunks: 2,
      priority: -20,
      chunks: 'initial',
      reuseExistingChunk: true
    }
  }
},
```

### 1. [证实+Try000+Try010] `chunk: inital`阶段涉及的`node_modules`的文件库会被放到`chunk-vendors.js`中。 在第2点中做解释。

### 2. [证实+Try010] `Home.vue`发生在`chunk: inital`阶段，因为`router`中`Home.vue`直接引用的，而`About.vue`是动态引用的，所以`xlsx`bundle到`chunk-vendors`
代码：`router/index`
```js
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]
```
### 3. [😁 推测] 在没有发生`minChunks:2`时，跟随最先的component 一起bundle为chunk。       
  [证实] 将home.vue 和 about.vue 都使用test函数，xlsx应该会 会pack到chunk-vendors.js中（实验成功，因为home.vue 是直接引用）。

### 4. 🤔 如何才能发生`minChunks:2`
共享发生平行关系中

代码：`router/index`
```js
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    // component: Home,
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue') // 实验minChunks: 2
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
```
代码：`home.vue`, `about.vue` 均使用 `test()`

截图：
![证明minChunks](./log_imgs/minchunk2-xlsx.png)

### 5. [证实+Try020] 单独使用`@/utils/index`中的`test()`也会将`xlsx`打包进去
证明上面截图中的`xlsx` + `buffer`:
- 代码：仅`About.vue`使用`test()`
- 证明图：
![证明xlsx](./log_imgs/chunk-xlsx-001.png)
![证明buffer](./log_imgs/chunk-xlsx-002.png)

***虽然`excelToJson()`被标记为`unused` + `harmony export`，将被shaking掉，但是`1146 xlsx`不会干掉。***

## 6. 🤔 猜测？？ 因为webpack4使用了变量提升，@/utils/index中的`cmd` 代码会`all export used`全部打进去了？？
1. 使用webpack4打包试试
2. 使用lodash-es试试
3. 记忆力，webapck4不在解析cmd，直接给他命名空间了。？



### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

自己对上次使用全路径的方法稍微有点迟疑，总觉得不好，看到ant-design也这么搞，挺好，感谢jinru
