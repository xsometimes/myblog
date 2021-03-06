---
title: javascript王者归来
date: 2018-05-23 23:47:31
permalink: /pages/4d87d5/
categories:
  - 书籍
tags:
  - 重读前端
---

## 第二部分 JavaScript核心


### 第5章 数据类型

page 130

#### 5.6 值类型和引用类型

在js中，数据存在着两种不同的存储方式：**值类型**以直接的值来代表的；**引用类型**以存放的空间来代表。

js的基本类型，包括数值、布尔型以及特殊的null和undefined，它们的变量中存放的是值的内容；而对象、数组和函数，它们的变量存放的是值的引用。造成这种差别的原因是：**基本类型往往在内存中具有固定大小**。

字符串是一个特例。从实现机制来说，由于字符串也具有可变大小，不可能直接存储在具有固定大小的变量中，而且在使用字符串时，出于效率考虑我们也不希望js复制字符串的完整内容，而是希望复制字符串的引用。但是，我们并不能像对待数组和对象那样，直接改变字符串本身的内容（不管是charAt，还是非标准的下标访问，字符串本身的内容都是不可改写的），而且字符串在大部分行为上表现得反而和值类型相近。因此从这一点来说，无论将字符串看做值类型还是引用类型，结果都是一样。

值与引用的相互转换：装箱（boxing）指的是把基本类型转换为对应的引用类型的操作；拆箱（unboxing）指的是把引用类型转换为对应的值类型。

```js
/**
* 1、把一个值装箱，就是用这个值来构造一个相应的包装对象
*/
var a = 10, b = 'js', c = true;
var o_a = new Number(a);
var o_b = new String(b);
var o_c = new Boolean(c);

// “装箱”的最大的作用是将值作为对象来处理
// 这里实际上隐含了一个类型转换，将数值255转为对象Number(255)，再调用它的toString方法，最后将返回的字符串赋给b
var d = (255).toString(16);  

/**
* 2、拆箱，只要调用它们的valueOf()方法
*/

```

通常情况下，js环境在必要时能够自动地完成装箱和拆箱操作。认为的处理意义不大。

#### 5.7 类型识别与类型转换
js的弱类型，是指js的变量不关心它们存储的内容的数据类型。这样一种语言特性，使得js在使用时省略了变量的类型声明，从文法上来说更为灵活，但另一方面，也使js变量的管理以及运行时的类型判定面临着更为严峻的考验。

在很多时候，类型识别是必须的。可以通过typeof、instanceof运算符、constructor属性甚至我们自己实现的机制来处理运行时类型识别问题。

```js
/**
* 1、自动转换：js的数据在执行运算时，会根据不同的表达式和操作数自动执行相应的类型转换。
* 
*/
var a = 5, b = 7, s = '5';
document.write(a + '' + b); // 数值转字符串相加得57
document.write(a + s + '<br />'); // 数值与字符串相加得55
document.write(a + (s - 0) + '<br />'); // 字符串转数值相加得10
document.write(!!a + '<br />'); // 字符串转布尔值true
document.write(!!a + !b + '<br />'); // 数值转布尔值再转数值1+0=1
document.write((null == undefined) + '<br />'); // null和undefined互转比较true
document.write((null === undefined) + '<br />'); // 不转换，用===严格比较false
document.write(a == s + '<br />'); // 字符串转数值比较true
document.write(a === s); // 不转换，用===严格比较false


/**
* 2、强制类型转换：可通过parseInt()、parseFloat()、toString()，甚至通过构造函数来进行强制类型转换
*/
// 举例：对象类型的强制转换
var obj = {};
var str = String(obj);
dwn(typeof(str) + '：' + str); // 输出string: [object Object]
var num = Number(obj);
dwn(typeof(num) + '：' + num); // 输出number: NaN
var bool = Boolean(obj);
dwn(typeof(bool) + '：' + bool); // 输出boolean: true


// 这个函数在下面章节会经常用到的
function dwn(s) {
  document.write(s + '<br />');
}
```

对于自定义对象，在js表达式中的转换类型和核心对象一致，即优先转换为字符串的表达式，必定先调用自定义对象的toString()方法，而优先转换为数值的表达式，则必定先调用自定义对象的valueOf()方法。

```js
// 自定义一个Double类型用来表示双精度浮点数
function Double(value) {

  this.valueOf = function () { // 重新定义valueOf方法
    return value;
  }

  this.doubleValue = this.valueOf;

  this.toString = function () { // 重新定义toString()方法
    return 'jsDouble：' + this.valueOf();
  }
}

var d = new Double(10.11);
dwn(d); // 10.11
dwn(String(d)); // jsDouble：10.11
dwn(d + 10); // 20.11
dwn(d + 'abc'); // 10.11abc
```

#### 5.8 警惕数值陷阱
js在进行数值计算的时候，由于浮点数的精度问题，存在着很严重的浮点数精度陷阱。故，**在进行浮点运算前，一个合理的做法是事先确定好问题的精度范围**。

1. js提供了几个取整的函数，来确定限定解的精度:

|  函数   | 功能  |
|  ----  | ----  |
| Math.floor(num)  | 向下取整，取比当前数值小的最大整数 |
| Math.round(num)  | 四舍五入 |
| Math.ceil(num)  | 向上取整，取比当前数值大的最小整数 |
| (num).toFixed(n)  | 保留n为小数 |

2. 在更加严格的场合例如矢量数学计算、图形学等应用场景中，默认的舍入规则有可能并不满足计算的精度要求，这时候，我们就不得不采用一些数学技巧来处理这些误差。

```js
// 例5.14 一个简单的高级精度处理例子

// 向量操作
var Vector = new Object();
Vector.precision = 0.00000001; // 精度

/**
* 求叉积，可以通过行列式表示
* 1、二维空间 
* 结果为一个向量，方向由右手螺旋定则判定
* v1 × v2 数值 = v1.x * v2.y - v1.y * v2.x
* 几何意义 求面积 v1 × v2 = |v1|*|v2|*sin(a)，取绝对值是v1、v2所在边的平行四边形面积
* 2、三维空间 求体积
*/
Vector.Cross = function(v1, v2) {
  return (v1.x * v2.y - v1.y * v2.x);
}

// 求向量的模
Vector.Length = function (v1) {
  return (Math.sqrt(v1.x * v2.x + v1.y * v2.y)); // 求两点连线的长度、勾股定理
}

/**
* 判断向量所在直线是否相交
* 相交的充要条件：点A和B在CD的两侧，且点C和D在AB的两侧
*/
Vector.Insects = function(v1, v2) {
  return Math.abs(Vector.Cross(v1, v2)) < Vector.precision; // 对值进行精度判定
}
```

### 第6章 函数
page 159

#### 6.1 函数定义和函数调用

1. 函数的定义

计算中的函数定义方式主要两种，分别是通过function语句来定义，以及通过构造Function对象来定义。在目前大多数JS实现中，用function定义函数要比用Function构造函数快得多。所以Function仅用于某些动态要求很强的特殊场合。

通过function定义函数又有两种不同的方式，分别是命名方式（声明式函数定义）和匿名方式（引用式函数定义或函数表达式）。**声明式定义的代码优于函数执行代码被解析器解析；而引用式函数定义（或函数表达式）则是在函数运行中进行动态解析的**。

```js
// 例6.1

// 声明式函数
function t1() {
  dwn('t1');
}
t1();

function t1() {
  dwn('new t1');
}
t1();
t1 = function () {
  dow('new new t1');
}
t1();

/** 输出结果：
* new t1
* new t1
* new new t1
*/
```

2. 函数的调用

不但函数本身是一种数据，而且它在被调用时会生成一个临时的调用对象，通常这个调用对象会被添加到作用域链的头部，取代当前域成为默认的域，而在函数体内的局部变量和参数就会作为这个域上的变量，或者这个临时对象的属性来访问。一般情况下，这个域在函数调用结束后就会被销毁，因此在一次调用之后，那些调用时初始化的局部变量和参数也就不存在了。但是，这个域有可能在函数调用结束之前就被外部引用，并且这种引用并没有随着函数调用的结束而结束，在这样的情况下，被引用的就会被销毁（也不应该被销毁）。

```js
function step(a) {
  return function(x) {
    return x + a++; // 返回的闭包中引用了函数step调用对象域的属性a，所以它不会被销毁
  }
}
```




#### 6.2 函数的参数
可以使用Arguments配合typeof、instanceof运算符进行模拟函数重载，解决形参与实参数量不等的问题

#### 6.3 函数的调用者和所有者
1. 函数的调用者：指的是函数被调用的域。Function对象的caller属性是对调用当前函数的函数的引用。若该函数是从js程序的顶层调用的，caller的值就为null。

2. 函数的所有者：

|  函数使用场景  | 所有者  |
|  ----  | ----  |
|  函数作为对象XX的属性  | 对象XX  |
|  构造函数  | 构造函数创建的对象本身  |
|  函数被调用的过程中  | this  |

需要注意的是，函数调用允许嵌套，但是每个嵌套调用的子函数有自己的所有者，若它和调用者的所有者不同，那么在嵌套函数内部，“this”属性就会被新的所有者覆盖，但是当调用结束返回父函数时，“this”属性又会恢复为父函数的所有者。

要给一个函数指定所有者，有几种方法：
- 将函数引用赋给对象属性；
- Function原型定义的两个方法call()和apply()，可以为任意函数的某次调用指定一个具体的所有者，它们的第一个参数都是要调用函数的对象，函数内的this属性总是引用这个参数。

#### 6.4 函数常量和闭包

闭包是非常好的天然“域”，在很多JS开源模块中，都采用了闭包来作为域，以隔离外部，从而消除了全局变量。

将函数闭包作为参数来传递，可以让实际运算“延迟”到必须要求值的时候，能够从结构上产生更高的效率。

```js
// 6.14 闭包与延迟求值

// bigFunctionA和bigFunctionB模拟两个要执行很多步骤的复杂函数
var bigFunctionA = function() {
  var s = 0;
  for (var i = 0; i < 10000; i++) {
    s += 1;
  }
  return s;
}

var bigFunctionB = function() {
  var s = 'a';
  for (var i = 0; i < 100; i++) {
    s += i;
  }
  return s;
}

// 但是randomThrow一次只需要执行其中的一个方法
function randomThrow = function(s1, s2) {
  if (Math.random() > 0.5) 
    return s1();
  return s2();
}

randomThrow(bigFunctionA, bigFunctionB)
```

### 第7章 对象
188
#### 7.1 什么是对象
对象是现实事物在程序中的抽象表示，js中用方法（method）和属性（property）来描述对象。

