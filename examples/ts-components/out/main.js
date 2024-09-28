var __legacyDecorateClassTS = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    r = Reflect.decorate(decorators, target, key, desc);
  else
    for (var i = decorators.length - 1;i >= 0; i--)
      if (d = decorators[i])
        r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

// ../../src/Hook.js
class Hook {
  listeners = [];
  deleteListeners = [];
  #destroyed = false;
  #alreadyProxied = false;
  static TRACKING = [];
  static IS_TRACKING = false;
  constructor(value) {
    this.setValue(value);
    return new Proxy(this, {
      get: (target, prop) => {
        if (Object.hasOwn(target, prop) || prop in target || prop === "value") {
          return Reflect.get(target, prop);
        }
        if (typeof target._value === "object" && !Array.isArray(target._value) && target._value !== null) {
          const newHook = new Hook(target._value[prop]);
          newHook.listeners.push((val) => {
            if (val !== target._value[prop]) {
              target._value[prop] = val;
              this.setValue(target.value);
            }
          });
          this.listeners.push((val) => {
            if (val !== val[prop]) {
              newHook.value = val[prop];
            }
          });
          return newHook;
        }
        return Reflect.get(target, prop);
      },
      set: (target, prop, value2) => {
        if (Object.hasOwn(target, prop) || prop in target || prop === "value") {
          if (target[prop] === value2)
            return true;
          return Reflect.set(target, prop, value2);
        }
        if (typeof target._value === "object" && !Array.isArray(target._value) && target._value !== null) {
          if (target._value[prop] === value2)
            return true;
          return Reflect.set(target._value, prop, value2);
        }
        return Reflect.set(target, prop, value2);
      }
    });
  }
  setValue(val) {
    const old = this._value;
    this._value = val;
    this.dispatchListener(old);
  }
  #createObserver(val) {
    return new Proxy(val, {
      set: (target, prop, value) => {
        if (val === val[prop])
          return true;
        val[prop] = value;
        this.setValue(val);
        return Reflect.set(val, prop, value);
      }
    });
  }
  set value(val) {
    if (this.#destroyed) {
      return;
    }
    this.setValue(val);
  }
  get value() {
    Hook.track(this);
    return this._value;
  }
  destroy() {
    this.#destroyed = true;
    this.listeners = [];
  }
  dispatchListener(oldVal) {
    for (let listener of this.listeners) {
      try {
        if (listener.call(this, this._value, oldVal) === true)
          break;
      } catch (e) {
      }
    }
  }
  addListener(listener) {
    this.listeners.push(listener);
    return listener;
  }
  removeListener(listener) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }
  toString() {
    return `${this.value}`;
  }
  static track(hook) {
    if (Hook.IS_TRACKING) {
      Hook.TRACKING.push(hook);
    }
  }
  static enableTracking() {
    Hook.IS_TRACKING = true;
  }
  static disableTracking() {
    Hook.IS_TRACKING = false;
    Hook.clearTracked();
  }
  static getTracked() {
    return Hook.TRACKING;
  }
  static clearTracked() {
    Hook.TRACKING = [];
  }
}

// ../../src/JDOMComponent.js
class JDOMComponent extends (typeof HTMLElement === "undefined" ? class {
} : HTMLElement) {
  mainElement = null;
  #jdomConnectedAlready = false;
  options;
  constructor(options = {}) {
    console.log("test");
    super();
    this.options = options;
    this.registerAttributeListener();
  }
  async connectedCallback() {
    if (this.#jdomConnectedAlready)
      return;
    this.addEventListener(":attach", () => this.attach());
    this.addEventListener(":attached", () => this.attached());
    this.addEventListener(":detach", () => this.detach());
    this.addEventListener(":detached", () => this.detached());
    this.#jdomConnectedAlready = true;
    const { shadowed = false, style = null } = this.options;
    this.registerAttributeListener();
    this.mainElement = this;
    if (shadowed) {
      this.mainElement = this.attachShadow({ mode: "closed" });
    }
    await this.setup();
    const content = await this.render();
    if (content) {
      new JDOM_default(this.mainElement).append(content);
    }
    if (style) {
      this.addStyle(style);
    }
    let styleFromFunc = this.styles();
    if (styleFromFunc)
      this.addStyle(styleFromFunc);
    new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes") {
          this.dispatchEvent(new CustomEvent(":attributechanged", { detail: { mutation } }));
        }
      });
    }).observe(this, {
      attributes: true
    });
  }
  registerAttributeListener() {
    if (this.attributeListeners) {
      for (let attributeListener of this.attributeListeners) {
        const { key, options: { name = null } } = attributeListener;
        const attrName = name || key;
        if (this[key] instanceof Hook) {
          this[key].value = this.getAttribute(attrName);
        } else {
          this[key] = this.getAttribute(attrName);
        }
        let lastListener = null;
        this.addEventListener(":attributechanged", (e) => {
          const { detail: { mutation } } = e;
          if (!lastListener) {
            lastListener = this[key].addListener((val) => {
              this.setAttribute(attrName, val);
            });
          }
          if (mutation.attributeName === attrName) {
            const attrVal = this.getAttribute(attrName);
            if (this[key] instanceof Hook) {
              if (this[key].value !== attrVal) {
                this[key].value = attrVal;
              }
            } else {
              this[key] = attrVal;
            }
          }
        });
      }
    }
  }
  addAttributeListener(key, options = {}) {
    if (!this.attributeListeners)
      this.attributeListeners = [];
    this.attributeListeners.push({ key, options });
  }
  setup() {
  }
  detach() {
  }
  detached() {
  }
  attach() {
  }
  attached() {
  }
  addStyle(style) {
    const styleEl = document.createElement("style");
    styleEl.textContent = style;
    this.mainElement.appendChild(styleEl);
  }
  render() {
  }
  styles() {
    return;
  }
  static unshadowed = class JDOMUnshadowedComponent extends JDOMComponent {
    constructor(options = {}) {
      super({ shadowed: false, ...options });
    }
  };
}

