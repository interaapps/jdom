/*
    JDOM IS A SIMPLE DOM SELECTOR WITH FUNCTIONS!
    This is not finished! If you want to add something, just do it!
*/


class jdom{
    constructor(element) {
         this.elem = document.querySelectorAll(element);
         this.$ = function(element){ return (new jdom(element)); }
    }
    
    text(txt) {
    	[].forEach.call(this.elem, function(element){
    	    element.innerHTML = txt;
        });
    }
    
    each(runFunction) {
        [].forEach.call(this.elem, function(element){
    	    runFunction();
        });
    }
    
    getElem(){
    	return this.elem;
    }
    
    on(what, func) {
	    [].forEach.call(this.elem, function(element){
    	    element.addEventListener(what,func);
        });
     }
    
    // on short
    
    click(func){ 
        this.on('click', func);
    }
    
    
}



var $ = function(element){
    return (new jdom(element));
}

var $$ = function (element) {
    return document.querySelectorAll(element);
}