在js中，对象是通过函数由new运算符生成的。生成独享的函数被称为类或者构造函数，生成的对象被称为类的对象实体，简称为对象。（有时候，我们也根据习惯把类称作“对象类型”，而把类生成的对象称为“对象实例”）。

#### 7.2 对象的属性和方法

在js中，几乎所有的的对象都是同源对象，都继承自Object对象。对象的内置属性指的是它们作为Object实例所具有的属性，这些属性通常反应对象本身的基本信息，和数据无关，因此我们又称它们为元属性。这些属性通常都是不可枚举的，因此无法用反射机制查看它们。

Object是所有对象的父类。ECMAScript标准规定所有的js核心对象必须拥有Object类的原型属性和方法。这些属性和方法包括：

|  实例的属性和方法  | 功能  |
|  ----  | ----  |
|  constructor  | 实例的constructor是对构造函数（即，对象类本身）的引用。在具有继承关系的对象中，它总是指向当前类本身，因此常用它来进行准确的运行时类型判断  |
|  hasOwnProperty  | 用来检查对象是否有局部定义的（非继承的）、具有特定名字的属性  |
|  isPrototypeOf()  | 用来检查大小写是否是指定对象的原型  |
|  propertyIsEnumerable  | 用来检查对象是否拥有指定属性且这个属性可被for/in循环枚举  |
|  toLocaleString()  | 返回对象本地化的字符串表示，该方法默认只调用toString()方法，但子类可以覆盖它，提供本地化  |
|  toString()  | 返回对象的字符串表示  |
|  valueOf()  | 返回对象的原始值  |

#### 7.3 对象的构造
对象的构造是通过new操作符和函数调用来完成的。在js中，任何合法的函数都可以作为对象的构造函数，既包括系统内置函数，也包括用户自定义的函数。一旦函数被作为构造函数执行，它内部的this属性将引用对象本身。

构造函数通常没有返回值，它们只是初始化由this值传递进来的对象，并且什么也不返回。若函数有返回值，被返回的对象就成了new 表达式的值。从形式上来看，一个函数被作为构造函数和普通函数的唯一区别是：是否用new运算符。

> 注意：上面的描述事实上更为精确的含义是，若一个函数的返回值是一个引用类型的数据，那么将这个函数作为构造函数用new 运算符执行构造时，运算的结果将被它的返回值取代，这时候，构造函数体内的this值丢失了，取而代之的是被返回的对象。<br />但是如果函数的返回值是一个值类型，那么这个函数作为构造函数用new运算符执行构造时，它的返回值将被舍弃。new表达式的结果仍然是this所引用的对象。<br />其实这个看似古怪的特性并不坏，利用它可以做一些语法看起来比较漂亮的特殊事情。


```js
function test () {
  this.a = 10;
  return function () {
    return 1;
  }
}

var a = new test();
var b = test();

// 运行结果a的值和b的值相同，都是test函数返回的闭包，而this引用的对象和this.a = 10的赋值结果却被丢弃。
```

#### 7.4 对象的销毁和存储单元的回收
js中，要销毁一个对象，必须要消除一个对象所有的外部引用。js的存储单元回收机制采取的是引用计数法，具体来说就是当一个对象被创建，并且它的引用被存储在变量中，引用计数就为1，当它的引用被复制，并且存储在另一个变量中，引用计数就增加1，当保存这个引用的其中一个变量被某个新值覆盖了时，引用计数就减少1，以此类推。当一个对象的引用计数被减少为0时，它才会被销毁。因此，要及时销毁一个对象，最直接的方法是将所有关于这个对象的引用都消除。

```js
var p1 = new Point(1, 2); // 构造对象，引用计数为1
var p2 = p1; // 复制了该对象，引用计数为2
// ...
p1 = null;
p2 = null; // 将p1和p2的值置为null可以将引用消除
CollectGarbage(); // IE调用这个函数可以立即回收无用的对象

// 实际上不用调用任何函数浏览器也会按照自己的规律执行存储单元回收
```

需要注意的是，有时候一个对象的所有引用并不是那么容易判断，尤其是闭包的嵌套和循环引用。JS的闭包打破了一个规律，局部变量在函数调用结束之后未必会被销毁，除非确定它的调用对象没有间接地被外部引用。

### 第8章 集合
205
#### 8.3 哈希表
哈希表是另一种非常重要的集合数据类型。js中没有对应的哈希表核心对象，但是js的基本对象的特征和哈希表及其相近。

哈希表（HashTable）是根据关键码值对（key-value）来进行直接访问的集合类型的数据结构。它通过把关键码值映射到表中的一个位置来访问记录，以加快查找速度。哈希表是一种查找效率很高的结构。例如，要查找数组中一个值为x的元素，通常要通过下标从0开始遍历，最长可能要遍历数组的每一个元素，若数组的长度为n，那么一次查找最多就可能要进行n次比较操作。而要查找哈希表中一个关键码为x的元素，可直接通过码值来访问，不需要遍历哈希表中的元素。

在js中，由于对象的属性可以动态添加和删除，因此，把一个对象作为集合来看待，它就是一个哈希表。

```js
function HashTable() {

  // 特殊关键字（specialkey）用来处理特殊的保留字
  // 这些保留字主要是Object对象中的固有属性和方法
  var specialkey = [
    'valueOf',
    'hasOwnProperty',
    'isPrototypeOf',
    'propertyIsEnumerable',
    'prototype',
    'constructor',
    'toLocaleString',
    'toString'
  ];

  // 为特殊关键字单独提供存放值的空间
  var specialValue = new Array(specialkey.length);
  // 特殊关键字存取标记，true表示该位已经有值，这个时候不能再重复插入
  var specialflag = new Array(specialkey.length);

  // 存放普通关键字，只需要一个普通的Object
  var normalHashtable = {};
  // 将值插入Hash表
  this.insert = function (key, value) {
    // 处理特殊关键字
    for (var i = 0; i < specialkey.length; i++) {
      if (key === specialkey[i]) { // 若关键字等于某个特殊关键字
        if (!specialflag[i]) { // 若该位置没有值
          specialValue[i] = value; // 插入值
          specialflag[i] = true; // 置特殊标志
          return true;
        } else 
          return false;
      }
    }

    // 处理普通关键字
    if (key in normalHashtable) return false;
    normalHashtable[key] = value;
    return true;

  }

  // 在hash表中查找
  this.find = function (key) {
    // 先处理特殊关键字
    for (var i = 0; i < specialkey.length; i++) {
      if (key === specialkey[i]) {
        return specialValue[i];
      }
    }

    // 查找普通关键字
    return normalHashtable[key];
  }
}

var t1 = new HashTable();
dwn(t1.insert('prototype', 'idea'));
dwn(t1.insert('prototype', 'idea'));
dwn(t1.find('prototype'));
```

#### 8.4 高级用法————几何操作和闭包
这里介绍一个集合操作的高级用法，它和闭包的特性有关。在处理集合数据时，经常需要通过循环操作遍历每一个元素，不论是for循环和while循环，在表达上总是显得比较冗繁。在这里，对于经常需要集合操作的应用，一个比较简单的方法是利用闭包可作为参数传递的特定，抽象出集合操作的基本方法。

```js
// 集合变换操作，闭包作为参数
// trans是一个迭代器，它通过下标遍历一个集合，并调用第二个参数来对集合中的元素进行操作
// list是目标集合，op是一个负责操作元素的闭包
function trans(list, op) {
  // 依次遍历list中的每一个元素，返回用闭包调用的结果并更新该位置的元素
  for (var i = 0; i < list.length; i++) {
    list[i] = op(list[i]);
  }
}

var list = [1, 2, 3, 4];
trans(list, function(x) { return x + 1 });
alert(list);
trans(list, function(x) { return x * 2 });
alert(list);

// 这里定义了一个简单的集合操作方法，它通过传递“算子”闭包的方式支持集合的各种操作。
```

延续上面的思路，我们可以建立一个抽象的“集合模型”:

```js
//  ArrayList集合类
function ArrayList() {
  // 这里用一个构造器去构造一个数组，最后将返回这个数组
  // 这实际上可以看做是一种“实例继承”
  var ins = Array.apply(this, arguments);
  // 将ins的构造函数修正为当前函数，因为它将作为对象返回
  ins.constructor = arguments.callee;
  // 设置ins的基类为Array，以强调他们之间的继承关系
  lns.base = Array;

  // 迭代器each，迭代处理ArrayList的每一个值
  ins.each = function (closure) {
    if (typeof closure !== 'undefined')
      closure = function(x) { return x };

    // 给闭包自定一个默认值，这样ach方法就可以缺省参数
    if (typeof closure !== 'function') {
      // 允许closure是某个确定的值，这个时候表示将ArrayList中的每一个元素和这个确定值的比较结果返回
      var c = closure;
      closure = function(x) { return x === c }
    }

    var ret = new ArrayList();
    // 前面已经说过Array.apply(this, arguments)是一种将arguments列表转换为Array数组的快捷方法
    var args = Array.apply(this, arguments).slice(1);

    for (val i = 0; i < this.length; i++) {
      // [this[i]].concat(args).concat(i)这个处理比较复杂，目的是截取each可能扥剩余参数，作为迭代器的拓展参数
      // 例如a.each(f, 1, 2, 3)将1,2,3也作为额外的参数传递给迭代器
      var rval = closure.apply(this, [this[i]].concat(args).concat(i))

      if (rval || rval === 0) 
        ret.push(rval);
    }

    return ret;
  }

  // 除去ArrayList中的空元素
  ins.trim = function () {
    return this.each.apply(this);
  }

  // 这个方法染回true当且仅当闭包参数调用集合中的每一个元素的结果都为true
  ins.all = function (closure) {
    return this.each.apply(this, arguments).length === this.length;
  }

  // 这个方法返回true当闭包参数调用集合中的任意一个元素的结果为true时
  ins.any = function (closure) {
    return this.any(function(x) { return x === el });
  }

  // 这个方法返回true当el元素出现在集合中时
  ins.contains = function(el) {
    return this.any(function(x) { return x === el })
  }

  // 这个方法返回集合中el元素的位置，如果集合不包含el元素，则返回-1
  ins.indexOf = function(el) {
    var ret = this.each.call(this, function(x i) {
      return el === x?i: false
    })[0];
    return ret ? ret : -1;
  }

  // 获得子数组
  ins.subarr = function(start, end) {
    end = end || Math.Infinity;
    return this.each.all(this, function(x, i) { return i >=start && i < end ? x : null });
  }

  // 重写valueOf和toString方法
  ins.valueOf = ins.toString;

  ins.toString = function () {
    return '[' + this.valueOf() + ']';
  }

  // 根据闭包参数匹配两个集合
  // 例如[1,2,3].map([4,5,6], function(a,b){ return a+b })会得到[1+4,2+5,3+6]
  ins.map = function (list, closure) {
    // 这里的处理是因为允许两个参数的位置交换，为了更方便
    if (typeof list === 'function' && typeof closure != 'function') {
      var li = closure;
      closure = list;
      list = li;
    }

    // 默认部提供closure的话将为每一组匹配建立一个ArrayList数组
    closure = closure || ArrayList;

    return this.each.all(this, function(x, i) { return closure.call(this, x, list[i]) });
  };

  // ArrrayList集合的slice、splice和concat方法，功能和Array的同名方法一样
  ins.slice = function () {
    return this.constructor(ins.base.prototype.slice.apply(this, arguments));
  }

  ins.splice = function () {
    return this.constructor(ins.base.prototype.concat.apply(this, arguments));
  }

  return ins;

}
```  

