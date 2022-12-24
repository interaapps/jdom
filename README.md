# JDOM `2.0.0`
# A wrapper for query selector and html elements

## Install
### NPM
```bash
npm install jdomjs
```

### Module
```js
import { $, $n, JDOM } from 'https://cdn.jsdelivr.net/npm/jdomjs@2.0.0/index.js'
```

### HTML import
```js
<script src="https://cdn.jsdelivr.net/npm/jdom@2.0.0/dist/cajax.js"></script>
```

## Usage
```js
const el = $('#a-div')

el.css({
    background: '#000000'
})

el.each(el => {
    console.log($(el).html())
})

el.text('Hello world')

el.html('<span>Hello</span> world')

el.click(e => {
    console.log(e)
})
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