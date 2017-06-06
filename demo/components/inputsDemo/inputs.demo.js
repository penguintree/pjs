(function(pjs){
   var def = {
     template: {
        url: '/components/inputsDemo/inputs.demo.html'
     },
     methods: {
        someMethod: function() {
           console.log('method called', this.model.textValue);
        },
        someEvent:function(e){
           console.log('event triggered', e);
           this.someMethod();
        }
     },
     events: {

     }
   }

   window.inputDemo = pjs.createComponent(def);
})(window.pjs);