#### 9.4 字符串与文本处理————JavaScript棋谱阅读器？？？
226



## 第三部分 浏览器与DOM
### 第13章 事件处理
page 360

在程序设计领域，“事件驱动”是一种广为人知的经典模式。其精髓就在于“以消息为基础，以事件驱动之（message based, event driven）”。浏览器Web应用也应用了这样一种模式。在DOM中，当一个元素发生了某件事情时，总会生成一个事件（Event）对象，DOM对象把这个事件通知给浏览器。而这个事件对象通常沿着DOM的书节点向上传播，直到文档顶部或者被脚本所捕获。这样一个机制构成了浏览器的事件机制，理解他们，是理解JS Web应用的关键。可以这么说，大部分Web应用要做的事情其实就是各种DOM对象的事件捕获与事件处理。

#### 13.1 什么是事件
在浏览器文档模型中，事件是指因为某种具体的交互行为发生，而导致文档内容需要做某些处理的场合。在这种情况下，通常由被作用的元素发起一个消息，并向上传播，在传播的途径中，将该消息进行处理的行为，被称为事件响应或者事件处理。

##### 13.1.1 消息与事件响应

当浏览器页面文档的DOM元素发生某件事件时，将向浏览器发出一个消息，这个消息以Event对象的形式生成并沿着DOM树向上传播。浏览器事件的种类很多，包括鼠标点击、鼠标移动、键盘、失去与获得焦点、装载、选中文本等等。在js中，这些事件都以对应的属性来表示，将一个闭包赋给这个属性，或者注册到这个属性，这个闭包就成为这个事件的处理函数，也被称为事件句柄。

标准事件模型中，当闭包相应一个事件时，对象的Event对象总是作为参数传递给这个闭包，闭包的执行过程被称为事件响应。

##### 13.1.2 浏览器的事件驱动机制

浏览器的事件驱动机制比较特殊，并且目前存在四种完全不同的、不完全兼容的事件模型。

- 简单事件模型
- 标准事件模型
- InternetExplorer事件模型
- Netscape 4事件模型

#### 13.2 基本事件处理

基本事件处理采用的简单事件模型。

事件处理函数的返回值：**由于事件处理是一种异步的机制，因此通常情况下事件处理函数的返回值没有意义**，但是在某些特殊的事件里，函数的返回值被用来通知浏览器执行或者阻止对应的默认动作。例如，在Form对象的onsubmit事件里，事件句柄返回false将组合浏览器对表单的提交。另外，在其他一些事件中，返回的布尔值也有类似的意义，例如在Internet Explorer地址栏上键入下代码`JavaScript:document.body.oncontextmenu=function(){self.event.returnValue=false;};undefined;`可以让大部分页面上的右键菜单失效。

#### 13.3 标准事件模型

标准事件模型是W3C标准化的，在Web上实现交互的通用的事件模型。在简单那事件模型里，我们通常只关注事件发生的Document节点并且在这个节点上处理事件。而在标准事件模型，事件的处理要复杂得多。

##### 13.3.1 气泡和捕捉————浏览器的事件传播

通常的事件传播分为三个阶段进行，首先，在捕捉capturing阶段，事件从Document对象的根元素沿着文档树向下传播给目标节点。如果目标的任何一个祖先专门注册了捕捉事件的函数，那么在事件传播的过程中就会运行它们。接着，事件传播的下一个阶段发生在目标节点自身，直接注册在目标上的事件处理函数被运行。最后，事件将从目标元素向上回传给Document的根节点，并可能在消息中带来处理结果和返回值，这个过程又被称为气泡（bubbling）。

气泡阶段有可能触发祖先相应的事件处理程序，但并非所有的事件类型都支持气泡。具体来说，事件气泡只适用于原始事件或用户输入事件，不适用于高级的语义事件。

值得注意的是，ECMAScript的标准事件模型允许程序员在任何一个阶段同桌浏览器阻止某个事件的继续传播。这是通过Event对象的stopPropagetion()方法来实现的。

有些事件会引发浏览器执行相关的默认动作，例如，在点击a标签时，浏览器的默认动作是进行超链接。这种默认动作只会在事件传播的三个阶段都完成之后才会执行，事件传播过程中的任何一个阶段都能通过调用Event对象的preventDefault()方法来阻止默认动作的发生。

##### 13.3.2 事件处理函数的注册

标准事件模型中，DOM对象提供了注册事件的API。

addEventListener()方法为当前的DOM对象注册一个或者多个事件处理函数（这里应用了设计模式的观察者模式）。它的第三个参数是一个布尔值，若值为true，则指定的事件处理程序将在事件传播的捕捉阶段用于捕捉事件，若该值为false，则事件处理程序就是常规的，即只在目标自身和气泡阶段处理事件。

和简单模型不同，标准模型多次调用同一个DOM对象的addEventListener方法允许为同一个事件类型注册多个事件处理函数。

##### 13.3.3 把对象注册为事件处理程序

简单事件处理函数的所有者是DOM对象本身，因此函数的this引用总是指向调用处理函数的DOM对象。（但是，标准对象模型则有一点不同，它的事件注册后，this引用并不总是指向被注册事件的DOM对象）。而在面向对象的程序中，我们更愿意将数据注册到实际对象的方法上，即我们希望this引用的是我们实际定义的某个对象，而这个对象也许并不等于实际处理事件的DOM对象。

在js中，这一点可以通过构造和传递“事件委托”的方式来实现。

```js
// 例13.11 利用闭包注册事件处理程序

var btn1 = document.getElementById('btn1');
// 为btn1添加click事件并且修正其中的this指针
btn1.addEventListener('click', function() { return (function(){
  alert(this.tagName)
}).call(btn1); }, true);
```

##### 13.3.4 事件模块和事件类型

在标准事件模型中，Event其实只是事件处理模型中的基础接口，它只描述用于基本事件处理的API。对特定类型的事件的支持交由子模块去具体实现。每个子模块提供处理某类相关事件的对应接口。一个对象要作为事件处理函数，它就必须实现Event或Event子模块的接口。例如，MouseEvent事件对象就必须实现MouseEvent接口，这个接口提供的mousedown、mouseup、click和相关事件类型的支持。

##### 13.3.5 关于Event接口

Event对象必须实现Event接口或者子接口。这些接口声明了该种事件类型的详细信息。值得注意的是，这几个接口有相应的继承关系，其中Event接口是基础接口，UIEvent和Mutation和MutationEvent接口是它的子接口，而MouseEvent接口则是UIEvent接口的子接口。

1. Event接口的属性和方法

Event接口是事件模型的通用接口，这意味着所有支持标准事件模型的HTML节点都实现该接口（或该接口的子接口）。Event接口具有如下属性和方法：

|  属性和方法  | 说明  |
|  ----  | ----  |
|  type  | 只读字符串，指明发生事件的类型。该属性的值通常与注册事件处理程序时使用的字符串相同  |
|  target  | 只读属性，发生事件的节点  |
|  currentTarget  | 只读属性，事件当前传播到的节点  |
|  eventPhase  | 只读常量，枚举类型，指定了当前所处的事件传播阶段。可能的值包括Event.CAPTURE_PHASE、Event.AT_TARGET或Event.BUBBLEING_PHASE  |
|  timeStamp  | 只读属性，Date类型，事件发生的时间戳  |
|  bubbles  | 只读属性，布尔类型，声明该事件是否在文档中起泡  |
|  cancelable  | 只读属性，布尔类型，声明该事件是否能够取消默认动作  |
|  stopPropagation()  | 阻止当前事件从正在处理它的节点传播  |
|  preventDefault()  | 阻止默认动作的执行  |

2. UIEvent接口的属性

UIEvent接口是Event接口的子接口。UIEvent在Event接口的基础上定义了两个新的属性：

|  属性和方法  | 说明  |
|  ----  | ----  |
|  view  | 只读属性，发生事件的Window对象  |
|  detail  | 只读属性，提供事件的额外信息  |

3. MouseEvent接口的属性

MouseEvent接口是UIEvent接口的子接口，它在UIEvent接口的基础上来定义了下列属性：

|  属性和方法  | 说明  |
|  ----  | ----  |
|  button  | 只读属性，数值，声明在mousedown、mouseup和click事件中，哪个鼠标键改变了状态，0表示左键，2表示右键  |
|  altKey、ctrlKey、metaKey和shiftKey  | 只读属性，布尔值，分别声明在鼠标事件发生时是否按下了Alt键、Ctrl键、Meta键或Shift键  |
|  clientX、clientY  | 只读属性，数值，声明了事件发生时鼠标指针相对于客户区或浏览器窗口左上角的x坐标和y坐标  |
|  screenX、screenY  | 只读属性，数值，声明了事件发生时鼠标指针相对于用户显示器左上角的x坐标和y坐标  |
|  relatedTarget  | 只读属性，引用与事件的目标节点相关的节点。对于mouseover事件来说，它是鼠标移动目标上时所离开的那个节点，对于mouseout事件来说，它是离开目标时鼠标进入的那个节点 |

> clientX、clientY在许多交互应用中非常有用，但是要注意它们是相对窗口而不是相对于文档的，如果文档发生了滚动，要把窗口坐标相应地换算成文档位置的坐标。具体方法是，在Netscape中，加上window.pageXOffset和window.pageYOffset，在InternetExplorer中，加上document.body.scrollLeft和document.body.scrollTop。


4. MutationEvent接口
MutationEvent接口是Event接口的子接口，它通常处理与文档结构相关的事件而不是与文档内容相关的事件。

##### 13.3.6 混合事件模型