// ../../src/hooks.js
function state(initialValue) {
  return new Hook(initialValue);
}
function computed(callable2, dependencies = undefined) {
  const hook = new Hook(callable2());
  if (dependencies === undefined) {
    Hook.enableTracking();
    callable2();
    for (const trackedElement of Hook.getTracked()) {
      trackedElement.addListener(() => {
        hook.value = callable2();
      });
    }
    Hook.disableTracking();
  } else {
    for (let dependency of dependencies) {
      dependency.listeners.push(() => {
        hook.value = callable2();
      });
    }
  }
  return hook;
}

// ../../src/JDOM.js
class JDOM2 {
  static compIndex = 0;
  constructor(element, parent = undefined) {
    if (typeof parent === "undefined")
      parent = document;
    this.elem = [];
    this.hooks = {};
    if (element instanceof NodeList || Array.isArray(element)) {
      this.elem = [...element];
    } else if (element instanceof Node || element === document || element === window) {
      this.elem = [element];
    } else if (element instanceof JDOM2) {
      this.elem = element.elem;
    } else {
      this.elem = [...parent.querySelectorAll(element)];
    }
    this.$ = (selector) => {
      if (typeof this.elem[0] !== "undefined")
        return new JDOM2(selector, this.elem[0]);
      return null;
    };
  }
  each(callable2) {
    for (const el of this.elem) {
      callable2.call(el, new JDOM2(el));
    }
    return this;
  }
  forEach(callable2) {
    return this.each(callable2);
  }
  eachNodes(callable2) {
    for (const el of this.elem) {
      callable2.call(el, el);
    }
    return this;
  }
  first() {
    return this.elem.length > 0 ? new JDOM2(this.elem[0]) : null;
  }
  elements() {
    return this.elem.map((e) => new JDOM2(e));
  }
  children() {
    return [...this.firstNode().childNodes].map((e) => new JDOM2(e));
  }
  firstNode() {
    return this.elem.length > 0 ? this.elem[0] : null;
  }
  nodes() {
    return this.elem;
  }
  setText(text) {
    return this.eachNodes((el) => {
      if (text instanceof Hook) {
        this.hooks.text = [text, text.addListener((val) => el.innerText = val)];
        el.textContent = text.value;
        return;
      } else if (this.hooks.text) {
        this.hooks.text[0].removeListener(this.hooks.text[1]);
        this.hooks.text = undefined;
      }
      el.innerText = text;
    });
  }
  getText() {
    const el = this.firstNode();
    return el ? el.innerText : null;
  }
  text(text = undefined) {
    return text === undefined ? this.getText() : this.setText(text);
  }
  setHTML(html) {
    return this.eachNodes((el) => {
      if (html instanceof Hook) {
        this.hooks.html = [html, html.addListener((val) => el.innerHTML = val)];
        el.innerHTML = html.value;
        return;
      } else if (this.hooks.html) {
        this.hooks.html[0].removeListener(this.hooks.html[1]);
        this.hooks.html = undefined;
      }
      el.innerHTML = html;
    });
  }
  getHTML() {
    const el = this.firstNode();
    return el ? el.innerHTML : null;
  }
  html(html = undefined) {
    if (html === undefined)
      return this.getHTML();
    else
      return this.setHTML(html);
  }
  css(css) {
    return this.eachNodes((el) => {
      for (const [key, value] of Object.entries(css)) {
        el.style[key] = value;
      }
    });
  }
  style(css) {
    return this.css(css);
  }
  getAttr(name) {
    const el = this.firstNode();
    return el ? el.getAttribute(name) : null;
  }
  getAttributes() {
    const el = this.firstNode();
    const attribs = {};
    if (el) {
      const elAttributes = el.attributes;
      for (const { nodeName, nodeValue } of elAttributes) {
        attribs[nodeName] = nodeValue;
      }
    }
    return attribs;
  }
  setAttr(name, val) {
    return this.eachNodes((el) => {
      if (val instanceof Hook) {
        this.hooks[`attribute-${name}`] = [val, val.addListener((val2) => el.setAttribute(name, val2))];
        el.setAttribute(name, val.value);
        return;
      } else if (this.hooks[`attribute-${name}`]) {
        this.hooks[`attribute-${name}`][0].removeListener(this.hooks[`attribute-${name}`][1]);
        this.hooks[`attribute-${name}`] = undefined;
      }
      el.setAttribute(name, val);
    });
  }
  removeAttr(name) {
    return this.eachNodes((el) => {
      el.removeAttribute(name);
    });
  }
  attr(name, val = undefined) {
    if (typeof name === "string")
      return val === undefined ? this.getAttr(name) : this.setAttr(name, val);
    for (const [key, val2] of Object.entries(name)) {
      this.attr(key, val2);
    }
    return this;
  }
  attrs() {
    return this.getAttributes();
  }
  hasClass(name) {
    const el = this.firstNode();
    return el ? el.classList.contains(name) : false;
  }
  addClass(...names) {
    return this.eachNodes((el) => {
      for (let name of names) {
        el.classList.add(name);
      }
    });
  }
  addClasses(...names) {
    return this.addClass(...names);
  }
  getClasses() {
    const el = this.firstNode();
    return el ? [...el.classList] : [];
  }
  classes(...names) {
    if (names.length === 0) {
      return this.getClasses();
    }
    return this.addClasses(...names);
  }
  removeClass(name) {
    return this.eachNodes((el) => {
      el.classList.remove(name);
    });
  }
  toggleClass(name) {
    return this.eachNodes((el) => {
      if (el.classList.contains(name)) {
        el.classList.remove(name);
      } else {
        el.classList.add(name);
      }
    });
  }
  getValue() {
    const el = this.firstNode();
    return el ? el.value : null;
  }
  setValue(val) {
    return this.eachNodes((el) => {
      el.value = val;
    });
  }
  val(value = undefined) {
    if (value === undefined) {
      return this.getValue();
    } else {
      return this.setValue(value);
    }
  }
  model(hook) {
    if (this.hooks.bind) {
      this.hooks.bind[0].removeListener(this.hooks.bind[1]);
    }
    this.hooks.bind = [hook, hook.addListener((val) => {
      this.val(val);
    })];
    this.val(hook.value);
    return this;
  }
  setOrGetProperty(name, value = undefined) {
    if (value === undefined) {
      const el = this.firstNode();
      return el ? el[name] : null;
    } else {
      return this.eachNodes((el) => {
        el[name] = value;
      });
    }
  }
  id(val = undefined) {
    return this.setOrGetProperty("value", val);
  }
  append(...nodes) {
    let parent = this;
    if (parent.firstNode() === document)
      parent = new JDOM2(document.body);
    for (const node of nodes) {
      if (typeof node === "string") {
        parent.eachNodes((el) => {
          if (el instanceof Element) {
            el.insertAdjacentHTML("beforeend", node);
          } else {
            console.warn("Parent is not type of Element. Appending html might not work.");
            const templ = document.createElement("template");
            templ.innerHTML = node;
            el.appendChild(templ);
          }
        });
      } else if (node instanceof JDOM2) {
        parent.eachNodes((el) => {
          node.eachNodes((n) => {
            el.appendChild(n);
          });
        });
      } else {
        parent.eachNodes((el) => {
          el.appendChild(node);
        });
      }
    }
    return this;
  }
  appendTo(...nodes) {
    for (const node of nodes) {
      new JDOM2(node).append(this);
    }
    return this;
  }
  prepend(...nodes) {
    let parent = this;
    if (parent.firstNode() === document)
      parent = new JDOM2(document.body);
    for (const node of nodes) {
      if (typeof node === "string") {
        parent.eachNodes((el) => {
          if (el instanceof Element) {
            el.insertAdjacentHTML("beforebegin", node);
          } else {
            console.warn("Parent is not type of Element. Prepending html might not work.");
            const templ = document.createElement("template");
            templ.innerHTML = node;
            el.prepend(templ);
          }
        });
      } else if (node instanceof JDOM2) {
        parent.eachNodes((el) => {
          node.eachNodes((n) => {
            el.prepend(n);
          });
        });
      } else {
        parent.eachNodes((el) => {
          el.prepend(node);
        });
      }
    }
    return this;
  }
  prependTo(...nodes) {
    for (const node of nodes) {
      new JDOM2(node).prepend(this);
    }
    return this;
  }
  hidden() {
    const el = this.firstNode();
    return el ? el.style.display === "none" : false;
  }
  shown() {
    return !this.hidden();
  }
  show() {
    return this.eachNodes((el) => el.style.display = "");
  }
  hide() {
    return this.eachNodes((el) => el.style.display = "none");
  }
  toggle() {
    return this.eachNodes((el) => {
      if (el.style.display === "none") {
        el.style.display = "";
      } else {
        el.style.display = "none";
      }
    });
  }
  showIf(hook) {
    this.hooks.showIf = [hook, hook.addListener((val) => val ? this.show() : this.hide())];
    if (hook.value) {
      this.show();
    } else {
      this.hide();
    }
    return this;
  }
  animate(css = {}, duration = 1000) {
    return new Promise((r) => {
      this.css({
        transition: `${duration}ms`
      });
      this.css(css);
      setTimeout(function() {
        r(this);
      }, duration);
    });
  }
  async animator(animations) {
    for (const animation of animations) {
      await this.animate(animation.css, animation.duration || 1000);
    }
    return this;
  }
  on(listener, callable2) {
    this.eachNodes((el) => {
      for (const listenerSplit of listener.split("|")) {
        el.addEventListener(listenerSplit, callable2);
      }
    });
    return this;
  }
  removeEvent(listener, callable2) {
    this.eachNodes((el) => {
      el.removeEvent(listener, callable2);
    });
    return this;
  }
  bind(events = {}) {
    for (const [listener, callable2] of Object.entries(events)) {
      this.on(listener, callable2);
    }
    return this;
  }
  click(callable2 = undefined) {
    if (callable2 === undefined) {
      return this.eachNodes((el) => {
        el.click();
      });
    }
    return this.on("click", callable2);
  }
  focus(func) {
    if (callable === undefined) {
      return this.eachNodes((el) => {
        el.focus();
      });
    }
    return this.on("focus", func);
  }
  get(index) {
    return new JDOM2(this.elem[index]);
  }
  size() {
    return this.elem.length;
  }
  toArray() {
    return [...this.elem];
  }
  contextmenu(func) {
    return this.on("contextmenu", func);
  }
  change(func) {
    return this.on("change", func);
  }
  mouseover(func) {
    return this.on("mouseover", func);
  }
  keypress(func) {
    return this.on("keypress", func);
  }
  keyup(func) {
    return this.on("keyup", func);
  }
  keydown(func) {
    return this.on("keydown", func);
  }
  dblclick(func) {
    return this.on("dblclick", func);
  }
  resize(func) {
    return this.on("resize", func);
  }
  timeupdate(func) {
    return this.on("timeupdate", func);
  }
  touchcancel(func) {
    return this.on("touchcancel", func);
  }
  touchend(func) {
    return this.on("touchend", func);
  }
  touchmove(func) {
    return this.on("touchmove", func);
  }
  touchstart(func) {
    return this.on("touchstart", func);
  }
  drag(func) {
    return this.on("drag", func);
  }
  dragenter(func) {
    return this.on("dragenter", func);
  }
  dragleave(func) {
    return this.on("dragleave", func);
  }
  dragover(func) {
    return this.on("dragover", func);
  }
  dragend(func) {
    return this.on("dragend", func);
  }
  dragstart(func) {
    return this.on("dragstart", func);
  }
  drop(func) {
    return this.on("drop", func);
  }
  focusout(func) {
    return this.on("focusout", func);
  }
  focusin(func) {
    return this.on("focusin", func);
  }
  invalid(func) {
    return this.on("invalid", func);
  }
  popstate(func) {
    return this.on("popstate", func);
  }
  volumechange(func) {
    return this.on("volumechange", func);
  }
  unload(func) {
    return this.on("unload", func);
  }
  offline(func) {
    return this.on("offline", func);
  }
  online(func) {
    return this.on("online", func);
  }
  remove() {
    return this.eachNodes((el) => el.remove());
  }
  ready(func) {
    this.on("DOMContentLoaded", func);
    return this;
  }
  [Symbol.iterator]() {
    return this.elem;
  }
  static new(tag = "div", ...constructorArgs) {
    if (tag.includes("-") && window?.customElements) {
      const customElement = window.customElements.get(tag);
      if (customElement) {
        return new JDOM2(new customElement(...constructorArgs));
      }
    }
    return new JDOM2(document.createElement(tag));
  }
  static component(component, options = {}) {
    return class extends JDOMComponent {
      #value = null;
      constructor() {
        super(options);
        this.#value = state(this.value);
      }
      connectedCallback() {
        super.connectedCallback();
        const $el = new JDOM2(this.mainElement);
        (async () => {
          const res = await component.call(this, $el, this);
          if (res) {
            $el.append(res);
          }
        })();
      }
      set value(val) {
        if (val instanceof Hook)
          this.#value = val;
        else
          this.#value.value = val;
        this.dispatchEvent(new CustomEvent("input:value"));
      }
      get value() {
        return this.#value?.value;
      }
    };
  }
  dispatch(event, options = {}) {
    this.eachNodes((el) => el.dispatchEvent(typeof event === "string" ? new CustomEvent(event, options) : event));
    return this;
  }
  static registerComponent(tag, component = undefined) {
    if (typeof tag === "string") {
      window.customElements.define(tag, component);
      return component;
    }
    if (Array.isArray(tag)) {
      tag.forEach((clazz) => {
        const str = clazz.name;
        const camelCaseStr = str.charAt(0).toLowerCase() + str.slice(1);
        let name = camelCaseStr.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
        name = name.includes("-") ? name : `jdom-${name}`;
        const alreadyRegisted = window.customElements.get(name);
        if (alreadyRegisted) {
          if (alreadyRegisted === clazz) {
            return;
          } else {
            name += `-${++compIndex.value}`;
          }
        }
        window.customElements.define(name, clazz);
      });
      return;
    }
    Object.entries(tag).forEach(([name, comp]) => {
      window.customElements.define(name, comp);
    });
  }
  static ready(callback) {
    new JDOM2(document).ready(callback);
  }
  static escapeHTML(text) {
    const textEl = document.createElement("jdom-internal-text-element");
    textEl.innerText = text;
    return textEl.innerHTML;
  }
  static fromHTML(html) {
    const template = JDOM2.new("div").html(html || "");
    const children = template?.first();
    const el = children.length === 0 ? null : children.length === 1 ? children[0] : children;
    template.remove();
    return el;
  }
}
var JDOM_default = JDOM2;

