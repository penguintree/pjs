(function(lib){
   window.mocks = window.mocks || {};
   window.mocks.Tick = Tick;

   var eventNameBefore = 'before';
   var eventName = 'on';
   var eventNameAfter = 'after';

   function Tick(){
      this.hub = lib.events.hub();
   }
   Tick.prototype.on = function(handler){
      this.hub.on(eventName, handler);
   };
   Tick.prototype.off = function(handler){
      this.hub.off(eventName, handler);
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
})(window.pjs);