标准模型向后兼容简单模型，这意味着你可以在页面文档中使用混合事件模型。不过需要注意的是两种事件模型在浏览器实现中相互独立，尽管作用相同，但并不意味着后一种就能够把前一种注册的事件删除。

##### 13.3.7 合成事件
2级DOM标准允许事件被程序生成并分派给相应的文档元素，以模拟用户交互，用于回归测试等特殊场合。事件的创建、初始化和分配是由createEvent()、initEvent()和dispatchEvent()等一系列复杂的API完成的。不过遗憾的是，到目前为止似乎没有任何一个浏览器实现了这些API。

#### 13.5 回调与用户自定义事件


## 第四部分 数据交互
433
### 第16章 同步和异步
#### 16.1 什么是同步和异步
所谓同步和异步，是指两种不同的程序执行方式。在同步方式下，代码是按照某种确定的次序执行的，通常我们可以通过代码定义和调用的位置来明确判断出代码执行的次序。在js中，函数内部的代码是同步执行的。

在异步方式下，代码的执行不再是简单地按照次序进行，而是要等待某个特定条件的触发。

#### 16.3 定时器使用———侦听与拦截

#### 16.3.2 使用定时器时应该注意的问题
定时器应用的时候，setTimeout、setInterval的第一个参数都接受字符串或闭包。一般情况下，用字符串要比用闭包的效率低，因此尽量避免使用。需要注意的是同步和异步的时序。

```js
// 错误的代码
// 开发人员的本意应该是每隔100毫秒将i的值加1输出，然而这段代码并不能达到上述目的，
// 因为i的值在循环中添加，这个一个同步时序，它在计时器事件被调用前就已经发生了，最终计时器得到的结果是循环后的i值，也就是5次alert显示出的结果是5
function test () {
  for (var i = 0; i < 5; i++) {
    setTimeout(function() {alert(i)}, 100);
  }
}


// 正确的代码A
// 第二段代码，采用了拼接字符串的方式来调用计时器
// 由于i在字符串中被替换成了当前循环时的实际常量值，所以得到了正确的结果
function test() {
  for (var i = 0; i < 5; i++) {
    setTimeout('alert(' + i + ')', 100);
  }
}


// 正确的代码B
// 比字符串更好的模式是通过闭包，
// 这段代码开发人员通过闭包嵌套和不同时序的执行，巧妙得到了正确的结果，并且比第二段代码更具效率和通用性
function test() {
  for (var i = 0; i < 5; i++) {
    (function(i) {
      setTimeout(function(){ alert(i) }, 100);
    })(i);
  }
}
```


### 第20章
499
#### 20.4 同源策略
同源策略是一道有效的防线，它从一定程度上保护了用户的信息安全。所谓同源策略指的值脚本只能读取与它位于同一个域和同一个端口的或文档的属性。

对于某些对象来说，非同源访问并不一定被完全禁止，而是有可能受到一定的限制。基本上我们可以认为所有的客户端对象的基本属性对非同源脚本有限制。只有某些特定的属性例如script除外。巧妙利用这一点可以在某些特定的情况下突破同源策略的限制。

同源策略的利弊：它的存在使得用户的信息被有效的保护，（例如某个服务器上的隐私信息，除非用户愿意的情况下，将不会被另外某个域上的恶意脚本窃为己有或者发往其他任何一个地方）； 但是在某些情况下，完全的同源策略太过严格，所以js允许修改Document对象的domain属性为它的资源，这从一定程度上放宽了同源策略的限制，然而有时候也不能满足我们某些特定的跨域访问需求。

有趣的是，利用`<script>`的跨域访问特性，对于某些需要跨域访问的特定资源，我们可以通过将它们写为脚本的方式来试下一定程度上的跨域访问。

```html
<!--  不论在任何域中，都能通过以下脚本获得51js的js文件。 -->
<script>
// 创建一个script标记
script = document.createElement('script');
// 指向http:/www.51js.com/outerData/data.js
script.src = 'http:/www.51js.com/outerData/data.js';
// 将script标记添加到body，系统会去寻找并装载data.js
documet.body.appendChild(script);
</script>

```




## 第五部分 超越JavaScript
517

### 第21章 面向对象
在这一章里，我会试图向你阐述面向对象的思想本质及隐藏在各种表象下的深层规律。需要注意的是，面向对象只是过程化程序设计方法的一个层次，它是目前我们所知的一种比较高级的过程化境界（但不是最高的），面向对象的代码有较好的组织结构和重用性，从而适用于比较大型的应用程序开发中。面向对象是一种思想而不是一种固定的套路，请牢记这一点以免自己陷入不必要的思维定势中去。

#### 21.1 什么面向对象
> 面向对象的三大特点（封装、延展、多态）缺一不可。通常“基于对象”是使用对象，但是不一定支持利用现有的对象模版产生新的对象类型，继而产生新的对象，也就是说“基于对象”不要求拥有继承的特点。而“多态”表示为父类类型的子类对象实例，没有了继承的概念也就无从谈论“多态”。现在的很多流行技术都是基于对象的（例如DOM），它们使用一些封装好的对象，调用对象的方法，设置对象的属性。但是它们没法让程序员派生新对象类型。他们只能使用现有对象的方法和属性。所以当你判断一个新的技术否是是面向对象的时候，通常可以使用后两个特性来加以判断。“面向对象”和“基于对象”都实现了“封装”的概念，而是面向对象实现了“继承和多态”，而“基于对象”可以不实现那些。<br />通常情况下，面向对象的语言一定是基于对象的，而反之则不成立。

从本质上说，面向对象既是一种思想，也是一种技术，它是过程式程序设计的一个高级层次。面向对象思想利用对问题的高度抽象来提升代码的可重用性，从而提高生产力。尤其是在较为复杂的规模较大的的系统实现中，面向对象通常比传统的过程式的优势就更加凸显。可以说，是软件产业化最终促进了面向对象技术的产生和发展。
##### 21.1.1 类和对象

```js
// 例21.1 对象的三种基本构造法

// 第一种构造法：new Object
var a = new Object();
a.x = 1, a.y = 2;

// 第二种构造法，对象直接量
var b = { x: 1, y : 2 };

// 第三种构造法：定义类型
function Point(x, y) {
  this.x = x;
  this.y = y;
}
var p = new Point(1, 2);
```

比较有趣的是第三种方法，p1和p2是同一种类型，它们都是Point的实例。而对于p1和p2来说，Point是它们的“类”，p1、p2和Point之间的关系是创建与被创建的关系，这种关系是面向对象中最重要的一种关系，它是“泛化”关系的一个特例。

##### 21.1.2 共有和私有————属性的封装
封装性是面向对象的一个重要特性。所谓的封装，指的是属性或方法可以被声明为公有或私有。只有公有的属性或方法才可以被外部环境感知和访问。曾经有人说js不具备封装性，它的对象的属性和方法都是共有的，其实，持这个观点的人只看到了js函数的对象特征，而忽视了js函数的另一个特征————闭包。

利用闭包，js不但有公有和私有的特性，而且它的公有和私有性，比起其他各种面向对象语言毫不逊色。

```js
// 例21.2 对象的公有和私有特性
function List() {
  var m_elements = []; // 私有成员，在对象外没法访问

  m_elements = Array.apply(m_elements, arguments);

  // 公有属性，可以通过"."运算符或下标来访问
  this.length = {
    valueOf: function() {
      return m_elements.length;
    },
    toString: function() {
      return m_elements.length;
    }
  }

  this.toString = function() {
    return m_elements.toString();
  }

  this.add = function() {
    m_elements.push.apply(m_elements, arguments);
  }
}
```

上面定义了一个List类，该类接受一个参数列表，该列表中的成员为List的成员。m_elements是一个私有成员，在类的定义域外部是无法访问的。this.length、this.toString和this.add是公有成员，其中this.length是私有成员m_elements的length属性的getter，在外部我们可以通过对象名的"."运算符对这些属性进行访问。

> 对象的getter是一种特殊的属性。它形式上像是变量或者对象属性，但是它的值随着对象的某些参数改变而改变。在不支持getter的语言中，我们通常用`get<Name>`方法来代替getter，其实`<Name>`是getter的实际名字，这个用法产生的效果和getter等价，但是形式上不够简洁。ECMAScript v3不支持getter，但是可以用上面这种构造带有自定义valueOf和toString方法的对象来巧妙模拟getter。<br />对象的setter是另一个相对应的属性，它的作用是通过类似赋值的方式改变对象的某些参数或者状态，遗憾的是，ECMAScript v3不支持setter，并且目前为止也没有什么好的办法可以在js上模拟setter。要实现setter的效果，只要通过定义`set<Name>`来实现。

##### 21.1.3 属性和方法的类型
js里，对象的属性和方法支持4种不同的类型：
- 第一种类型就是前面说的私有类型，它的特点是对外界完全不具备访问性，要访问它们，只有通过特定的getter和setter。
- 第二种类型是动态的公有类型，它的特点是外界可以访问，而且每个对象实例持有一个副本，它们之间不会相互影响。
- 第三种类型是静态的公有类型，或者通常叫做原型属性，它的特点是每个对象实例共享唯一副本，对他的改写会相互影响。
- 第四种类型是类属性，它的特点是作为类型的属性而不是对象实例的属性，在没有构造对象时也能够访问。

```js
function myClass() {
  var p = 100; // private property 私有属性
  this.x = 10; // dynamic public property 动态公有属性
}

myClass.prototype.y = 20; // static public property or prototype property原型属性
myClass.z = 30; // static property静态属性

var a = new myClass();
dwn(a.p);  // undefined 私有属性对象无法访问到
dwn(a.x); // 10 公有属性
dwn(a.y); // 20 公有属性
a.x = 20;
a.y = 40;
dwn(a.x);  // 20
dwn(a.y); // 40 动态公有属性y覆盖了原型属性y
dwn(myClass.z); // 30 类属性应该通过类访问
```

#### 21.2 神奇的prototype
prototype对js的意义重大，它不仅仅是一种管理对象继承的机制，更是一种出色的设计思想。

##### 21.2.1 什么是prototype
**js中对象的prototype属性，可以返回对象类型原型的引用。**要理解这句话，先要正确理解对象类型type以及原型prototype的概念。对象的类class和对象实例instance之间是一种“创建”关系，因此我们把“类”看做是对象特征的模型化，而对象看做是类特征的具体化，或者说，类class是对象的一个类型type。

在面向对象领域里，实例与类型不是唯一的一对可描述的抽象关系，在js中，另外一种重要的抽象关系是类型type和原型prototype。这种关系是一种更高层次的抽象关系，它恰好和类型的抽象关系构成了一个三层的链。