// ../../src/template/JDOMTemplateParser.js
class JDOMTemplateParser {
  autoCloseTags = ["hr", "br", "input", "img", "meta", "link", "wbr", "source", "keygen", "spacer", "isindex", "track", "param", "embed", "base", "area", "col", "!doctype"];
  constructor() {
    this.index = 0;
    this.elements = [];
  }
  static fromTemplate(parts, ...values) {
    const parser = new JDOMTemplateParser;
    let valuesIndex = 0;
    for (const part of parts) {
      for (const item of part.split("")) {
        parser.elements.push({
          type: "char",
          value: item
        });
      }
      if (valuesIndex < values.length) {
        parser.elements.push({
          type: "value",
          value: values[valuesIndex]
        });
        valuesIndex++;
      }
    }
    return parser;
  }
  get(index = this.index) {
    return this.elements[index];
  }
  next(i = 1) {
    this.index += i;
  }
  hasNext() {
    return this.elements.length > this.index;
  }
  parse() {
    const contents = this.readContent();
    this.index = 0;
    return contents;
  }
  isWhiteSpace(c) {
    if (c === undefined)
      return false;
    if (typeof c !== "string")
      return false;
    return c === "\n" || c === " " || c === "\t" || c === "\v" || c === "\f";
  }
  readTag() {
    let tag = { type: "element", tag: "", attributes: [], body: [], from: this.index, to: 0 };
    let opened = "";
    let tagNameOpened = true;
    let closingTag = false;
    let i = 0;
    while (this.hasNext()) {
      const index = i++;
      const { type, value } = this.get();
      if (!opened) {
        if (tagNameOpened) {
          if (this.isWhiteSpace(value)) {
            tag.attributes = this.readAttributes();
            if (this.get().value === ">") {
              tagNameOpened = false;
              continue;
            }
            if (this.nextIs("/>")) {
              this.next(2);
              break;
            }
          } else if (value === ">") {
            tagNameOpened = false;
            continue;
          } else if (type === "value") {
            tag.tag = value;
          } else if (value !== "<") {
            tag.tag += value;
          }
        }
        if (value === ">") {
          if (typeof tag.tag === "string" && this.autoCloseTags.includes(tag.tag.toLowerCase())) {
            this.next();
            break;
          }
          opened = true;
        }
      } else if (closingTag) {
        break;
      } else {
        tag.body = this.readContent(["script", "style"].includes(tag.tag), tag);
        closingTag = true;
        this.next();
        break;
      }
      this.next();
    }
    tag.to = this.index;
    return tag;
  }
  isClosingTag(tag, ind = -1) {
    const index = this.index - ind;
    const next = `</`;
    if (this.nextIs(next, ind)) {
      let isEnding = false;
      const afterClosingSlash = this.get(index + 2);
      if (afterClosingSlash.type === "value") {
        if (afterClosingSlash.value === tag.tag) {
          isEnding = true;
          tag.attributes.slot = tag.body;
          this.next();
        }
      } else {
        if (typeof tag.tag === "string" && !this.nextIs(tag.tag)) {
          isEnding = true;
          this.next(tag.tag.length);
        }
      }
      if (isEnding) {
        this.next(next.length - 1);
        this.skipEmpty();
        this.next();
      }
      return isEnding;
    }
    return false;
  }
  readAttributes() {
    const attributes = [];
    let inAttribute = false;
    while (this.hasNext()) {
      this.skipEmpty();
      const { type, value } = this.get();
      if (value === ">" || value === "/") {
        break;
      } else {
        const { name, value: attrValue } = this.readAttribute();
        attributes.push([name, attrValue]);
        if (this.get().value === ">" || this.get().value === "/" && this.get(this.index + 1)?.value === ">") {
          break;
        }
      }
      this.next();
    }
    return attributes;
  }
  readAttribute() {
    const out = { name: "", value: true, isLast: false, from: this.index, to: 0 };
    let hasReadName = false;
    let hasReadEquals = false;
    let foundValue = false;
    while (this.hasNext()) {
      this.skipEmpty();
      const { type, value } = this.get();
      if (value === ">")
        break;
      if (!hasReadName) {
        let doBreak = false;
        if (type === "value") {
          out.name = value;
          hasReadName = true;
          continue;
        }
        let [{ value: name }] = this.readUntil(({ type: type2, value: value2 }) => {
          if (value2 === ">") {
            doBreak = true;
            out.isLast = true;
            return true;
          }
          if (value2 === "=" || this.isWhiteSpace(value2)) {
            if (value2 === "=") {
              return true;
            }
            let i = this.index;
            while (this.get(i) && this.isWhiteSpace(this.get(i).value)) {
              i++;
            }
            if (this.get(i).value !== "=") {
              doBreak = true;
              return true;
            }
          }
        });
        if (name === ">")
          break;
        if (!out.name)
          out.name = name.trim();
        if (doBreak)
          break;
        hasReadName = true;
        continue;
      } else if (!hasReadEquals) {
        if (value !== "=" || value === ">") {
          break;
        }
        hasReadEquals = true;
      } else {
        if (type === "value") {
          out.value = value;
          this.next();
          break;
        } else if (!foundValue) {
          let opened = false;
          let val = "";
          let opener = "";
          let i = 0;
          let [{ value: value2 }] = this.readUntil(({ type: type2, value: value3 }) => {
            let doNotAdd = false;
            if (i++ === 0) {
              if (value3 === '"' || value3 === "'")
                opener = value3;
              else
                opener = " ";
            }
            if (opener === " " && (this.isWhiteSpace(value3) || value3 === ">" || this.nextIs("/>"))) {
              return true;
            }
            if (opener !== " " && value3 === opener) {
              if (opened) {
                return true;
              }
              opened = true;
            }
            if (!doNotAdd)
              val += value3;
          });
          out.value = opener === " " ? value2 : value2.substring(1);
          break;
        }
      }
      this.next();
    }
    out.to = this.index;
    return out;
  }
  readUntil(callable2) {
    let out = [];
    let currentStr = "";
    while (this.hasNext()) {
      const { type, value } = this.get();
      if (callable2({ type, value })) {
        if (currentStr !== "")
          out.push({ type: "text", value: currentStr });
        break;
      }
      if (type === "char") {
        currentStr += value;
      } else {
        if (currentStr !== "") {
          out.push({ type: "text", value: currentStr });
          currentStr = "";
        }
        out.push({ type, value });
      }
      this.next();
    }
    return out;
  }
  shipComment() {
    if (this.nextIs("<!--")) {
      while (this.hasNext()) {
        if (this.nextIs("-->")) {
          this.next(3);
          break;
        }
        this.next();
      }
      return true;
    }
    return false;
  }
  readContent(ignoreTags = false, tag = false) {
    const contents = [];
    let currentString = "";
    this.skipEmpty();
    while (this.hasNext()) {
      const { type, value } = this.get();
      if (type === "char") {
        if (value === "<" && !this.isWhiteSpace(this.get(this.index + 1)?.value)) {
          const currentIndex = this.index;
          if (tag !== false && this.isClosingTag(tag, 0)) {
            break;
          } else {
            this.index = currentIndex;
            if (ignoreTags) {
              currentString += "<";
              this.next();
              continue;
            }
          }
          if (currentString !== "") {
            contents.push({ type: "text", value: currentString });
            currentString = "";
          }
          if (this.shipComment())
            continue;
          const newTag = this.readTag();
          if (newTag !== null)
            contents.push(newTag);
          this.skipEmpty();
          continue;
        }
      } else {
        if (currentString !== "") {
          contents.push({ type: "text", value: currentString });
          currentString = "";
        }
        contents.push({ type, value });
        this.next();
        continue;
      }
      currentString += value;
      this.next();
    }
    if (currentString !== "") {
      contents.push({ type: "text", value: currentString });
    }
    return contents;
  }
  skipEmpty() {
    while (this.hasNext() && this.isWhiteSpace(this.get().value)) {
      this.next();
    }
  }
  nextIs(string, startInd = 0) {
    const split = string.split("");
    for (let ind in split) {
      ind = parseInt(ind);
      const current = this.get(this.index + ind + startInd);
      if (current === undefined)
        return false;
      const { type, value } = current;
      if (value !== split[ind])
        return false;
    }
    return true;
  }
}

