(function(lib){
   'use strict';

   //lib.observers = lib.observers || {};
   //lib.observers.Spy = Spy;

   lib.spy = lib.spy || {};
   lib.spy.objectSpy = function(obj, tick) {
      return new Spy(obj, tick);
   };

   function Spy(obj, tick){
      this.obj = obj;
      this.observed = {};
      this.spiesCache = {};
      this.oneTimeRunners = [];
      this.shortcuts = {};

      this.childs = [];

      this.tick = tick;

      this.tick.onAfter({
         handler: resetOneTimeRunners,
         caller: this
      });
   }

   Spy.prototype.createChild = function(){
     var child = new Spy(this.obj, this.tick);
     child.shortcuts = {};
     for(var short in this.shortcuts){
        if(this.shortcuts.hasOwnProperty(short)){
           defineShortcutProperty.call(child, short, this.shortcuts[short]);
        }
     }
     this.childs.push(child);
     return child;
   };

   Spy.prototype.defineArrayShortcut = function(arrayProp, index, shortcut){
      if(this.obj.hasOwnProperty(shortcut)){
         throw 'Property ' + shortcut + ' already exist on spied object';
      }

      if(this.shortcuts.hasOwnProperty(shortcut)){
         throw 'shortcut ' + shortcut + ' is already defined';
      }

      var array = this.getValue(arrayProp);
      if (!Array.isArray(array)){
         throw 'Shortcuts can only be defined on arrays. ' + arrayProp + ' is not an array';
      }

      defineShortcutProperty.call(this, shortcut, array[index]);
   }

   Spy.prototype.register = function(prop, handler){
      if(Array.isArray(prop)){
         if (prop.length === 1){
            prop = prop[0];
         } else {
            var handler = oneTimeRunner(handler);
            prop.iterate(function(p){
               this.register(p, handler);
            }, this);
            this.oneTimeRunners.push(handler);

            return;
         }
      }

      var o = getObservedObject.call(this, prop);
      var spy = this.spiesCache[prop] || (this.spiesCache[prop] = lib.spy.build(o.obj, o.prop, this.tick));

      this.observed[prop] = this.observed[prop] || [];
      spy.on(handler);
      this.observed[prop].push(handler);
   };

   Spy.prototype.getValue = function(prop){
      var o = getObservedObject.call(this, prop);

      if(o.obj === undefined) return undefined

      return o.obj[o.prop];
   };

   Spy.prototype.setValue = function(prop, value){
      var o = getObservedObject.call(this, prop);

      if(o.obj === undefined) throw 'property "' + o.actualProp + '" does not exists';

      if(!o.obj.hasOwnProperty(o.prop)) throw 'property "' + o.prop + '" does not exists';

      o.obj[o.prop] = value;
   };

   Spy.prototype.release = function(){
      for(var p in this.observed){
         var spy = this.spiesCache[p];
         this.observed[p].iterate(function(hanlder){
            spy.off(hanlder);
         });
      }
      this.observed = {};
      this.oneTimeRunners = [];
      this.childs.iterate(function(c){
        c.release();
      });
   };


   //********************
   // Private stuff.
   //********************

   function oneTimeRunner(handler){
      var wrapper = function(e){
         if(!wrapper.ran){
            handler(e);
            wrapper.ran = true;
         }
      };
      return wrapper;
   }

   function resetOneTimeRunners(){
      this.oneTimeRunners.iterate(function(runner){
         runner.ran = false;
      });
   }

   function getObservedObject(prop){
      var shortcut = getFromShortcut.call(this, prop);
      var o;
      if(shortcut){
         o = shortcut.obj;
         prop = shortcut.prop;
      } else{
         o = this.obj;
      }

      return getObservedObject2(o, prop);
   }

   //TODO: rename
   function getObservedObject2(obj, prop){
      var parts = prop.split('.');
      var i = 0;
      while (i < parts.length - 1){
         obj = obj[parts[i]];
         i++;
      }

      return {
         obj: obj,
         actualProp: i > 0 ? parts[i-1] : undefined,
         prop: parts[i]
      };
   }

   function getFromShortcut(prop){
      var parts = prop.split('.');
      var o = this.shortcuts;
      var i = 0;
      if (!o.hasOwnProperty(parts[i])){
         return false;
      }

      while(i < parts.length - 1 && o.hasOwnProperty(parts[i])){
         o = o[parts[i]];
         i++;
      };

      return {
         obj: o,
         prop: parts.slice(i).join('.')
      };
   }

   function defineShortcutProperty(shortcut, value){
      Object.defineProperty(this.shortcuts, shortcut, {
        enumerable: true,
        configurable: false,
        writable: false,
        value: value
      });
   }

})(window.pjs);
