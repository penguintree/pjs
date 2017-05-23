(function(lib){
   'use strict';

   var eventName = 'tick';
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
      this.hub = lib.events.hub();
   }
   Tick.prototype.on = function(handler){
      this.hub.on(eventName, handler);
      if(!this.isRunning()){
         this.start();
      }
   };
   Tick.prototype.off = function(handler){
      this.hub.off(eventName, handler);
      if(this.isRunning() && !this.hub.count(eventName)){
         this.stop();
      }
   };
   Tick.prototype.$trigger = function(){
      this.hub.trigger(eventName);
   };
   Tick.prototype.start = function(){
      var tick = this;
      tick.interval = setInterval(function(){
         tick.$trigger();
      }, tickInterval);
   };
   Tick.prototype.stop = function(){
      if (this.isRunning()){
         clearInterval(this.interval);
         this.interval = undefined;
      }
   };
   Tick.prototype.isRunning = function(){
      return !!this.interval;
   };

})(window.pjs);
