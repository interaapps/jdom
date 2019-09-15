/*
    JDOM IS A SIMPLE DOM SELECTOR WITH FUNCTIONS!
    This is not finished! If you want to add something, just do it!
*/


class jdom {
    constructor(element) {
        this.usign = "queryselector";
        if (element instanceof HTMLElement || element===document  || element===window) {
            this.elem = element;
            this.usign = "htmlelement";
        } else if (element instanceof jdom) {
            this.elem = element.elem;
            this.usign = "jdom";
        } else
            this.elem = document.querySelectorAll(element);
        this.$ = function(element){
            return (new jdom(element));
        }
    }

    foreacher(func) {
        if (this.usign == "htmlelement")
            func(this.elem);
        else
            [].forEach.call(this.elem, func);
    }

    html(html) {
    	if (typeof html == 'undefined') {
    	    if (typeof this.elem[0] !== 'undefined')
                return this.elem[0].innerHTML;
            return "";
        } else {
            this.foreacher( function (element) { element.innerHTML = html; });
            return this;
        }
    }

    text(text) {
        if (typeof text == 'undefined') {
            if (typeof this.elem[0] !== 'undefined')
                return this.elem[0].innerText;
            return "";
        } else {
            this.foreacher( function (element) { element.innerText = text; });
            return this;
        }
    }

    css(css={}, alternativeValue=undefined) {
        if (typeof css == "string" && typeof alternativeValue == 'undefined') {
            if (typeof this.elem[0].style[css] !== 'undefined')
                return this.elem[0].style[css];
            return "";
        } else
            this.foreacher( function (element) {
                if (typeof css == "string" && typeof alternativeValue != 'undefined') {
                    element.style[css] = alternativeValue;
                } else {
                    for (var styleAttr in css)
                        element.style[styleAttr] = css[styleAttr];
                }
            });
        return this;
    }

    attr(attributes={}, alternativeValue=undefined) {
        if (typeof attributes == "string" && typeof alternativeValue == 'undefined') {
            if (typeof this.elem[0][attributes] !== 'undefined')
            return this.elem[0][attributes];
            return "";
        } else
            this.foreacher( function (element) {
                if (typeof attributes == "string" && typeof alternativeValue != 'undefined') {
                    element[attributes] = alternativeValue;
                } else {
                    for (var attribute in attributes)
                        element[attribute] = attributes[attribute];
                }
            });
        return this;
    }

    addClass(name) {

        this.foreacher( function (element) {
            element.classList.add(name);
        });
        return this;
    }

    removeClass(name) {
        this.foreacher( function (element) {
            element.classList.remove(name);
        });
        return this;
    }

    id(name) {
        if (typeof name == 'undefined') {
            if (typeof this.elem[0] !== 'undefined')
                return this.elem[0].id;
        } else {
            this.foreacher(function(element) {
                element.id = name;
            });
        }
        return this;
    }

    append(append) {
        if (append instanceof HTMLElement)
            this.foreacher( function (element) {
                element.appendChild(append);
            });
        else if (append instanceof jdom)
            this.foreacher( function (element) {
                element.appendChild(append.elem);
            });
        else {
            var outerThis = this;
            this.foreacher( function (element) {
                outerThis.html(outerThis.html() + append);
            });
        }
        return this;
    }

    each(runFunction) {
        this.foreacher(runFunction);
        return this;
    }

    getElem(){
    	return this.elem;
    }

    on(what, func, option) {
	    this.foreacher( function(element){
    	    element.addEventListener(what,func);
        }, option);
	    return this;
     }
    
    click(func){ 
        return this.on('click', func);
    }
    
    
}



var $ = function(element){
    return (new jdom(element));
}

var $n = function(element="div"){
    return (new jdom(document.createElement(element)));
}

var $$ = function (element) {
    return document.querySelectorAll(element);
}