// ../../src/template/TemplateDOMAdapter.js
class TemplateDOMAdapter {
  ifQueryParts = [];
  constructor(parsed) {
    this.parsed = parsed;
  }
  createElement(conf) {
    let el;
    let svg = false;
    if (typeof conf.tag === "string") {
      if (typeof conf.tag === "string" && conf.tag.toLowerCase() === "!doctype")
        return null;
      if (conf.tag === "svg" || this.inSVG) {
        el = document.createElementNS("http://www.w3.org/2000/svg", conf.tag);
        svg = true;
      } else if (conf.tag.includes("-") && window?.customElements) {
        const customElement = window.customElements.get(conf.tag);
        if (customElement) {
          el = new customElement;
        }
      }
    } else if (conf.tag instanceof Node) {
      el = conf.tag;
    } else if (conf.tag instanceof JDOM_default) {
      el = conf.tag.firstNode();
    } else if (typeof conf.tag === "function") {
      if (conf.tag.prototype && conf.tag.prototype instanceof HTMLElement) {
        el = new conf.tag;
      } else {
        const elAttribs = {};
        if (conf.body.length > 0) {
          elAttribs.$slot = new TemplateDOMAdapter(conf.body).create(svg);
        }
        for (const [key, value] of conf.attributes) {
          if (key === ":bind") {
            elAttribs.value = value;
          } else if (key === ":if" || key === ":else-if" || key === ":else") {
          } else {
            elAttribs[key] = value;
          }
        }
        let called = conf.tag(elAttribs);
        let newEl = this.createFromValue({ value: called });
        for (const [key, value] of conf.attributes) {
          if (key === ":if" || key === ":else-if" || key === ":else") {
            [newEl] = this.addControlFlow(key, value, newEl, false, false, () => null);
          }
        }
        return newEl;
      }
    }
    if (!el) {
      el = document.createElement(conf.tag);
    }
    let addChildren = true;
    let addedChildren = false;
    const attributes = [];
    const events = {};
    let onCreate = () => {
    };
    let model = null;
    const usingJDOMComponent = el instanceof JDOMComponent;
    const setup = (elem = el) => {
      addedChildren = true;
      for (const element of new TemplateDOMAdapter(conf.body).create(svg)) {
        this.appendElement(elem, element);
      }
      attributes.forEach(([key, value]) => {
        const setValue = (key2, value2) => {
          if (key2 === "style") {
            if (typeof value2 === "object") {
              elem.style = "";
              Object.entries(value2).forEach(([key3, value3]) => {
                if (value3 instanceof Hook) {
                  const hook = value3;
                  const listener = (v) => elem.style[key3] = v;
                  elem.addEventListener(":detached", () => hook.removeListener(listener));
                  elem.addEventListener(":attached", () => {
                    hook.addListener(listener);
                    listener(hook.value);
                  });
                  value3 = hook.value;
                }
                elem.style[key3] = value3;
              });
              return;
            }
          }
          if (key2 === "class") {
            if (typeof value2 !== "string") {
              let classes = [];
              if (Array.isArray(value2)) {
                classes = value2;
              } else if (typeof value2 === "object") {
                Object.entries(value2).forEach(([key3, value3]) => {
                  if (value3 instanceof Hook) {
                    const hook = value3;
                    const listener = (v) => {
                      console.log("Hok");
                      if (v && !elem.classList.contains(key3)) {
                        elem.classList.add(key3);
                      } else if (!v && elem.classList.contains(key3)) {
                        elem.classList.remove(key3);
                      }
                    };
                    elem.addEventListener(":detached", () => {
                      console.log("hok bom");
                      hook.removeListener(listener);
                    });
                    elem.addEventListener(":attached", () => {
                      hook.addListener(listener);
                      listener(hook.value);
                    });
                    value3 = hook.value;
                  }
                  if (value3) {
                    classes.push(key3);
                  }
                });
              }
              [...elem.classList].filter((el2) => !classes.includes(el2)).forEach((el2) => elem.classList.remove(el2));
              classes.filter((el2) => !elem.classList.contains(el2)).forEach((el2) => elem.classList.add(el2));
              return;
            }
          }
          if (usingJDOMComponent) {
            if (key2.endsWith(".attr")) {
              elem.setAttribute(key2.replace(".attr", ""), value2);
            } else if (key2.endsWith(".unhook")) {
              elem[key2] = value2;
            } else if (elem[key2] instanceof Hook && !(value2 instanceof Hook)) {
              elem[key2].value = value2;
            } else {
              elem[key2] = value2;
            }
            return;
          }
          elem.setAttribute(key2, value2);
        };
        if (value instanceof Hook) {
          const listener = value.addListener(() => {
            setValue(key, value);
          });
          setValue(key, value);
          elem.addEventListener(":detached", () => value.removeListener(listener));
        } else {
          setValue(key, value);
        }
      });
      if (model) {
        if (usingJDOMComponent) {
          elem.value = model;
          model.addListener(() => {
            elem.dispatchEvent(new InputEvent("input:value"));
          });
        } else {
          elem.addEventListener("input", () => {
            if (elem.value !== model.value) {
              model.value = elem.value;
            }
          });
          model.addListener((val) => {
            if (elem.value !== model.value) {
              elem.value = val;
              elem.dispatchEvent(new InputEvent("input:value"));
            }
          });
          elem.value = model.value;
        }
      }
      for (const [key, value] of Object.entries(events)) {
        const eventNameParts = key.split(".");
        const eventName = eventNameParts.shift();
        let handler = typeof value === "function" ? value : () => {
        };
        if (eventNameParts.length > 0) {
          const events2 = [];
          for (const part of eventNameParts) {
            switch (part.toLowerCase()) {
              case "prevent":
                events2.push((e) => e.preventDefault());
                break;
              case "stop":
                events2.push((e) => e.stopPropagation());
                break;
            }
          }
          const oldHandler = handler;
          handler = (e) => {
            events2.forEach((ev) => ev(e));
            oldHandler(e);
          };
        }
        elem.addEventListener(eventName, handler);
      }
      onCreate(elem);
    };
    for (let [key, value] of conf.attributes) {
      if (typeof key === "function") {
        key = key();
      }
      if (typeof key === "object") {
        Object.entries(key).forEach(([key2, value2]) => attributes.push([key2, value2]));
        continue;
      }
      if (key.startsWith("@")) {
        events[key.substring(1)] = value;
      } else if (key === ":ref") {
        if (value instanceof Hook) {
          value.value = el;
        } else if (typeof value.value === "function") {
          value.value(el);
        } else {
          console.error(":ref value is not a type of Hook or function.");
        }
      } else if (key === ":bind") {
        model = value;
      } else if (key === ":html") {
        const getValue = () => value instanceof Hook ? value.value : value;
        if (value instanceof Hook) {
          value.addListener(() => {
            el.innerHTML = getValue();
          });
        }
        el.innerHTML = getValue();
      } else if (key === ":if" || key === ":else" || key === ":else-if") {
        [el, addChildren] = this.addControlFlow(key, value, el, addChildren, addedChildren, setup);
      } else if (key === "@:create") {
        onCreate = value;
      } else {
        attributes.push([key, value]);
      }
    }
    if (addChildren) {
      setup();
    }
    return el;
  }
  addControlFlow(key, value, el, addChildren, addedChildren, setup) {
    let deps = null;
    let destroy = () => null;
    if (key === ":if") {
      [el, addChildren, destroy] = this.bindIf(el, value, addChildren, addedChildren, setup);
      this.ifQueryParts.push(["IF", value, el, [value], destroy]);
    } else if (key === ":else-if") {
      const [, , , deps2] = this.ifQueryParts.pop();
      const comp = computed(() => {
        for (const dep of deps2) {
          if (dep.value)
            return false;
        }
        return value.value;
      }, [value, ...deps2]);
      let destroy2;
      [el, addChildren, destroy2] = this.bindIf(el, comp, addChildren, addedChildren, setup);
      this.ifQueryParts.push(["ELSE-IF", comp, el, [...deps2, comp], destroy2]);
    } else if (key === ":else") {
      const [type, state2, _, deps2] = this.ifQueryParts.pop();
      [el, addChildren] = this.bindIf(el, computed(() => {
        for (const dep of deps2) {
          if (dep.value)
            return false;
        }
        return true;
      }, [state2, ...deps2]), addChildren, addedChildren, setup);
    }
    return [el, addChildren, destroy, deps];
  }
  bindIf(el, state2, addChildren = true, addedChildren = false, setup = () => {
  }) {
    const savedElement = el;
    const commentElement = document.createComment("JDOM-Templating:if");
    let lastValue = false;
    const getValue = () => {
      lastValue = state2 instanceof Hook ? state2.value : state2;
      return lastValue;
    };
    if (getValue()) {
      el = savedElement;
      addedChildren = true;
    } else {
      el = commentElement;
      addChildren = false;
    }
    let toRepl = el;
    let listener;
    if (state2 instanceof Hook) {
      listener = state2.addListener((value) => {
        if (lastValue === value)
          return;
        lastValue = value;
        if (value) {
          if (!addedChildren) {
            setup(savedElement);
            addedChildren = true;
          }
          toRepl = this.replaceElement(toRepl, savedElement);
          el = savedElement;
        } else {
          toRepl = this.replaceElement(toRepl, commentElement);
          el = commentElement;
        }
      });
    }
    return [el, addChildren, () => listener ? state2.removeListener(listener) : null];
  }
  createText({ value }) {
    const el = document.createTextNode("");
    el.textContent = value;
    return el;
  }
  createFromValue({ value }) {
    if (value instanceof Hook) {
      const state2 = value;
      const isArray = Array.isArray(state2.value);
      let outputElement = null;
      let stateListener;
      const hookListener = state2.addListener((val) => {
        if (!(isArray && Array.isArray(val) || !isArray && !Array.isArray(val))) {
          if (outputElement) {
            this.replaceElement(outputElement, this.createFromValue({ value }));
            value.removeListener(hookListener);
            if (stateListener) {
              state2.removeListener(stateListener);
            }
          }
        }
      });
      if (isArray) {
        const comment = document.createComment("JDOM-Templating:arrhook1");
        outputElement = comment;
        let elements = [];
        const setElements = () => {
          for (const item of elements) {
            this.removeElement(item);
          }
          if (!Array.isArray(state2.value)) {
            this.replaceElement(outputElement, this.createFromValue({ value: state2.value }));
            state2.removeListener(stateListener);
            return;
          }
          let lastEl = comment;
          let i = 0;
          for (const item of state2.value) {
            let itemEls = this.createFromValue({ value: item });
            if (!Array.isArray(itemEls))
              itemEls = [itemEls];
            const currentIndex = i++;
            elements = [...elements, ...itemEls];
            itemEls.forEach((e) => {
              lastEl = this.afterElement(lastEl, e);
              const addReplaceListener = (toRepl) => {
                toRepl.addEventListener(":replaced_with", ({ detail: { to } }) => {
                  for (const e2 of to) {
                    addReplaceListener(e2);
                    elements.push(e2);
                  }
                });
                toRepl.addEventListener(":attached", () => {
                  elements.push(toRepl);
                });
                toRepl.addEventListener(":detached", () => {
                  elements = elements.filter((e2) => e2 !== toRepl);
                });
              };
              addReplaceListener(lastEl);
            });
          }
        };
        stateListener = state2.addListener(() => {
          setElements();
        });
        setElements();
        return [comment, ...elements];
      } else if (typeof state2.value === "string" || typeof state2.value === "number" || typeof state2.value === "boolean") {
        outputElement = this.createText({ value: state2.value });
        const listener = state2.addListener(() => {
          if (typeof state2.value === "string" || typeof state2.value === "number" || typeof state2.value === "boolean") {
            outputElement.textContent = state2.value;
          } else {
            this.replaceElement(outputElement, this.createFromValue({ value }));
            state2.removeListener(listener);
          }
        });
        return outputElement;
      } else {
        outputElement = this.createFromValue({ value: state2.value });
        stateListener = state2.addListener(() => {
          let element = this.createFromValue({ value: state2.value });
          outputElement = this.replaceElement(outputElement, element);
        });
        return outputElement;
      }
    } else if (value instanceof JDOM_default || value instanceof Node || value instanceof NodeList) {
      return new JDOM_default(value).nodes();
    } else if (Array.isArray(value)) {
      return value.map((e) => this.createFromValue({ value: e })).reduce((s, e) => Array.isArray(e) ? [...s, ...e] : [...s, e], []);
    } else if (value instanceof Promise) {
      let comment = document.createComment("JDOM-Templating:promise");
      value.then((el) => {
        let elements = this.createFromValue({ value: el });
        comment = this.replaceElement(comment, elements);
      });
      return comment;
    } else if (Array.isArray(value)) {
      return value.map((e) => {
        let el = this.createFromValue({ value: e });
        return Array.isArray(el) ? el[0] ?? null : el;
      });
    }
    return this.createText({ value });
  }
  getEvaluatedElement(element) {
    const elements = [];
    if (element.type === "text") {
      elements.push(this.createText(element));
    } else if (element.type === "element") {
      elements.push(this.createElement(element));
    } else if (element.type === "value") {
      let valElements = this.createFromValue(element);
      if (!Array.isArray(valElements))
        valElements = [valElements];
      for (let valElement of valElements) {
        elements.push(valElement);
      }
    }
    return elements;
  }
  removeElement(el) {
    el.dispatchEvent(new CustomEvent(":detach"));
    el.remove();
    el.dispatchEvent(new CustomEvent(":detached"));
  }
  replaceElement(from, to) {
    const replElements = Array.isArray(from) ? [...from] : [from];
    const endElements = Array.isArray(to) ? [...to] : [to];
    const finalEndElements = [...endElements];
    if (endElements.length === 0)
      endElements.push(document.createComment("JDOM-Templating:REPLACEMENT"));
    const finalEnd = [...endElements];
    const firstEl = replElements.shift();
    const firstEndEl = endElements.shift();
    firstEl.dispatchEvent(new CustomEvent(":replace_with", { detail: { to: finalEndElements } }));
    firstEl.dispatchEvent(new CustomEvent(":detach"));
    firstEndEl.dispatchEvent(new CustomEvent(":child_attach"));
    firstEl.replaceWith(firstEndEl);
    replElements.forEach((e) => this.removeElement(e));
    firstEl.dispatchEvent(new CustomEvent(":detached"));
    firstEndEl.dispatchEvent(new CustomEvent(":child_attached"));
    let lastEl = firstEndEl;
    firstEndEl.dispatchEvent(new CustomEvent(":attach"));
    endElements.forEach((e) => {
      lastEl = this.afterElement(lastEl, e);
    });
    firstEndEl.dispatchEvent(new CustomEvent(":attached"));
    firstEl.dispatchEvent(new CustomEvent(":replaced_with", { detail: { to: finalEndElements } }));
    return finalEnd;
  }
  appendElement(to, el) {
    to.dispatchEvent(new CustomEvent(":child_attach"));
    el.dispatchEvent(new CustomEvent(":attach"));
    to.append(el);
    to.dispatchEvent(new CustomEvent(":child_attached"));
    el.dispatchEvent(new CustomEvent(":attached"));
  }
  afterElement(to, el) {
    to.dispatchEvent(new CustomEvent(":child_attach_after"));
    el.dispatchEvent(new CustomEvent(":attach"));
    to.after(el);
    to.dispatchEvent(new CustomEvent(":child_attached_after"));
    el.dispatchEvent(new CustomEvent(":attached"));
    return el;
  }
  beforeElement(to, el) {
    to.dispatchEvent(new CustomEvent(":child_attach_before"));
    el.dispatchEvent(new CustomEvent(":attach"));
    to.before(el);
    to.dispatchEvent(new CustomEvent(":child_attached_before"));
    el.dispatchEvent(new CustomEvent(":attached"));
  }
  create(inSVG = false) {
    this.inSVG = inSVG;
    const elements = [];
    for (let element of this.parsed) {
      this.getEvaluatedElement(element).forEach((e) => {
        if (Array.isArray(e)) {
          e.forEach((ce) => elements.push(ce));
        } else {
          elements.push(e);
        }
      });
    }
    return elements.filter((e) => e !== null && e !== undefined);
  }
}

