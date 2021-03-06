(function(lib){
   'use strict';
   
   lib.events = {
      hub: function(){
         return new Hub();
      }
   };

   function Hub(){
      this.events = {};
   }

   /*
      Add an event listener.
      eventName : name of the event.
      listener : function or object
      if object : {
         handler: function(){},
         caller: reference to "this" for the function.
      }
   */
   Hub.prototype.on = function(eventName, listener){
      var eventListeners = this.getListeners(eventName);
      eventListeners.push(listener);
   };

   /*
      Remove a listener.
      eventName : name of the event.
      listener function of object, must be the same instance wich was passed to "on".
   */
   Hub.prototype.off = function(eventName, listener){
      var eventListeners = this.getListeners(eventName);
      var index = eventListeners.indexOf(listener);
      eventListeners.splice(index, 1);
   };

   /*
      Returns the number of listeners for a specific event name.
   */
   Hub.prototype.count = function(eventName){
      return this.getListeners(eventName).length;
   };

   /*
      Trigger an event
      eventName: name of the event
      eventArgs: object with event arguments
   */
   Hub.prototype.trigger = function(eventName, eventArgs){
      var args = eventArgs === undefined ? [] : [eventArgs];
      this.triggerWithArgs(eventName, args);
   };

   Hub.prototype.triggerWithArgs = function(eventName, argsArray){
      //if (argsArray === undefined) argsArray = [];
      //else if (!Array.isArray(argsArray)) throw 'argsArray must be an array';
      if (argsArray !== undefined && !Array.isArray(argsArray)) throw 'argsArray must be an array';

      var listeners = this.getListeners(eventName);
      listeners.iterate(function(f){
         if(f.handler){
            f.handler.apply(f.caller, argsArray);
         } else {
            f.apply(undefined, argsArray);
         }
      });
   };

   Hub.prototype.getListeners = function(eventName){
      return this.events[eventName] || (this.events[eventName] = []);
   };

})(window.pjs);
