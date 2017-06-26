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

   var observableArrayPrototype = Object.create(Array.prototype);
   for(var i = 0 ; i < mutators.length ; i++){
      (function(methodName){
         observableArrayPrototype[methodName] = wrapper(methodName);
      })(mutators[i]);
   }

   //function observe(array){
   //   for(var i = 0 ; i < mutators.length ; i++){
   //      (function(methodName){
   //         array[methodName] = wrapper(methodName);
   //      })(mutators[i]);
   //   }
   //};

   Array.prototype.observe = function(callback){
      this.$$callback = callback;
      //observe(this);
      Object.setPrototypeOf(this, observableArrayPrototype);
   };

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
      this.mutation = {
         actual: this.slice()
      };
   }

   function after(){
      var actual = this.mutation.actual;
      delete this.mutation;
      this.$$callback(actual, this);
   }
})();