<p align="center"><img src="./wzgl21_001.png" alt="wzgl21_001"></p>

要深入理解原型，可以研究关于它的一种设计模式————prototype pattern，这种模式的核心是用原型示例指定创建对象的种类，并且通过拷贝这些原型创建新的对象。

注意：原型模式要求一个类型在一个时刻只能有一个原型（而一个实例在一个时刻显然可以用多个类型）。对于js来说，这个限制有两层含义，第一是每个具体的js类型有且仅有一个原型prototype，在默认的情况下，该原型是一个Object对象。第二是，这个类型的实例的所有类型，必须是满足原型关系的类型链。

##### 21.2.2 prototype的使用技巧
js为每个类型type都提供了一个prototype属性，将这个属性指向一个对象，这个对象就成为了这个类型的“原型”，这意味着由这个类型所创建的所有对象都具有这个原型的特性。

1. 给原型对象添加属性：js的对象是动态的，原型也不例外，给prototype增加或者减少属性，将改变这个类型的原型，这种改变将直接作用到由这个原型创建的所有对象上。

2. 带默认值的Point对象：若给某个对象的类型的原型添加了某个名为a的属性，而这个对象本身又有一个名为a的同名属性，则在访问这个对象的属性a时，对象本身的属性覆盖了原型属性，但是原型属性并没有消失，当你用delete运算符将对象本身的属性a删除时，对象的原型属性就恢复了可见性。利用这个特性，可以为对象的属性设定默认值。

3. delete操作将对象属性恢复为默认值

4. 利用prototype巧设getter


```js
function Point(x, y) {
  if (x) this.x = x;
  if (y) this.y = y;
}

Point.prototype.x = 0;
Point.prototype.y = 0;

function LineSegment(p1, p2) {
  // 私有成员
  var m_firstPoint = p1;
  var m_lastPoint = p2;
  var m_width = {
    valueOf: function(){ return Math.abs(p1.x - p2.x) },
    toStringg: function() { return Math.abs(p1.y - p2.y) }
  }

  // getter
  this.getFirstPoint = function () {
    return m_firstPoint;
  }
  this.getLastPoint = function () {
    return m_lastPoint;
  }

  // 公有属性
  this.length = {
    valueOf: function() { return Math.sqrt(m_width * m_width + m_height * m_height) },
    toString: function() { return Math.sqrt(m_width * m_width + m_height * m_height) }
  }
}

// 构造p1 p2两个Point对象
var p1 = new Point;
var p2 = new Point(2, 3);
// 用p1、p2构造line1一个LineSegment对象
var line1 = new LineSegment(p1, p2);
// 取得line1的第一个端点(即p1)
var lp = line1.getFirstPoint();
// 不小心改写了lp的值，破坏了lp的原始值而且不可恢复
// 因此此时p1的x属性发生了变化
lp.x = 100;
alert(line1.getFirstPoint().x);
alert(line1.length); // 就连line1.length都发生了改变



// 将this.getFirstPoint()改写为下面这个样子，就可以避免这个问题，保证了m_firstPoint属性的可读性
this.getFirstPoint = function() {
  function GREET() {}; // 定义一个临时类型
  // 将m_firstPoint设为这个类型的原型
  GREET.prototype = m_firstPoint;
  // 构造有一个这个类型的对象返回
  return new GREET();
}
```

5. delete操作原型属性的可见性： 实际上，将一个对象设置为一个类型的原型，相当于通过实例化这个类型，为对象建立只读副本，在任何时候对副本进行改变，都不会影响到原始对象，而对原始对象进行改变，则会影响到每一个副本，除非被改变的属性应被副本自己的同名属性覆盖。用delete操作将对象自己的同名属性删除，则可以恢复原形属性的可见性。

6. 使用prototype创建大量副本：一般情况下，利用prototype来创建大量的复杂对象的副本，要比用其他任何方法来copy对象来得快。注意到，以一个对象为原型，来创建大量的新对象，这是prototype pattern的本质。

7. 使用prototype定义静态方法：除了以上作用，prototype更常见的用处是声明对象的方法。因为，在一般情况下，和属性相比，对象的方法不会轻易改变，正好利用prototype的静态特性来声明方法，这样避免了在构造函数中每次对方法进行重新赋值，节省了时间和空间。

> 小技巧：尽量采用prototype定义对象方法，除非该方法要访问对象的私有成员或者返回某些引用了构造函数上下文的闭包。

习惯上，我们把采用prototype定义的属性和方法称为静态属性和静态方法，或者原型属性和原型方法，把this定义的属性和方法称为公有属性和公有方法。

用“静态”两个字很好地诠释了prototype在数据存储上的特指，即所有的实例共享唯一的副本。

##### 21.2.3 prototype的实质及其范例
将一个属性添加为prototype的属性，这个属性将被该类型创建的所有实例所共享，但是这种共享是只读的。在任何一个实例中只能够用自己的同名属性覆盖这个属性，而不能够改变它。换句话说，对象在读取某个属性时，总是先检查自身域的属性表，如果有这个属性，则会返回这个属性，否则就去读取prototype域，返回prototype域上的属性。另外，js允许prototype域引用任何类型的对象，因此，如果对prototype与的读取依然没有找到这个属性，则js将递归地查找prototype域所指向对象的prototype域，直到这个对象的prototype域为它本身或者出现循环为止。

##### 21.2.4 prototype的价值与局限性
由于prototype仅仅是以对象为原型给类型构建副本，因此它也具有很大的局限性。首先，它在类型的prototype域上比不是表现为一种值拷贝，而是一种引用拷贝，这带来了“副作用”。改变某个原型上引用类型的属性的属性值，将会彻底影响到这个原型创建的每一个实例。


总之，prototype是一种面向对象的机制，它通过原型来管理类型与对象之间的关系，prototype的特点是能够以某个类型为原型构造大量的对象。以prototype机制来模拟的继承是一种原型继承，它是js多种继承实现方式中的一种。

#### 21.3 继承与多态
继承与多态是面向对象最重要的两个特征，js能用语言本身的特性来实现他们。

##### 21.3.1 什么是继承
若两个类都是同一个实例的类型，那么他们之间存在着某些关系，我们把同一个实例的类型之间的泛化关系称为“继承”。

一旦确定了两个类的继承关系，至少意味着三层含义：一是子类的实例可以共享父类的方法，二是子类可以覆盖父类的方法或者拓展新的方法，三是子类和父类都是的子类类型的“类型”。

##### 21.3.2 实现继承的方法
从上一小节我们知道，要实现继承，其实就是要实现上面所说的三层含义。

```js
/**
* 第一种方法：构造继承法
* 这种继承方法的形式是在子类中执行父类的构造函数。
*/
function Collection(size) {
  this.size = function() { return size }; // 公有方法，可以被继承
}

Collection.prototype.isEmpty = function() { return this.size() == 0 }

// 定义一个ArrayList类型，它“继承”Collection类型
function ArrayList() {
  var m_elements = []; // 私有成员，不能被继承
  m_elements = Array.apply(m_elements, arguments);

  // ArrayList类型继承Collection
  this.base = Collection;
  this.base.call(this, m_elements.length);

  this.add = function () {
    return m_elements.push.apply(m_elements, arguments);
  }

  this.toArray = function () {
    return m_elements;
  }
}

ArrayList.prototype.toString = function() {
  return this.toArray().toString();
}

// 定义一个SortedList类型，它继承ArrayList类型
function SortedList() {
  // SortedList类型继承ArrayList
  this.base = ArrayList;
  this.base.apply(this, arguments);

  this.sort = function () {
    var arr = this.toArray();
    arr.sort.apply(arr, arguments);
  }
}

// 构造一个ArrayList
var a = new ArrayList(1, 2, 3);
dwn(a);
dwn(a.size()); // a从Collection继承了size()方法
dwn(a.isEmpty); // 但是a没有继承到isEmpty()方法

// 构造一个SortedList
var b = new SortedList(3, 1, 2);
b.add(4, 0); //  b从ArrayList继承了add()方法
dwn(b.toArray()); //  b从ArrayList继承了toArray()方法
b.sort(); // b自己实现的sort()方法
dwn(b.toArray());
dwn(b);
dwn(b.size()); // b从Collection继承了size()方法

```

第一种方法中，类ArrayList继承了Collection，而类SortedList继承了ArrayList。注意到，这种继承关系是通过在子类中调用父类的构造函数来维护的。如，ArrayList中调用了this.base.call(this.base, m_members.length);，而SortedList中则调用了this.base.apply(this.base, arguments)。

注意到实际上构造继承法并不能满足继承的第三层含义，无论是a instanceof Collection 还是b instanceof ArrayList，返回值总是false。其实，这种继承方法除了通过调用父类构造函数将属性赋值到自身之外，并没有作其他任何的事情。严格来说，它甚至算不上继承。尽管如此用它的特性来模拟常规的对象继承，也已经基本上达到了我们预期的目标。这种方法的优点是简单和直观，而且可以自由的用参数执行父类的构造函数，通过执行多个父类构造函数方便地实现多重继承。缺点是主要是不能继承静态属性和方法，也不能满足所有父类都是子类实例的类型这个条件，这样对于实现多态将会造成麻烦。

```js
/**
* 2、第二种方法：原型继承法及其例子
* 原型继承法是js中最流行的一种继承方式。
* 基于原型编程是面向对象编程的一种特定形式。在这种基于原型的编程模型中，不是通过声明静态的类，而是通过复制已经存在的原型对象来实现行为重用。这个模型一般被称作是class-less，面向原型，或者是基于接口编程。
*/

function Point (dimension) {
  this.dimension = dimension;
}

// 定义一个Point2D类型，“继承”Point类型
function Point2D(x, y) {
  this.x = x;
  this.y = y;
}

Point2D.prototype.distance = function () {
  return Math.sqrt(this.x * this.x + this.y * this.y);
}
Point2D.prototype = new Point(2);  // Point2D继承了Point

// 定义一个Point3D类型，也继承Point类型
function Point3D(x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
}
Point3D.prototype = new Point(3); // Point3D也继承了Point

// 构造一个Point2D对象
var p1  = new Point2D(0, 0);
// 构造一个Point3D对象
var p2 = new Point3D(0, 1, 2);

dwn(p1.dimension);
dwn(p2.dimension);
dwn(p1 instanceof Point2D); // true
dwn(p1 instanceof Point);// true
dwn(p2 instanceof Point);// true

``` 

