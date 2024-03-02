# JDOM `3.0.0`
## A wrapper for query selector and html elements + templating & reactivity framework

## Install
### NPM
```bash
npm install jdomjs
```

### Module
```js
import { $, $n, $c, $r, $h, JDOM } from 'https://cdn.jsdelivr.net/npm/jdomjs@3.0.0/index.js'
```

### HTML import
```js
<script src="https://cdn.jsdelivr.net/npm/jdom@3.0.0/dist/jdom.js"></script>
```

## DOM-Modfier Usage
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

# JDOM-Template
```js
import { html } from 'jdomjs'

const name = "John"

const myHTML = html`
    <h1>Hello ${name}</h1>
    <button @click=${() => alert('Clicked')}>Click me</button>
`

$(document).append(myHTML)

// Reactivity

import { state, html } from 'jdomjs'

const count = state(0)

const button = html`
    <button @click=${() => count.value++}>The count is ${count}</button>
`
$(document).append(button)

// if-condition
html`
    <div :if=${isEnabled} @click=${() => alert('Yo')}>
        Now I'm shown :o
    </div>
    
    <!-- Or (Might be interesting for components) -->
    ${computed(() => isEnabled.value ? html`<div>Now shown!</div>` : null, [isEnabled])}
`

// for-each
html`
    ${computed(() => elements.value.map(user => html`
        <div>
            <span>${user.name}</span>
        </div>
    `), [elements])}

    <button @click=${() => elements.value = [...elements.value, {name: 'Joe'}]}>Add Element</button>
`

// binding
const name = state('John')

html`
    name: ${name} <br>
    <input :bind=${name}>
`
```

# Reactivity (JDOM-Hooks)
```js
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
}, [name]) // <- Dependencies

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