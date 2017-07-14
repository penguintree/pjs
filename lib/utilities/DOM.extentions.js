(function(){
   //https://developer.mozilla.org/fr/docs/Web/API/MutationObserver

   //Dispatch a 'removed' event when an element is removed from the DOM.
   var observer = new MutationObserver(function(mutations){
      var mutation, i = 0;
      for(; (mutation = mutations[i]) !== undefined ; i++){
         if(mutation.type === 'childList' && mutation.removedNodes && mutation.removedNodes.length){
            var node; k = 0;
            var event = new Event('removed'); //TODO not in IE 11 http://caniuse.com/#feat=customevent
            for(; (node = mutation.removedNodes[k]) !== undefined ; k++){
               node.iterateChildren(function(n){
                  n.dispatchEvent(event);
               });
               node.dispatchEvent(event);
            }
         }
      }
   });

   observer.observe(document.body, { childList: true, subtree: true });
})();
