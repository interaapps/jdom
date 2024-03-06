# JDOM `3.1.1`
## A wrapper for query selector and html elements + templating & reactivity framework

- [Installation or embedding](#install)
- JDOM
  - [DOM Manipulation](#dom-manipulation)
  - [Create Element](#create-element)
  - [Animator](#animator)
- [Web-Components](#web-components)
- [Typescript Component](#typescript-class-component)
- [Typescript Component](#javascript-class-component)

- [JDOM-Template](#jdom-template) Create Projects with JS-Template Strings with reactivity
  - [Reactivity](#reactivity)
  - [if-conditions](#if-confitions)
  - [Reactive For-Each](#reactive-for-each)
  - [Function Components](#reactive-for-each)


- [JDOM-Hooks (For JDOM & JDOM-Template)](#jdom-hooks)


## Install
### NPM
```bash
npm install jdomjs
```

### Module
```js
import { $, $n, $c, $r, $h, JDOM } from 'https://cdn.jsdelivr.net/npm/jdomjs@3.1.1/index.js'
```

### HTML import
```js
<script src="https://cdn.jsdelivr.net/npm/jdom@3.1.1/dist/jdom.js"></script>
```

## DOM Manipulation
```js
const el = $('#a-div')

el.css({
    background: '#000000'
})

el.each($el => {
    console.log(el.html())
})

el.text('Hello world')

el.html('<span>Hello</span> world')

el.attr('key', value)

el.classes('hello', 'world')

if (el.hasClass('hello')) {}

// Builder pattern
el.text('Example').attr('type', 'text').classes('input-big')


el.click(e => {
    console.log(e)
})
```


### Create Element
```js
$('#app').append(
    // Creates a new div with 'Hey' text
    $n('div').text('Hey')
)
```

#### Create element from HTML
```js
const name = 'John'
const el = $h(`<h1>Hello ${name}!</h1>`)
console.log(el)
// -> JDOM(HTMLElement)
```

### Animator
```js
// Single animation
$('#test').animate({
    background: '#000000'
}, 1000)

// Using animator
$('#test').animator([
    {
        duration: 1000,
        css: {
            background: '#FF0000'
        }
    },
    {
        duration: 1000,
        css: {
            background: '#00FF00'
        }
    }
])
```

# Web-Components
```html
<my-component></my-component>

<script>
// Create HTMLElement
const MyComponent = $c((el, component) => {
    el.append(
        $n('span')
            .text('Hello World')
            .click(() => {
                alert('Hey')
            })
    )

    component.addStyle(`span { color: red }`)
}/*, {shadowed: true} */)

// Register component
$r('my-component', MyComponent)
</script>
```

# Typescript Class-Component

```ts
import {html, JDOMComponent} from 'jdomjs'
import {CustomElement, State, Attribute} from "jdomjs/decorator.ts";

@CustomElement('example-component')
class ExampleComponent extends JDOMComponent {
  @State()
  private name: Hook<String> = 'John'

  @State()
  @Attribute({ name: 'last-name' })
  private lastName: Hook<String> = 'default'

  @Computed(s => [s.name])
  private greetings() {
    return comp`Hello ${this.name}`
  }

  render() {
    return html`
            <input :bind=${this.name}>
            <h1>${this.greetings}</h1>
          `
  }
}
```

# Javascript Class-Component

```ts
import {html, JDOMComponent, $r} from 'jdomjs'

class ExampleComponent extends JDOMComponent {
  private name = new Hook('John')

  private lastName = new Hook('default')

  constructor() {
    super();
    this.addAttributeListener('lastName', { name: 'last-name' })
  }

  private greetings() {
    return comp`Hello ${this.name}`
  }

  render() {
    return html`
            <input :bind=${this.name}>
            <h1>${this.greetings()}</h1>
          `
  }
}

$r('example-component', ExampleComponent)
```

# JDOM-Template
```js
import { html } from 'jdomjs'

const name = "John"

const myHTML = html`
    <h1>Hello ${name}</h1>
    <button @click=${() => alert('Clicked')}>Click me</button>
`

$(document).append(myHTML)

// binding
const name = state('John')

html`
    name: ${name} <br>
    <input :bind=${name}>
`
```

### Reactivity
```js
import { state, html, $ } from 'jdomjs'

const count = state(0)

const button = html`
    <button @click=${() => count.value++}>The count is ${count}</button>
`
$(document).append(button)
```

### if-confitions
```js
// if-condition
html`
    <!-- Reactive if condition with ternary operator -->
    ${computed(() => 
        isEnabled.value 
            ? html`<div>Now shown!</div>` // If true render this div 
            : null, // If false render nothing
    [isEnabled])}
    
    <!-- :if attribute -->
    <div :if=${isEnabled} @click=${() => alert('Yo')}>
        Now I'm shown :o
    </div>
    <div :else>
        Not shown :(
    </div>
    <div></div>
`
```
### Reactive for-each
```js
html`
    ${computed(() => elements.value.map(user => html`
        <div>
            <span>${user.name}</span>
        </div>
    `), [elements])}

    <button @click=${() => elements.value = [...elements.value, {name: 'Joe'}]}>Add Element</button>
`

// Or use Helper-Component
import { ForEach } from 'jdomjs/src/template/helper/components.js'
html`
    <${ForEach} 
        :bind=${elements}
        :content=${user => html`
            <div>
                <span>${user.name}</span>
            </div>
        `}
    />
    
    <button @click=${() => elements.value = [...elements.value, {name: 'Joe'}]}>Add Element</button>
`
```

### Function-Components
```js
// Function components
function UserLayout({ exampleProp, $slot }) {
    return html`<div class="user-profile">
        ${$slot}
    </div>`
}

html`<${UserLayout} exampleProp="test">
    Profile
</${UserLayout}>`
```

### Promise-Handling
```js
const promise = fetch('/user/name') 
html`${promise.then(r => r.json()).then(u => u.name)}`

// Or use Helper-Component
import { Awaiting } from 'jdomjs/src/template/helper/components.js'

const promise = fetch('/api/user')
html`
    <${Awaiting} 
        promise=${promise.then(r => r.json())}
        finished=${user => html`<${User} user=${user} />`}
        awaiting${html`<${LoadingIndicator} />`}
        error="Something went wrong"
    />
`
```

# JDOM-Hooks
```js
import { state, computed, watch, bind, $, $c, $r, html } from 'jdom'

// Create a state
const name = state('John')

// Set value
name.value = 'Jessica'

// Read value
console.log(name.value)

// Add to JDOM
$('#user-name').text(name)

// Add to jdom-template
html`Hello ${name}`



// computed
const lowerCaseName = computed(() => {
    return name.value.toLowerCase()
}, [name]) // <- Dependencies. The function given will be called if one of the dependencies change

// Helper template-string-tag:
const greeting = comp`Hello ${name}!`


// Watch
watch([name], () => {
    console.log(`Name changed to ${name}!`)
})


// Bindings in components
$r('my-example-component', $c((el, component) => {
    const value = bind(component)
    
    return html`Your name is ${value}`
}))
// <my-example-component value="test" /> -> Your name is test 
```