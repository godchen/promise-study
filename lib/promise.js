function Promise(fn){
    let promise = this,
    value = null;

    //定义成功的回调队列
    promise._resolves = [];
    promise.status = 'PENDING';
    //定义失败的回调队列
    promise._rejects = [];
    promise._reason = "" ;
    promise._value = "";

    //实例方法，用来注册异步事件
    this.then = function(onFulfilled,onRejected){
        //返回一个新建的promise实例，实现链式调用
        return new Promise(function(resolve,reject){
            //创建handle函数，对上一个promise的then回调进行处理，并使用当前promise的resolve
            function handle(value){
                let ret = isFunction(onFulfilled) && onFulfilled(value) || value;
                //判断ret是否为promise对象，如果是，执行其then回调，从而实现支持对promise对象的处理
                if( ret && isFunction(ret['then']) ){
                    ret.then(function(value){
                        resolve(value);
                    },function(reason){
                        reject(reason);
                    });
                }else{
                    resolve(ret);
                }
            }
            function errBack(reason){
                reason = isFunction(onRejected) && onRejected(reason) || reason;
                reject(reason);
            }
            //状态在挂载时，将handle函数添加至成功回调队列（注：这里的promise是上一个promise对象）
            if(promise.status === 'PENDING'){
                promise._resolves.push(handle);
                promise._rejects.push(errBack);
            }else if(promise.status === 'FULFILLED'){
                handle(promise._value);
            }else if(promise.status === 'REJECTED'){
                errBack(promise._reason);
            }
        });
    };

    function reject(value){
        //将失败队列执行事件放到js macrotask 任务队列的末尾
        setTimeout(function(){
            //将状态改成失败，并且依次执行失败回调队列中的事件
            promise.status = 'REJECTED';
            promise._rejects.forEach(function(callback){
                promise._reason = callback(value);
            });
        },0)
    }

    function resolve(value){
        //将成功队列执行事件放到js macrotask 任务队列的末尾
        setTimeout(function(){
            //将状态改成完成，并且依次执行成功回调队列中的事件
            promise.status = 'FULFILLED';
            promise._resolves.forEach(function(callback){
                promise._value = callback(value);
            });
        },0);
    }

    fn(resolve,reject);
}

Promise.all = function (promises) {
    if (!Array.isArray(promises)) {
        throw new TypeError('You must pass an array to all.');
    }

    //返回一个promise实例
    return new Promise(function(resolve,reject){
        let i = 0,
        result = [],
        len = promises.length,
        count = len;

        // 每一个 promise 执行成功后，就会调用一次 resolve 函数
        function resolver(index) {
            return function(value) {
                resolveAll(index, value);
            };
        }

        function rejecter(reason){
            reject(reason);
        }

        function resolveAll(index,value){
            // 存储每一个promise的参数
            result[index] = value;
            // 等于0 表明所有的promise 都已经运行完成，执行resolve函数
            if( --count === 0){
                resolve(result)
            }
        }

        // 依次循环执行每个promise
        for (; i < len; i++) {
            // 若有一个失败，就执行rejecter函数
            promises[i].then(resolver(i),rejecter);
        }
    });
};

Promise.race = function(promises){
    if (!Array.isArray(promises)) {
        throw new TypeError('You must pass an array to race.');
    }
    return Promise(function(resolve,reject){
        let i = 0,
        len = promises.length;

        function resolver(value) {
            resolve(value);
        }

        function rejecter(reason){
            reject(reason);
        }

        for (; i < len; i++) {
            promises[i].then(resolver,rejecter);
        }
    });
};

function isFunction(fn){
    return typeof onFulfilled === 'function';
}