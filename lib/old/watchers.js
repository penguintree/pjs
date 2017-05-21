(function(lib){
   'use strict';
   
   var watchInterval = 50;
   
   lib.watchers = {
      watch: watchObject
   }
   
   var watchersById = {};
   var watchingLoop = undefined;
   var watchID = 1;
   
   function watchObject(obj, handler){
      var watcher;
      if (!obj.$watchID){
         obj.$watchID = ++watchID;
         
         watcher = new Watcher(obj, obj.$watchID);
         watchersById[obj.$watchID] = watcher;
      } else { 
         watcher = watchersById[obj.$watchID];
      }
      
      watcher.addHandler(handler);
      
      ensureWatchingLoop();
   }
   
   function ensureWatchingLoop(){
      if (!watchingLoop){
         watchingLoop = window.setInterval(checkAll, watchInterval);
      }
   }
   
   function checkAll(){
      for(var id in watchersById){
         setTimeout(function() { watchersById[id].trigger(); }, 0);
      }
   }
   
   function Watcher(obj, id){
      this.properties = getProperties(obj);
      this.obj = obj;
      this.id = id;
      this.state = getActualState(obj, this.properties);
      this.handlers = [];
   }
   
   Watcher.prototype.isDirty = function(){
      var dirty = false;
      this.properties.iterate(function(p){
         var old = this.state[p.accessor];
         var actual = p.getFrom(this.obj);
         dirty = old != actual;
         return !dirty;
      }, this);
      
      return dirty;
   };
   
   Watcher.prototype.trigger = function(){
      if (this.isDirty()){
         this.handlers.iterate(function(h){
            h();
         });
         
         this.state = getActualState(this.obj, this.properties);
      }
   };
   
   Watcher.prototype.addHandler = function(handler){
      this.handlers.push(handler);
   };
   Watcher.prototype.removeHandler = function(handler){
      this.handlers.remove(handler);
   }
   
   function getActualState(obj, properties){
      var state = {};
      properties.iterate(function(p){
         state[p.accessor] = p.getFrom(obj);
      });
      return state;
   }
   
   function getProperties(obj){
      var properties = lib.objectAnalyser.getPropertiesStacks(obj);
      properties.iterate(function(e, i){
         properties[i] = e.top;
         properties[i].accessor = properties[i].toString();
      });
      return properties;
   }
   
})(window.pjs);