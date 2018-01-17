import Promise from '../lib/promise'

let getData100 = function(){
    return new Promise(function(resolve,reject){
        setTimeout(function(){
            resolve('100ms');
        },1000);
    });
};

let getData200 = function(){
    return new Promise(function(resolve,reject){
        setTimeout(function(){
            resolve('200ms');
        },2000);
    });
};

let getData300 = function(){
    return new Promise(function(resolve,reject){
        setTimeout(function(){
            reject('reject');
        },3000);
    });
};

getData100().then(function(data){
    console.log(data);      // 100ms
    return getData200();
}).then(function(data){
    console.log(data);      // 200ms
    return getData300();
}).then(function(data){
    console.log(data);
}, function(data){
    console.log(data);      // 'reject'
});
