import { $, $r, state, computed, html, JDOMComponent } from '../../index.js';




class CounterComponent extends JDOMComponent {
    counter = state(0)

    setup() {
        this.counter.value = 5
    }

    render() {
        return html`
            <div>
                <h2>in func comp</h2>
                <span>${this.counter}</span> - <span>${computed(() => this.counter.value * 5)}</span>
                <br>
                <button @click=${() => this.counter.value++}>UP</button>
                <button @click=${() => this.counter.value--}>DOWN</button>
            </div>
        `
    }
}

$r('counter-component', CounterComponent)


const ExampleFunction = ({ counter }) => {
    return html`
        <div>
            <h2>in func comp</h2>
            <span>${counter}</span> - <span>${computed(() => counter.value * 5)}</span>
            <br>
            <button @click=${() => counter.value++}>UP</button>
            <button @click=${() => counter.value--}>DOWN</button>
        </div>
    `
}

const exampleCounter = state(0)
html`
    <div>
        <h2>outer</h2>
        <span>${exampleCounter}</span> - <span>${computed(() => exampleCounter.value * 5)}</span>
        <br>
        <button @click=${() => exampleCounter.value++}>UP</button>
        <button @click=${() => exampleCounter.value--}>DOWN</button>
    </div>
    
    
    <${ExampleFunction} counter=${exampleCounter} />


    <${CounterComponent} counter=${exampleCounter} />
    
    <div>
        <span style=${{
            opacity: computed(() => exampleCounter.value / 100)
        }}>Test1</span>
        <span class=${{
            test: exampleCounter
        }}>Test1</span>
    </div>
`.appendTo(document.body)