(function (root) {
    "use strict";

    var // 存放生成的Callbacks实例数据字典
        callbacksList = {},
        // 存放Callbacks返回实例与名字的映射关系
        callbacksMap = {},
        // Callbacks实例的id
        callbackId = 1;

    /**
     * 回调列表
     * @class Callbacks
     * @param {String|Object} [name] 回调列表的名称或是回调列表的选项
     * @param {Object} [options] 替换当前命名空间数据实体
     * @param options.chain 指定回调列表为链式回调，链式回调内的函数接收的参数为上一个回调的返回值
     * @param options.unique 指定回调队列内的函数是否为唯一
     */
    function Callbacks(name, options) {
        // 初始化参数
        if (typeof name === 'object') {
            options = name;
            name = null;
        } else if (!options) {
            options = {};
        }

        var // 记录当前回调队列是否已经执行过
            fired = false,
        // 缓存回调队列长度
        // 长度在add调用时和调用remove的队列执行完成之后重新获取
            fireLength,
        // 遍历当前回调列表的位置
            fireIndex,
        // 当前回调队列是否正在执行
            firing,
        // 当前回调队列如果存在多层嵌套执行
        // 保存执行队列的现场
            fireQueue = [],
        // 当前Callbacks实例的id
            id,
        // 当前Callbacks是否已经被锁定
            locked = false,
        // 存储当前Callbacks的回调函数列表
            list = [],
        // 是否停止运行当前fire的回调列表
            stop,

        // options:

        // 是否链式传递返回值
        // 开启时fire，fireWith传入的参数只会在第一个回调内调用
        // 之后的回调会以上一个回调返回的值作为参数
            chain = options.chain,

        // 队列内的函数是否为唯一
            unique = options.unique,

        // 初始化函数
        // 初始化函数只会在第一次新建Callbacks实例时会调用
            init = options.init;



        // 根据传入的name获取或生成当前Callbacks实例id
        if (name) {
            id = callbacksMap[name];
            if (!id) {
                id = callbacksMap[name] = ++callbackId;
                init && init();
            }
        } else { // 生成匿名Callbacks实例id
            id = ++callbackId;
        }

        // 获取或生成当前Callbacks实例并返回
        return callbacksList[id] || (callbacksList[id] = {
                /**
                 * 向回调队列内添加一个或多个回调函数
                 * @name Callbacks#add
                 * @function
                 * @param {...Function} callbacks 添加的回调
                 * @example
                 *
                 * // 创建一个回调列表
                 * var callbacks = Callbacks();
                 *
                 * // 向回调列表添加回调函数
                 * callbacks.add(function () {
                 *     console.log('A');
                 * });
                 *
                 * callbacks.fire();
                 * // => logs 'A'
                 *
                 * callbacks.add(function () {
                 *     console.log(''B);
                 * });
                 *
                 * callbacks.fire();
                 * // => logs
                 * // 'A'
                 * // 'B'
                 */
                add: function (callbacks) {
                    var index = 0,
                        callback,
                        args = [].slice.call(arguments);

                    if (unique) {
                        while (callback = args[index]) {
                            if (list.indexOf(callback) === -1) {
                                list.push(callback);
                            }

                            index++;
                        }
                    } else {
                        list.push.apply(list, args);
                    }

                    // 添加回调之后重新获取列表长度
                    fireLength = list.length;

                    return this;
                },

                /**
                 * 使用给定的参数调用回调列表
                 * @name Callbacks#fire
                 * @function
                 * @param {...*} args 传入到回调列表中的参数或者参数列表
                 * @example
                 *
                 * // 创建一个普通的回调列表
                 * var callbacks = Callbacks();
                 * callbacks.add(function (foo, bar) {
                 *     console.log(foo + ' ' + bar);
                 * });
                 *
                 * //
                 * callbacks.fire('hello', 'world');
                 * // => logs
                 * // hello world
                 *
                 *
                 * // 创建一个链式传值的回调列表
                 * var chain = Callbcaks({
                 *     chain: true
                 * });
                 *
                 * // 使用fire传入的参数只会传到第一个回调函数内
                 * chain.add(function (value) {
                 *     return value + 2;
                 * });
                 *
                 * // 后面的回调接收到的参数为上一个回调函数的返回值
                 * chain.add(function (prev) {
                 *     // prev 等于 value + 2 : 1
                 *     console.log(prev);
                 * });
                 * // => logs
                 * // 3
                 *
                 * // 链式传值的回调列表只会将fire的传入的一个参数传入回调列表中第一个回调函数内
                 * // 后面的回调函数接收的参数为上一个回调函数的返回值
                 * chain.fire(1);
                 */
                fire: function (args) {
                    this.fireWith.apply(this, arguments);
                    return this;
                },

                /**
                 * 使用 `that` 作为上下文调用回调列表
                 * 并将后面的参数作为回调列表的参数传入
                 * @name Callbacks#fireWith
                 * @function
                 * @param {*} that 调用回调函数的上下文
                 * @param {...*} pipe 传入到回调列表中的参数或者参数列表
                 * @example
                 *
                 * var callbacks = Callbacks();
                 *
                 * callbacks.add(function (lastName) {
                 *     console.log(this.name + ' ' + lastName);
                 * });
                 *
                 * callbacks.fireWith("Harry", "Potter");
                 * // => logs
                 * // Harry Potter
                 */
                fireWith: function (that, pipe) {
                    var callback;

                    if (!locked && !stop) {

                        if (firing) {
                            // 存储上当前运行
                            fireQueue.push(fireIndex);
                        }

                        fireIndex = 0;
                        firing = fired = true;

                        for (; fireIndex < fireLength; fireIndex++) {
                            callback = list[fireIndex];

                            // 是否以链式返回作为参数传入
                            if (chain) {
                                pipe = callback.call(that, pipe);
                            } else {
                                callback.apply(callback, arguments);
                            }

                            if (locked || stop) {
                                fireQueue = [];
                                break;
                            }
                        }

                        if (fireQueue.length) {
                            // 还原fireIndex
                            fireIndex = fireQueue.pop();
                        } else {
                            // 全部回调队列执行完成
                            stop = firing = false;
                        }
                    }

                    return this;
                },

                /**
                 * 判断回调列表是否被执行过
                 * @name Callbacks#fired
                 * @function
                 * @returns {boolean}
                 * @example
                 *
                 * var callbacks = Callbacks();
                 *
                 * console.log(callbacks.fired());
                 * // => logs
                 * // false
                 *
                 * callbacks.fire();
                 *
                 * console.log(callbacks.fired());
                 * // => logs
                 * // true
                 */
                fired: function () {
                    return fired;
                },

                /**
                 * 清空当前回调列表
                 * 移除回调列表中所有的回调函数
                 * @name Callbacks#empty
                 * @function
                 * @example
                 *
                 * var callbacks = Callbacks();
                 *
                 * callbacks.add(function () {
                 *     console.log('A');
                 * });
                 *
                 * // 移除回调列表中所有的回调函数
                 * callbacks.empty();
                 *
                 * callbacks.fire();
                 * // 回调列表被清空，不会执行任何回调列表
                 */
                empty: function () {
                    list = [];
                    fireQueue = [];
                    fireLength = fireIndex = 0;

                    if (firing) {
                        stop = true;
                    }

                    return this;
                },

                /**
                 * 废弃该回调列表
                 * 被废弃的回调列表不能被调用
                 * @name Callbacks#disable
                 * @function
                 * @example
                 *
                 * var callbacks = Callbacks();
                 * callbacks.add(function () {
                 *     console.log('A');
                 * });
                 *
                 * callbacks.disable();
                 * callbacks.fire();
                 * // 回调列表不会再被调用
                 */
                disable: function () {
                    list = fireQueue = null;
                    stop = true;
                    return this;
                },

                /**
                 * 判断回调列表是否已被废弃
                 * @name Callbacks#disabled
                 * @function
                 * @example
                 *
                 * var callbacks = Callbacks();
                 *
                 * console.log(callbacks.disabled());
                 * // => logs
                 * // false
                 *
                 * callbacks.disable();
                 *
                 * console.log(callbacks.disabled());
                 * // => logs
                 * // true
                 */
                disabled: function () {
                    return !list;
                },

                /**
                 * 从回调列表中移除掉传入的函数
                 * @name Callbacks#remove
                 * @function
                 * @example
                 *
                 * var foo = function () {
                 *     console.log('nah');
                 * };
                 *
                 * var callbacks = Callbacks();
                 * callbacks.add(foo);
                 *
                 * // 移除回调函数 `foo`
                 * callbacks.remove(foo);
                 * callbacks.fire();
                 * // 回调列表内的回调函数 `foo` 已被移除，不会执行该回调
                 */
                remove: function () {
                    var index = 0;

                    while (index < fireLength) {

                        if ([].indexOf.call(arguments, list[index]) !== -1) {

                            // 从队列中删除当前回调
                            list.splice(index, 1);

                            // 如果当前回调队列被多层嵌套执行
                            // 上几层队列也可能会受到影响
                            if (firing) {
                                if (fireQueue.length) {
                                    fireQueue.forEach(function (value, key) {
                                        // 被删除的回调位于当前索引位置前面
                                        // 当前索引位置自减1
                                        if (index <= value) {
                                            fireQueue[key]--;
                                        }
                                    });
                                }

                                // 如果被删除的函数的索引位置在fireIndex的前面
                                // fireIndex自减1

                                if (index <= fireIndex) {
                                    fireIndex--;
                                }
                            }

                            // 回调列表长度改变
                            fireLength--;
                        } else {
                            index++;
                        }
                    }

                    return this;
                },

                /**
                 * 判断回调列表是否为空，
                 * 如果一个回调函数作为参数传入，则判断这个回调函数是否在列表中
                 * @name Callbacks#has
                 * @function
                 * @param {Function} [callback] 需要判断是否在列表中的回调函数
                 * @example
                 */
                has: function (callback) {
                    if (typeof callback === 'function') {
                        return list.indexOf(callback) !== -1;
                    } else {
                        return list.length !== 0;
                    }

                },

                /**
                 * 锁定回调列表
                 * 被锁定的回调列表在被解开之前暂时不能被调用
                 * @name Callbacks#lock
                 * @function
                 * @example
                 *
                 * var callbacks = Callbacks();
                 *
                 * callbacks.add(function () {
                 *     console.log('i`m free!');
                 * });
                 *
                 * // 锁定回调列表
                 * callbacks.lock();
                 *
                 * callbacks.fire();
                 * // 回调列表不会执行
                 */
                lock: function () {
                    locked = true;
                    return this;
                },

                /**
                 * 解除当前回调列表的锁定状态
                 * @name Callbacks#unlock
                 * @function
                 * @example
                 *
                 * var callbacks = Callbacks();
                 *
                 * callbacks.add(function () {
                 *     console.log('i`m free!');
                 * });
                 *
                 * // 锁定回调列表
                 * callbacks.lock();
                 *
                 * callbacks.fire();
                 * // 回调列表不会执行
                 *
                 * // 解除回调函数的锁定状态
                 * callbacks.unlock();
                 *
                 * callbacks.fire();
                 * // => logs
                 * // 'i`m free!'
                 */
                unlock: function () {
                    locked = false;
                    return this;
                },

                /**
                 * 判断当前回调列表是否为锁定状态
                 * @name Callbacks#locked
                 * @function
                 * @example
                 *
                 * var callbacks = Callbacks();
                 *
                 * console.log(callbacks.locked());
                 * // => logs
                 * // false
                 *
                 * callbacks.lock();
                 *
                 * console.log(callbacks.locked());
                 * // => logs
                 * // true
                 *
                 * callbacks.unlock();
                 *
                 * console.log(callbacks.locked());
                 * // => logs
                 * // false
                 */
                locked: function () {
                    return locked;
                },

                /**
                 * 立即停止回调列表继续执行
                 * @name Callbacks#stop
                 * @function
                 * @example
                 *
                 * var callbacks = Callbacks();
                 *
                 * callbacks.add(function () {
                 *     // 阻止正在执行的callbacks继续执行后续回调
                 *     callbacks.stop();
                 * });
                 *
                 * callbacks.add(function () {
                 *     // 在上一个回调函数中已经阻止当前回调列表的继续执行
                 *     console.log('i`m stop before here');
                 * });
                 *
                 * callbacks.fire();
                 */
                stop: function () {
                    stop = true;
                    return this;
                }
            });
    }

    if (typeof module === "object" && typeof module.exports === "object") {
        // Node.js或RingoJS导出方式
        module.exports = Callbacks;
    } else {

        // AMD模式导出
        if (typeof define === "function" && typeof define.amd === 'object' && define.amd) {
            define("Callbacks", [], function () {
                return Callbacks;
            });
        }

        // 浏览器或Rhino环境
        root.Callbacks = Callbacks;
    }
}(typeof window !== "undefined" ? window : this));