类型的原型可以构成一个原型链，这样就能实现多个层次的继承，继承链上的每一个对象都是实例的类型。同构造继承法相比，原型继承法的优点是结构更加简单，而且不需要每次构造都调用父类的构造函数，并且不需要通过复制属性的方式就能快速实现继承。但是它的缺点也是很明显的，首先它不方便支持多重继承，因为一个类型只能有一个原型；其次它不能很好地支持多参数和动态参数的父类构造，因为在原型继承的阶段你还不能决定以什么参数来实例化父类对象；第三是你被迫要在原型声明阶段实例化一个父类对象作为当前类型的原型，有的时候父类对象是不能也不应该随便实例化的；最后一个缺点你是之前提到过的prototype的“副作用”。

构造继承法和原型继承法各有一个明显的缺点前面并没有具体提到。由于构造继承法没有办法继承类型的静态方法，因此它没法很好地继承js的核心对象。而原型继承法虽然可以继承静态方法，但是依然无法很好地继承核心对象中的不可枚举方法。

```js
// 例 21.17 构造继承的局限性
function MyDate() {
  this.base = Date;
  this.base.apply(this, arguments);
}

var date = new MyDate();
alert(date.toGMTString); // 核心对象的某些方法不能被构造继承，原因是核心对象并不像我们自定义的一般对象那样在构造函数里进行复制或初始化操作



// 例21.18 原型继承的局限性
function MyDate() {}
MyDate.prototype = new Date();
var date = new MyDate();
alert(date.toGMTString); // 原型继承法可以获得基类的办法，当你尝试调用date对象的toString或toGMTString方法时，internet explorer抛出一个怪异的异常。

```

那么核心对象是不是就不能被继承呢？答案是否定的。下面要介绍的第三种方法，就是最好的继承核心对象的方法。


```js
/**
* 3、第三种方法：实例继承法及其例子
*/

function MyDate() {
  var instance = new Date(); // instance是一个新创建的日期对象
  instance.printDate = function() {
    document.write('<p>' + instance.toLocaleString() + '<p/>')
  } // 对instance扩展printDate()方法
  return instance; // 将instance作为构造函数的返回值返回
}

var myDate = new MyDate();
dwn(myDate.toGMTString());
myDate.printDate();
```

这次MyDate类型工作得很好，它继承了核心对象Date的方法。通常情况下要对js原生的核心对象或者DOM对象进行继承时，我们会采用这种继承方法。不过，它也有几个明显的缺点，首先，由于它需要在执行构造函数的时候构造基类的对象，而js的new运算与函数调用不同的是不能用apply()方法传递给它不确定的arguments集合，这样就会对那些可以接受不同类型和不同数量参数的类型的继承造成比较大的麻烦。

其次，从上面的例子可以看出，这种继承方式是通过在类型中构造对象并返回的方法来实现继承的，那样的话new运算的结果实际上是类型中构造的对象而不是类型本身创建的对象，alert(myDate instanceof MyDate);的执行结果将会是false，对象的构造函数将会是实际构造的对象的构造函数而不是类型本身的构造函数，尽管你可以通过赋值的方法修正它，但是你却无法修正instanceof表达式的结果，这不能不说是一个很大的遗憾。

第三，这种方法一次只能返回一个对象，它和原型继承法一样不能支持多重继承。

所以，我们的结论是，构造继承法也不是一种真正的继承法，它也是一种模拟。构造继承法是目前所知的唯一一种可以较好地继承js核心对象的继承法。当你要继承js的核心对象或者DOM对象时，可以考虑采用这种方法。


```js
/**
* 4、第四种 拷贝继承法及其例子
* 拷贝继承法就是通过对象属性的拷贝来实现继承，早期的prototype和其他一些框架在特定的情况下就用到了这种继承方法
*/
Function.prototype.extends = function(obj) {
  for (var each in obj) {
    this.prototype[each] = obj[each];
    // 对对象的属性进行一对一的赋值，但是它又慢又容易引起问题
    // 所以这种“继承”方式一般不推荐使用
  }
}

var Point2D = function() {
  // ...
}
Point2D.extends(new Point()) {
  // ...
}
```

拷贝继承法实际上是通过反射机制拷贝基类对象的所有可枚举属性和方法来模拟“继承”，因为可以拷贝任意数量的对象，因此它可以模拟多继承，又因为反射可以枚举对象的静态属性和方法，所以它同构造继承法相比的优点是可以继承父类的静态方法。但是由于是反射机制，因此拷贝继承法不能继承非枚举类方法，例如父类中重载的toString()方法，另外，拷贝继承法也有几个明显的缺点，首先是通过反射机制来复杂对象属性效率上非常低下。其次它也要构造对象，通常也不能很好地支持灵活的可变参数。第三，如果父类的静态属性中包含引用类型，它和原型继承法一样导致副作用。第四，当前类型如果有静态属性，这些属性可能会被父类的动态属性所覆盖。最后这种可支持多重继承的方式并不能清晰地描述出父类与子类的相关性。


以上几种几种继承法的比较：

|  比较项  | 构造继承  |  原型继承  | 实例继承  | 拷贝继承  |
|  ----  | ----  |  ----  | ----  | ----  |
|  静态属性继承  | N  |  Y  | Y  | Y  |
|  内置对象继承  | N  |  部分  | Y  | Y  |
|  多参多重继承  | Y  |  N  | Y  | N  |
|  执行效率  | 高  |  高  | 高  | 低  |
|  多继承    | Y  |  N  | N  | Y  |
|  instanceof | false  |  true  | false  | false  |

```js
/**
* 5、第五种：混合继承是将两种或者两种以上的继承同时使用，其中最常见的是构造继承和原型继承混合使用，这样能够解决构造函数多参多重继承的问题。
*/
function Point2D(x, y) {
  this.x = x;
  this.y = y;
}

function ColorPoint2D(x, y, c) {
  Point2D.call(this, x, y); // 这里是构造继承，调用了父类的构造函数
  this.color = c;
}
ColorPoint2D.prototype = new Point2D(); // 这里用了原型继承，让ColorPoint2D以Point2D对象为原型
```

另外，在模拟多继承的时候，原型继承和部分条件下的拷贝继承的同时使用也较常见。


##### 21.3.3 单继承与多重继承

在面向对象中，继承一般分为单继承和多重继承两种模式。其中单继承模式比较简单，类型有且仅有一个父亲，之前我们见过的例子都是单继承。而多重继承是一种比较复杂的模式，它允许一个类型拥有任意多个付清。并不是所有的面向对象语言都支持多重继承。

在现实生活中，一些事物往往会拥有两个或者两个以上事物的特性，用面向对象思想来描述这些事物，其中一种常用模式就是多重继承。举个例子，交通工具类可以派生出汽车和船两个子类，但拥有汽车和船共同特性水陆两用汽车就可以继承来自汽车类与船类的共同属性。

js的原型继承机制显然不支持多重继承，但是，我们用其他模拟继承方法，特别是拷贝继承，是可以实现js的多重继承的。

> 对象中并不是所有的事物泛型都只能用继承这样的关系来描述。前面也已经说过，继承关系只是泛化关系的一种类型，除此以外，创建关系、原型关系以及前面没有提到过的聚合关系和组合关系，都是泛化关系中的类型。“泛型”的概念是很广义的。通常我们用继承、聚合和组合来描述事物的名词特性，而用原型、元类等其他概念来描述事物的形容词特性。在本章的最后两个小节里，我们有机会讨论面向对象设计建模的一些高级话题。

##### 21.3.4 接口及其实现
在面向对象领域，“接口”是一个重要的概念，它是一种纯抽象的定义。我们通常所说的接口是指那些并没有具体实现，只是定义出“原型”的类型。在js中，prototype既是“原型”，也具有接口的特征。

```js
// 例21.23 实现接口
IPoint = { x: undefined, y: undefined }
var Point = {}
Point.prototype = new IPoint();
var p = new Point();
for (var each in p) {
  alert(each); // 包含有属性x和y，因为Point实现了IPoint接口
}
```

##### 21.3.5 多态及其实现
在面向对象中，一个实例可以拥有多个类型，在实际程序计算中，它既可以被当成是这种类型，又可以被当成是那种类型。这样的特性，我们称之为“多态”。面向对象的继承和js的原型都可以用来实现“多态”。

```js
// 定义个Animal类型
function Animal() {
  this.bite = function() {
    dwn('animal bite!');
  }
}

// 定义一个Cat类型，继承Animal类型
function Cat() {
  this.bite = function () {
    dwn('cat bite!');
  }
}
Cat.prototype = new Animal();

// 定义一个Dog类型，继承Animal类型
function Dog () {
  this.bite = function() {
    dwn('dog bite!');
  }
}

// 定义一个AnimalBite多态方法
function AnimalBite(animal) {
  if (animal instanceof Animal)
    animal.bite(); // Cat bit or dog bite
}

var cat = new Cat();
var dog = new Dog();

// Cat和Dog都是Animal，AnimalBite是一个多态函数
AnimalBite(cat);
AnimalBite(dog);
```

在上面的例子中，我们说AnimalBite()是一个多态方法，它接受Animal类型的参数，对于Cat和Dog两个类型，它实际上执行了不同的bite方法。

实际上js是天生多态的弱类型语言，最简单的“多态”函数如下：

```js
// 例21.26 最简单的“多态”函数
function add(x, y) {
  return x + y;
}
add(10, 20);
add('a', 'b');
```


#### 21.4 构造与析构
构造与析构指的是创建于销毁对象的过程，它们都是对象生命周期中最重要的环节之一。


##### 21.4.1 构造函数

构造函数是面向对象的一个特征，它是在对象被构造时运行的函数。在C++等静态语言中，对象的结构是在声明时被固化的，构造函数的作用只是进行某些必要的初始化工作。而在js中，new操作符作用的函数对象就是类型的构造函数。由于js的动态特性，理论上将，js的构造函数可以做任何实行，轻易地改变对象的结构。

js中，对象的contructor属性总是引用对象的构造函数。

```js
// 例21.27 (1)构造函数
function Point(x, y) {
  this.x = x || 0;
  this.y = y || 0;
}
var p = new Point();
alert(p.constructor);
```

不过需要注意的是，在构造函数拥有引用类型返回值的时候，真正的对象是被返回的那个对象，从这一点来看，constructor属性似乎违反了前面的原则，然而事实上，由于对象的返回值替代了new操作符返回的对象本身，因此实际的constructor值返回的是被构造的对象。若你要对其进行修正，让constructor看起来像是“类型”本身，那么直接对constructor属性进行复制即可。

