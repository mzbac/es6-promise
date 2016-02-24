
var Promise =require('./dist/Promise').Promise;

var p = new Promise();
p.then(function(val){
    console.log(val);
})
setTimeout(function () {
    p.changeState(p.State.FULFILLED, "sucess");
   
}, 3000);
