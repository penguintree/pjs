(function(){
   //https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Array#Les_mutateurs
   var mutators = [
      'copyWithin',
      'fill',
      'pop',
      'push',
      'reverse',
      'shift',
      'sort',
      'splice',
      'unshift'
   ];

   //var observableArrayPrototype = Object.create(Array.prototype);
   //for(var i = 0 ; i < mutators.length ; i++){
   //   (function(methodName){
   //      observableArrayPrototype[methodName] = wrapper(methodName);
   //   })(mutators[i]);
   //}

   //function observe(array){
   //   for(var i = 0 ; i < mutators.length ; i++){
   //      (function(methodName){
   //         array[methodName] = wrapper(methodName);
   //      })(mutators[i]);
   //   }
   //};

   Array.prototype.observe = function(observer){
      if(typeof(observer) !== 'function'){
         if(typeof(observer.trigger) === 'function'){
            observer = (function(o){
               return function(){
                  o.trigger.apply(o, arguments);
               };
            })(observer);
         } else {
            throw "observer must be a function or an object with a `trigger` function."
         }
      }

      this.$$observer = observer;
      //observe(this);
      //Object.setPrototypeOf(this, observableArrayPrototype);
      patchArrayPrototype();
   };
   Array.prototype.unobserve = function(){
      delete this.$$observer;
   };

   var protoPatched = false;
   function patchArrayPrototype(){
      if(protoPatched) return;

      protoPatched = true;

      var arrayProto = Array.prototype;
      for(var i = 0 ; i < mutators.length ; i++){
         (function(method){
            var original = arrayProto[method];
            arrayProto[method] = function(){
               before.call(this);
               var ret = original.apply(this, arguments);
               after.call(this);
               return ret;
            };
         })(mutators[i]);
      }
   }

   function wrapper(methodName){
      return function(){
         before.call(this);
         var ret = Array.prototype[methodName].apply(this, arguments);
         //var ret = this[methodName].apply(this, arguments);
         after.call(this);
         return ret;
      };
   }

   function before(){
      if(!this.$$observer) return;

      this.mutation = {
         actual: this.slice()
      };
   }

   function after(){
      if(!this.$$observer) return;

      var actual = this.mutation.actual;
      delete this.mutation;
      this.$$observer(actual, this.slice());
   }
})();
