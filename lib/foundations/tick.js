(function(lib){
   'use strict';

   var eventNameBefore = 'beforeTick';
   var eventName = 'tick';
   var eventNameAfter = 'afterTick';

   var tick = new Tick();

   lib.tick = tick;

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

   Tick.prototype.onBefore = function(handler){
      this.hub.on(eventnameBefore, handler);
   };
   Tick.prototype.offBefore = function(handler){
      this.hub.off(eventNameBefore, handler);
   };

   Tick.prototype.onAfter = function(handler){
      this.hub.on(eventNameAfter, handler);
   };
   Tick.prototype.offAfter = function(handler){
      this.hub.off(eventNameAfter, handler);
   };

   Tick.prototype.$trigger = function(params){
      this.hub.trigger(eventNameBefore, params);
      this.hub.trigger(eventName, params);
      this.hub.trigger(eventNameAfter, params);
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
