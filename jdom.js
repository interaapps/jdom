/*
    JDOM IS A SIMPLE DOM SELECTOR WITH FUNCTIONS!
    This is not finished! If you want to add something, just do it!
*/


class jdom {
    constructor(element) {
        if (element instanceof HTMLElement)
            this.elem = element;
        else if (element instanceof jdom)
            this.elem = element.elem;
        else
            this.elem = document.querySelectorAll(element);
        this.$ = function(element){
            return (new jdom(element));
        }
    }
    
    html(html) {
    	if (typeof html == 'undefined') {
    	    if (typeof this.elem[0] !== 'undefined')
                return this.elem[0].innerHTML;
            return "";
        } else {
            [].forEach.call(this.elem, function (element) { element.innerHTML = html; });
            return this;
        }
    }

    text(text) {
        if (typeof text == 'undefined') {
            if (typeof this.elem[0] !== 'undefined')
                return this.elem[0].innerText;
            return "";
        } else {
            [].forEach.call(this.elem, function (element) { element.innerText = text; });
            return this;
        }
    }

    css(css={}) {
        [].forEach.call(this.elem, function (element) {
            for (var styleAttr in css)
                element.style[styleAttr] = css[styleAttr];
        });
        return this;
    }

    attr(attributes={}) {
        [].forEach.call(this.elem, function (element) {
            for (var attribute in attributes)
                element[attribute] = attributes[attribute];
        });
        return this;
    }
    
    each(runFunction) {
        [].forEach.call(this.elem, function(element){
    	    runFunction(element);
        });
        return this;
    }
    
    getElem(){
    	return this.elem;
    }
    
    on(what, func) {
	    [].forEach.call(this.elem, function(element){
    	    element.addEventListener(what,func);
        });
	    return this;
     }
    
    click(func){ 
        return this.on('click', func);
    }
    
    
}



var $ = function(element){
    return (new jdom(element));
}

var $$ = function (element) {
    return document.querySelectorAll(element);
}
