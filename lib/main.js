(function(){
   'use strict';   
   
   window.pjs = {
      factories:{
         promise: createPromise
      }
   };
   
   
   function createPromise(){
      var resolve;
      var reject;
      var promise = new Promise(function(res, rej) { resolve = res; reject = rej });
      
      return {
         $promise: promise,
         resolve: resolve,
         reject: function(e){
            reject(e);
         }
      };
   };
   
})();