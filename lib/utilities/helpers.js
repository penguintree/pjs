(function(lib){
   'use strict';

   lib.factories = {
      promise: createPromise
   };

   /*
      Promise factory
      An helper to simplify promises creations.
      Returns an object containing the promise itsefl, plus
      the resolve and reject functions.
      No need to wrap all code in promise constructor.
   */

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

})(window.pjs);