```js
// 例21.27 （2）改写constructor
function ArrayList() {
  var ret = new Array();
  ret.constructor = this.constructor;
  // 改写constructor可以让实例继承的对象的constructor属性值显得稍稍“正常”一些
  return ret;
}
```

##### 21.4.2 多重构造
多重构造是指在面向对象的继承中，子类构造函数和父类构造函数的依赖关系。一般来说，在面向对象的语言中，子类被构造时，总是先依次执行祖先类的构造函数，再执行子类构造函数本身，不过js本身并没有这样的文法特性。

> 还记得之前提到过，js的对象机制严格来说并不是class-based的而是prototype-based，所以所谓的继承和构造可以理解成一种“近似”。严格来说，甚至可以不认为js拥有class-based的语言所具有的完备的继承机制和构造函数。

js不具有这样的文法特性，并不意味着js不能实现多重构造，下面这段构造继承的例子就很完美地诠释了js的多重构造：

```js
// 定义一个Point类型
function Point(dimension) {
  this.dimension = dimension || 0;
  this.isRegular = function () {
    this.dimension > 0;
  }
}

// 定义Point2D类型，继承Point类型
function Point2D(x, y) {
  Point.call(this, 2);
  var ponds = [];
  this.ponds.push(x, y);
  this.x = {
    valueOf: function () { return this.ponds[0] },
    toString: function () { return this.ponds[0] }
  };

  this.y = {
    valueOf: function () { return this.ponds[1] },
    toString: function () { return this.ponds[1] }
  };
}

// 构造ColorPoint2D时将执行Point2D.call()，这导致Point2D的构造，而Point2D构造时，再执行Point的构造，这种从对象自身的构造开始依次执行父类构造函数的过程，就叫做“多重构造”

function ColorPoint2D(x, y, c) {
  Point2D.call(this, x, y);
  this.color = c;
}
```

另外，有不少人习惯于在声明对象时将构造函数抽象出来，这不仅可以更加灵活地控制对象的构造，还可以在原型继承时比较有力地支持构造函数的“多态”。

```js
// 例21.29 抽象出构造函数
function Point2D(x, y) {
  // _init是Point2D类型的构造函数
  function _init(x, y) {
    this.x = x;
    this.y = y;
  }

  if (x != null && y != null)
    _init.call(this, x, y);
}

// 这个例子里将构造函数抽象成了_init()方法，这样更加灵活便于控制

// 定义ColorPoint2D类型，继承Point2D类型
function ColorPoint2D (x, y, c) {
  // _init是ColorPoint2D类型的构造函数
  function _init (x, y, c) {
    Point2D.call(this, x, y);
    this.color = c;
  }

  if (x != null && y != null && c!= null)
    _init.call(this, x, y, c);
}

```

##### 21.4.3 析造
在面向对象的概念中，析构是指销毁对象时执行的动作，默认的析构是由语言环境本身提供的，而某些语言如C++允许用户自己定制的析构过程，这个过程被作为对象的一个特殊的方法，称为“析构函数”。

js显然不对对象的析构从文法上进行支持，不过，同构造一样，我们可以漂亮地抽象出整个对象析构的过程，并利用它来进行必要的析构操作。这些操作通常包括清除对象内部的引用、回收资源、避免资源的循环引用所引起内存泄露等等。

```js
// 例21.30 析构

var Disposable = {
  dispose: function () {
    // 遍历并回收对象的每一个属性，注意这里递归检查dispose()
    for (var each in this) {
      if (this[each] instanceof Disposable) {
        this[each].dispose();
      }
      this[each] = null;
    }
  }
}

function Point() {
  // ...
}

// 通过原型“继承”的方式给Point类型的对象dispose()方法
Point.prototype = Disposable;
```

> 在很多情况下，对象的析构能够用较小的代码充分地释放资源，大大提高js的空间效率，比较有效地避免内存泄露，然而要注意的是，显然析构函数本身的执行会带来额外的时间开销，因此在做出选择时要仔细地权衡利弊，不过在析构函数在许多对空间要求相对严格的应用中会显得很有用。一些应用框架提供了对析构函数的支持，而它们也往往支持配置环境选择是否启用对象的析构特征，从而增加更大的自由度，让程序员在面对问题时能够从时间和空间的角度进行自由选择。

#### 21.5 疑团！“this”迷宫
js的“this”引用容易让人困扰，因为它的行为方式和其他任何一种面向对象语言的“this”完全不同。

##### 21.5.1 无数个陷阱————令人困扰的“this”谜团

###### 21.5.1.1 this代词的运用

首先，不一定只有对象方法的上下文中才有this这个代词，在js中，全局函数调用和其他的几种不同的上下文中也都有this代词。例如，

```js
// 例21.32 几种不同上下文中的this代词
function Foo() {
  // 如果this引用的构造函数是arguments.callee引用的对象
  // 说明是通过new操作符执行的构造函数
  if (this.constructor == arguments.callee) {
    alert('Object Created');
  }
  // 如果this是window，那么是全局调用
  else if(this == window) {
    alert('Normal call');
  } else {
    // 否则是作为其他对象的方法来调用
    alert('called by' + this.constrtuctor);
  }
}

Foo();  // 全局函数调用中，this的值为window
Foo.call(new Object()); // 作为一个Object对象的成员方法来调用
new Foo(); // 被new操作符调用，执行对象构造

```

其次，js的一个函数可以作为任何一个“所有者”对象的方法来调用，具体的方式是采用Function.prototype.call() 或Function.prototype.apply()方法。

###### 21.5.1.2 this陷阱

第三，在js实现的继承里，不论何种方式，this指向的总是当前类型的方法，而不是它所在的类型的方法，换句话说，如果在子类中覆盖了父类的某个方法，那么父类中其他依赖于这个子类方法的方法也会发生改变。

```js
// 21.34 this"陷阱"
// 定义Base类型
function Base() {
  // Base 类型的公有方法Foo()
  this.Foo = function () {
    return 10;
  }
  // Base类型的公有方法Bar()
  this.Bar = function () {
    alert(this.Foo() + 10);
  }
}

// 定义Drivide类型，继承Base类型
function Drivide() {
  // Drivide类型的公有方法Foo()
  this.Foo  = function () {
    return 20;
  }
}

// 原型继承
Drivide.prototype = new Base();
// 构造一个Drivide对象
var d = new Drivide();
d.Bar(); // 得到30而不是20，d.Bar()的时候因为“this”引用的是Drivide类型的对象d，所以d.Bar()执行时调用的this.Foo()是Drivide类型中定义的Foo()，尽管Bar()在Drivide中并没有被重载
```

以上特点是基础库和框架设计中尤其要注意的问题，否则某个类库有可能会因为开发人员扩展了其基类改变派生类方法时无意中影响到了基类的其他方法，不过这个问题实际上通过将被依赖的方法间接公开的方式是可以避免的，例如：

```js
// 定义Base类型
function Base() {
  // 因为_Foo方法被其他方法依赖，因此定义成私有方法
  function _Foo () {
    return 10;
  }

  // Base类型的公有方法Foo()
  this.Foo = _Foo;

  // Base类型的公有方法Bar()
  this.Bar = function() {
    console.log(_Foo() + 10);
  }

}

// 定义Drivide类型，继承Base类型
function Drivide() {
}

Drivide.prototype.Foo = function () {
  return 20;
}
// 原型继承
Drivide.prototype = new Base();
// 构造一个Drivide对象
var d = new Drivide();
d.Bar(); // 这下得到了我们期望的结果20，因为这一次Bar依赖的是私有方法
```

###### 21.5.1.3 this代词的异步问题
更为“诡异”的是异步调用，例如，我们通过0级DOM或2级DOM的方式将方法注册为事件处理函数，结果发现“this”代词指向引发这个事件的对象，而不是指向被注册方法本身的对象，因此要让事件方法中的“this”代词正确指代当前对象，我们必须用第13章学过的将对象注册为事件方法的技巧。而另外一种异步机制————计时器，也存在类似的问题。

```js
// 例21.35 this代词的异步问题
var obj = {};
obj.foo = function() {
  alert(this == obj);
  alert(this == btn);
  alert(this == window);
}
btn.onclick = obj.foo;
// 这个问题还比较好理解，可以认为是btn.onclick()做实际调用
// 而复制只是将函数引用给了btn.onclick代理
btn.attachEvent('click', obj.foo);
// 而这也不对，而且this的值是window，怎么说也是一种遗憾
btn.attachEvent('click', function() {
  obj.foo.call(btn)
});
// 还得做这样的修正
setTimeout(obj.foo, 100);
// setTimeout也是一样的， this的值是window
```

##### 21.5.2 偷梁换柱————不好的使用习惯
在js中，this代词的复杂性很大程度上取决于使用方式。很显然，js具备有动态改变方法的“所有者”的能力，这个能力导致了运行时“this”指代结果的不确定性。

通常情况下，我们应当尽量避免将全局的函数或者闭包动态地作为不同类型对象的方法来使用，更不应该将声明为某种确定类型的方法的函数作为另一种类型的方法来调用。例如，以下两种写法都是不应该被推荐的：

```js
// 例21.36 不被推荐的写法
function add () {
  return this.a + this.b;
}
add.call({ a:1, b: 2 }); // 这种定义了一个函数然后作为某个具体对象方法进行调用的方式不被推荐

function Point(x, y) {
  this.dist = function () {
    return Math.sqrt(x * x + y * y);
  }
}
var p = new Point(1, 2);//将p.dist()作为p2的对象方法来用，也不被推荐
var p2 = new Point(2, 3);
p.dist.call(p2);
```

若确实需要让两个不同的类型共享一个或者一组方法，应当让它们具有同一个原型prototype，而不是将同一个方法交由这两个对象来各种执行。

```js
// 例21.37 共享prototype
// 定义一个共享的原型对象
var abPrototype = {
  a: null,
  b: null,
  add: function() { return this.a + this.b }
}

// 定义strCls类型
var strCls = function(a, b) {
  this.a = a;
  this.b = b;
}
// 利用原型，值得推荐的方式
strCls.prototype = new abPrototype();
// 定义numCls类型
var numCls = function(a, b) {
  this.a = a;
  this.b = b;
}
// numCls和strCls都以abPrototype为原型
numCls.prototype = new abPrototype();


var strcls = new strCls(1, 2);
var numcls = new numCls('a', 'b');
strcls.add();
numcls.add();
```

##### 21.5.3 异步调用————谁动了我的this
可以发现在异步调用中，this指针没有指向声明的类型的当前示例。有的时候很让人郁闷。我们可对其进行一些修正：

```js
btn.attachEvent('click', function() { obj.foo.call(btn) }); // 前面的例子中通过闭包修正this
```

