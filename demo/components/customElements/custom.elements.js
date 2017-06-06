(function(pjs){
   var childDef = {
      template:{
         content: '<div @click="divClick">{{potato}}</div>'
      },
      methods: {
         divClick: function(){
            console.log(this.model.potato);
            this.model.potato = this.model.potato + '1';
         }
      }
   };

   var sousComp = pjs.createComponent(childDef);

   var def = {
     template: {
        content:'<pjs-test potato="text"></pjs-test>'
     },
     components:{
        'pjs-test': sousComp
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

   window.customElem = pjs.createComponent(def);
})(window.pjs);
