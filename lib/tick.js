(function(lib){
   'use strict';
   
   var tick = new Tick();
   
   lib.tick = {
      on: function(handler){
         tick.on(handler);
      },
      off: function(handler){
         tick.off(handler);
      }
   };
   
   var tickInterval =  10;
   
   function Tick(){
      this.listeners = [];
   }
   Tick.prototype.on = function(handler){
      this.listeners.push(handler);
      if(!this.interval){
         this.start();
      }
   };
   Tick.prototype.off = function(handler){
      this.listeners.remove(handler);
      if(this.interval && !this.listeners.length){
         this.stop();
      }
   };
   Tick.prototype.$trigger = function(){
      this.listeners.iterate(function(handler){
         handler();
      });
   };
   Tick.prototype.start = function(){
      var tick = this;
      tick.interval = setInterval(function(){
         tick.$trigger();
      }, tickInterval);
   };
   Tick.prototype.stop = function(){
      if (this.interval){
         clearInterval(this.interval);
         this.interval = undefined;
      }
   };
   
})(window.pjs);