// ../../src/template/TemplateJDOMAdapter.js
class TemplateJDOMAdapter extends TemplateDOMAdapter {
  create() {
    return new JDOM_default(super.create());
  }
}

// ../../src/template/template.js
function html(strings, ...values) {
  const parser = JDOMTemplateParser.fromTemplate(strings, ...values);
  const parsed = parser.parse();
  const adapter = new TemplateJDOMAdapter(parsed);
  return adapter.create();
}
function css(strings, ...values) {
  let out = "";
  let i = 0;
  for (const str of strings) {
    out += str;
    if (values[i]) {
      out += values[i];
      i++;
    }
  }
  return out;
}

// ../../index.js
var $n = JDOM_default.new;
var $c = JDOM_default.component;
var $r = JDOM_default.registerComponent;
var $h = JDOM_default.fromHTML;
var $escHTML = JDOM_default.escapeHTML;
var html2 = html;
var css2 = css;
var JDOMComponent6 = JDOMComponent;
var computed2 = computed;

// ../../src/decorators.ts
function CustomElement(name = undefined) {
  return function(target) {
    if (name === undefined) {
      JDOM_default.registerComponent([target]);
      return;
    }
    JDOM_default.registerComponent(name, target);
  };
}

// main.ts
class ToDoApp extends JDOMComponent6 {
  tasks = new Hook([]);
  tasksList = computed2(() => this.tasks.value.map((task, index) => html2`
        <li class=${{ done: task.done }}>
            <span @click=${() => this.toggleDone(index)}>
                ${task.text}
            </span>
            <button @click=${() => this.removeTask(index)}>Remove</button>
        </li>
    `));
  newTaskText = new Hook("");
  constructor() {
    super();
  }
  addTask() {
    if (this.newTaskText.value.trim()) {
      this.tasks.value = [...this.tasks.value, { text: this.newTaskText.value.trim(), done: false }];
      this.newTaskText.value = "";
    }
  }
  toggleDone(index) {
    this.tasks.value = this.tasks.value.map((task, i) => index === i ? { ...task, done: !task.done } : task);
  }
  removeTask(index) {
    this.tasks.value = this.tasks.value.filter((_, i) => i !== index);
  }
  render() {
    console.log(this.tasks);
    console.log(this.tasksList);
    console.log(this.tasks);
    return html2`
            <div id="todo-app">
                <input 
                    type="text" 
                    placeholder="Add a new task" 
                    :bind=${this.newTaskText}
                    @keyup=${(e) => e.key === "Enter" && this.addTask()}
                />
                <button @click=${() => this.addTask()}>Add Task</button>
                <ul>
                    ${this.tasksList}
                </ul>
            </div>
        `;
  }
  styles() {
    return css2`
            input, button {
                padding: 10px;
                margin: 5px;
            }
            
            .done {
                text-decoration: line-through;
            }
        `;
  }
}
ToDoApp = __legacyDecorateClassTS([
  CustomElement("todo-app")
], ToDoApp);
