# why

最初原因是作为面试准备的主题之一，后来发现研究原理最好的方法就是自己动手实现一个。

# what

前端早已进入了模块化开发的时代，Node.js火起来后，CommonJS作为服务端js模块化的标准。与此同时吗，针对浏览器端的模块化规范AMD, CMD陆续退出来。最具代表性的就是require.js和sea.js。


# how

## 如何定位一个模块

每个module都有一个ID(一般是模块的相对路径),根据传入的baseURL+模块ID得到该模块的完整路径。

## 如何加载一个模块

得到模块的完整路径后，通过动态创建script脚本来加载模块：

```javascript
var node = document.createElement('script');
var head = document.getElementsByTagName('head')[0];

node.src = url;
node.async = true;

node.addEventListener('load', callback, false);

head.insertBefore(node, head.firstChild);
```

* [AMD规范](https://github.com/amdjs/amdjs-api/wiki/AMD)


### 参考资料 

* 非 AMD 演示加载器地址 [webkit-dwarf](https://github.com/dwarfJS/webkit-dwarf)