##### 21.5.4 揭开真相————js的this本质

在js里，this代词与其说是指代对象实例，倒不如说是引用了当前调用的“所有者”。事实上，this代词可以看做是js函数调用或者闭包调用的上下文环境中的一个属性，它和arguments之类额上下文属性具有类似的特性。

那么，是什么造成了js的this和其他面向对象语言的this有那么大的差异呢？

js中，方法被作为对象属性，实际上是靠将函数实例赋值给对象属性或者原型来实现，这种实现方式无疑是灵活的，完全无法在声明时确定。而且js的函数可以有多个引用，理论上说，既可以作为这个对象的方法，也可以作为那个对象的方法，而且这种指派可以在运行时才确定。因此，js方法的灵活性注定了this指针只能在运行环境中动态的判定，甚至直到函数被调用才能最终确定，所以它才被设计成为了函数调用上下文的属性。

异步调用是一种特殊的情况，由于函数或者闭包是被指派给定时器或者事件代理的，直到定时器活动或者事件触发时相应方法才被调用，但是在这个异步的过程中，方法所属的对象可能发生任何事情，所以异步调用的方法不能依赖于它所属的对象，这样js中，对于这种异步调用，默认的this将不会引用这个方法在进行注册时所属的对象。尽管如此，我们仍然可以利用闭包的特性通过简单的方法来讲this“绑定”为正确的对象。

##### 21.5.5 苦难不再————利用闭包修正this引用

事实上，若你确保方法在声明后所有者不发生变化，你就可以利用闭包的特性将this静态地绑定到类型实例上。

```js
// 例21.38 修正this引用

function MyClass() {
  // 以下这种定义方式确保了this指针不被篡改
  var $point = this;
  $point.foo = function() {
    // 因为函数构造的时候会产生一个“闭包”
    // 所以在调用方法时，实际的$point总是指向构造时的this
    // 这样就避免了this的错误
    return $point.foo.apply($point, arguments)
  }
}
```

在著名框架prototype中，为Function.prototype提供了一个很有意思的bind方法，他的参数为一个对象，返回值是一个闭包，这个方法将调用bind的函数对象包装为一个闭包返回，调用这个闭包将始终以bind参数为所有者执行这个方法，它的实现原理（简化后）如下：

```js
// 例21.39 bind方法
Function.prototype.bind = function(owner) {
  // 原理同上一个例子一样，只是换了一种形式
  var $fun = this;
  return function() {
    $fun.apply(owner, arguments);
  }
}

// 构造一个foo对象
var foo = {};
// bind(foo)将foo.bar方法永久地绑定为foo的对象方法，甚至将它赋给别的类型作为对象方法也不会改变this引用至
foo.bar = (function(){
  alert(this == foo);
}).bind(foo);
// 用setTimeout异步调用foo.bar方法，在一般情况下，this的值本应该是window
// 但bind过之后，this==foo得到true
setTimeout(foo.bar, 100);
```

总之，js的this引用是基于上下午呢环境而不是基于对象所在类型的。

#### 21.6 包装对象
在这里我们再次谈论到这个第5章未讨论完的话题，关于值和引用，以及由此衍生出来的装箱、拆箱操作。

在程序设计领域，装箱（boxing）是指将值类型对象包装成对应的引用类型对象，这个包装而成的对象被称为值类型的包装对象。

相反的，拆箱（unboxing）是指将引用类型对象反过来转为对应的值类型对象，它是通过引用类型对象的valueOf()方法来实现的。

js抽象了类型的拆箱方法，调用任何对象的valueOf()方法的文义是求这个对象的值。对于自定义的对象，程序员可以自行定义它的valueOf()方法，并把它理解为对这个类型的对象的“拆箱”。

对象操作符“.”通常要求它的左值为引用类型，因此当对值类型变量进行此类操作时，将会自动发生“装箱”操作。

#### 21.7 元类，类的模版
元类和类模版是一些高级的抽象模式，用好它们，能更好的发挥js的力量。

##### 21.7.1 什么是元类
我们说，面向对象本质上是过程化方法的高级阶段，其目的还是为了重用代码。或者说，同过程化相比，面向对象是更高自己的抽象，它把相似的对象归为一个类型，描述的是一种通用的“泛化”关系。那么，更高的一个层次上，如果是相似的类呢？那又应该如何处理？

面向对象概念中从来不缺乏描述类与类之间相似性的机制，比如继承和接口、比如原型，但是js中有没有一种机制，可以描述类的“创建型”泛化关系呢？答案是有的，就是我们所说的“元类”。

所谓元类，是一种特殊的类，它的作用是构造一组类，这组类都具有同样的特征。元类和类的关系就像类和对象的关系一样，是一种创建型的泛化关系。

> 在具体应用中，我们可以把接受类型参数的类型，即操作类型的类型，统归为元类。元类和一般的类型的最大区别是，一般的类型操作的是具体的数据，而元类操作的是某种类型本身。因此，从关系上来讲，Function就是一个元类，它是由js语言本身提供的。

但是，从Function的实现角度来讲，它又不适合作为创造类的元类，因为它的构造方法十分繁琐，是通过字符串来直接生成函数的，例如：

```js
new Function('this.x = x;this.y = y; return;');
```

于是我们考虑其他方式，还是回想第7章的那个规则————“构造函数通常没有返回值，它们只是初始化由this值传递进来的对象，并且什么也不返回。如果函数有返回值，被返回的对象就成了new表达式的值”————若我们在构造函数里返回一个函数或者闭包，那么会怎么样？答案是令人吃惊的，那样我们就创建了一个用来构造累的类，也就是我们所说的“元类”。

```js
// 例21.42
// 定义一个SingletonException异常
function SingletonException (type) {
  type = type || '';
  this.message = '单例类型' + type + '不能实例化！';
  
}

SingletonException.prototype =  new Error();

var defaultTimeout = 300;

function Singleton(type, name) {
  // 利用闭包构造一个Singleton类型返回
  // 该类型遵循“单例”模式，不能构建新的实例
  name = name || 'SingleClass';
  var ins  = new type();

  // SingletonClass
  var SingletonClass = function() {
    throw new SingletonException(name);
  }
  // single方法返回SingletonClass类型的单一实例
  SingletonClass.single = function() {
    return ins;
  }
  SingletonClass.name = name;
  return SingletonClass;
}


// 创建一个叫做SessionFactory的单例类型
var SessionFactory = new Singleton(
  function() {
    this.timeout = defaultTimeout;

    this.startTransation = function() {};
    this.closeTransation = function() {};
  }, 'SessionFactory'
);

// 通过single()方法获得唯一实例
var mySession = SessionFactory.single();

dwn(mySession);

try{
  var test = new SessionFactory();
} catcg(ex) {
  dwn(ex.message);
}

```

在上面的例子，我们创建了一个叫做Singleton的元类，它抽象的是一种设计模式，我们用它来构造了类SessionFactory，它遵循了单例模式，因此不允许被实例化，当我们尝试去实例化它时，系统就报告了异常。

##### 21.7.3 为什么要用元类
单纯从上面的例子看，似乎使用元类的理由还不够充分，但是仔细思考一下，当你使用元类思想处理一些足够复杂的问题时，它带来好处就显而易见了，你可以像普通对象一样继承你的类，你也可以给你的元类指定原型，元类的额静态方法对应于对象的类方法，必要的时候你可以派生系列的类（而不是对象），再用这些类去创造形形色色的对象。总而言之，元类思想提升了你抽象建模的能力，它是一种非常强大的高层次的抽象方法，下面的小节里，通过一些稍微复杂的例子演示这种思想能够的创造的奇迹。

##### 21.7.4 类工厂
工厂模式是一种历史悠久的设计模式，用js高度抽象实现的“类工厂”能够用简洁的形式实现各种复杂的功能。

类工厂是一种模式，它的原理是由一个或一组“元类”，创造出符合需求的类型，这是一种基于元数据的抽象，或者说，一种比普通的面向对象更加高级的抽象。

如果一组类型之间，有更加广义的关联关系，我们则需要更加灵活的创建方式，来描述他们之间的关系，这种关系，就是“工厂”。

> 严格来说，“继承”、“接口”和“原型”都是特殊的工厂，他们本质上都可以表现为创建型的模式，从这一点上来说，他们只是“工厂”的特例。


#### 21.8 谁才是造物主
这一节将帮助你从设计准则的高度上去理解js面向对象、元类和其他一些抽象思想的意义和价值。

##### 21.8.1 万物适用的准则
语言本身只是一种辅助工具，而程序设计思想的本源也是抽象。从过程到对象，从函数到类到元类再到泛型，其区别也只是抽象程度的不同。

真正的程序大师希望发现“万物适用的准则”，那时候，或许一行代码，能解决所有问题，亘古不变。那，就是“道”。


##### 21.8.2 抽象的极致————一个抽象模式的例子
代码的可重用性有多高？模型的通用性有多强？取决于你建模的深入程度，那是设计的技巧，js本身没有限制，只要你运用去繁存简的准则，发挥思维的力量，你就能让自己的代码接近抽象的极致。

```js
// 例21.43 抽象模式

```

##### 21.8.3 返璞归真，同源架构
数学领域有这样一种说法，一个系统的“公设”越少，这个系统就越稳定，程序语言和系统架构也是如此。如果一种语言的规则和约定越少，那么它就越发精美而巧妙。同样，如果一个系统架构，额外的约束和假设越少，那么这个架构就越发稳定和强大。

“同源”架构（第26章），是指只拥有极少数规则的系统架构，在此基础上，不做额外的约定，那么这种结构就会显得尤为强大而稳定。

正因为受到“同源思想”的影响，所以我坚持认为js的本质上唯一“真实”的是prototype-based的面向对象，所谓的“继承”和“接口”只是模拟出来的一种“变化”，真正的本质只有一个，那就是“原型”。

在js中，一切核心对象都以“Object”对象实例为原型，这是一种“同源架构”，你可以在其上构建出自己的类型，并生成该类型的对象，最后（如果需要的话）再将自定义类型的对象作为其他类型的原型，这样就能构造出形形色色的，具有不同功能的类型和对象。这，就是js的类型和对象的本质，是js的基本语言特征。用好了它，就用好了js。


#### 21.9 总结

### 第22章 闭包与函数式编程
576
#### 22.1 动态语言与闭包
#### 22.2 闭包的特点与形式
#### 22.3 不闭合使用闭包的场合
#### 22.4 函数式编程
#### 22.5 闭包与面向对象
#### 22.6 Python风格的JavaScript代码
#### 22.7 总结


