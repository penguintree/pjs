(function(){
   'use strict';
   
   Array.prototype.iterate = function(callback, that){
      if (!that){ that = this; }
      for (var i = 0 ; i < this.length ; i++){
         if(callback.call(that, this[i], i) === false){
            break;
         }
      }
   };
})();