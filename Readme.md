# why

最初原因是作为面试准备的主题之一，后来发现研究原理最好的方法就是自己动手实现一个。

# what

前端早已进入了模块化开发的时代，Node.js火起来后，CommonJS作为服务端js模块化的标准。与此同时，针对浏览器端的模块化规范AMD, CMD陆续推出，其中最具代表性的就是require.js和sea.js。


# how

## 1、如何定位一个模块

每个module都有一个ID(一般是模块的相对路径),根据传入的baseURL+模块ID得到该模块的完整路径。

## 2、如何加载一个模块

得到模块的完整路径后，通过动态创建script脚本来加载模块：

```javascript
var node = document.createElement('script');
var head = document.getElementsByTagName('head')[0];

node.src = url;
node.async = true;

node.addEventListener('load', callback, false);

head.insertBefore(node, head.firstChild);
```

## 3、如何获取一个模块的依赖

每加载一个模块，都会在内部维护一个模块依赖映射表：
```javascript
{
	模块路径1：{
		id: '',
		dep: [], 依赖
		factory: fn  模块方法
	},
	模块路径2：{
		id: '',
		dep: [], 依赖
		factory: fn  模块方法
	}
	...
}
```
这样通过模块id很容易得到模块对应的依赖信息，找到依赖后，就可以通过id定位到模块的完整路径，然后通过完整路径去加载这个模块了，也就是重复加载单个模块的过程。


## 4、模块重复加载怎么办

开发过程中，很容易遇到A模块依赖B模块,C模块也依赖B模块的场景。如果按照上面的模块加载流程，B模块会被加载两次，也就是在分别加载A模块和C模块的时候，都会加载B。很明显这是一种资源上面的浪费，明明已经加载过了，为嘛还要加载一遍。

解决方法很简单，每次加载依赖模块前先看看依赖映射表是否存在，存在了即已加载过，就不需要重复加载了。

## 5、模块的内部方法是如何导出的

模块化开发的目的是为了避免污染全局变量，模块内部定义的方法，都是通过内部变量export的形式，提供外部访问句柄的。

```javascript
define('A', ['B','C'], function(require, exports, module) {
	exports.hello = function(name) {
		console.log('hello, ' + name)
	}
})
```
上面代码表示模块A对外提供了一个`hello()`方法。




* [AMD规范](https://github.com/amdjs/amdjs-api/wiki/AMD)


### 参考资料 

* 非 AMD 演示加载器地址 [webkit-dwarf](https://github.com/dwarfJS/webkit-dwarf)