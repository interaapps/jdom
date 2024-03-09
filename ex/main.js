import { JDOMComponent, html, $r, $, computed, Hook } from 'https://esm.run/jdomjs@3.1.7'

class MyComponent extends JDOMComponent {
    example = new Hook('Hello World')

    render() {
        setTimeout(() => this.example.value = "Yooo", 5000)

        return html`
            <div>${computed(() => this.example.value, [this.example])}</div>
        `
    }
}

$r('my-component', MyComponent)

$(document).append(html`<my-component></my-component>`)