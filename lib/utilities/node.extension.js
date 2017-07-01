(function(){
   'use strict';

   Node.prototype.removeChildren = function(){
      //TODO: should remove data, handlers, etc.
      while(this.lastChild){
         this.removeChild(this.lastChild);
      }
   };

   Node.prototype.insertAfter = function(newChild, sibling){
      if(sibling === undefined){
         this.insertBefore(newChild, this.firstChild);
      } else {
         if (sibling.parentNode !== this){
            throw 'sibling is not of child of this node';
         }

         this.insertBefore(newChild, sibling.nextSibling);
      }
   }

   Node.prototype.iterateChildren = function(callback){
      walkChildrenFromInside(this, callback);
   }

   function walkChildrenFromInside(node, callback){
      for(var i = 0 ; i < node.childNodes.length ; i++){
         walkChildrenFromInside(node.childNodes[i], callback);
      }
      callback(node);
   }
})();
