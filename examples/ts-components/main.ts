import {JDOMComponent, $, html, css, computed, comp} from '../../index.js';
import {Computed, CustomElement, State} from '../../src/decorators.ts';
import Hook from "../../src/Hook";

interface Task {
    text: string;
    done: boolean;
}

@CustomElement('todo-app')
class ToDoApp extends JDOMComponent {
    @State()
    private tasks: Hook<Task> = [];

    @State()
    private newTaskText: Hook<String> = '';

    constructor() {
        super();
    }

    addTask() {
        if (this.newTaskText.value.trim()) {
            this.tasks = [...this.tasks.value, { text: this.newTaskText.value.trim(), done: false }];
            this.newTaskText = ''; // Clear input field
        }
    }

    toggleDone(index: number) {
        this.tasks = this.tasks.value.map((task, i) =>
            index === i ? { ...task, done: !task.done } : task
        );
    }

    removeTask(index: number) {
        this.tasks = this.tasks.value.filter((_, i) => i !== index);
    }

    render() {
        return html`
            <div id="todo-app">
                <input type="text" placeholder="Add a new task" :bind=${this.newTaskText}
                       @keyup=${(e: KeyboardEvent) => e.key === 'Enter' && this.addTask()} />
                <button @click=${this.addTask.bind(this)}>Add Task</button>
                <ul>
                    ${computed(() => this.tasks.value.map((task, index) => html`
                        <li class="${task.done ? 'done' : ''}">
                            <span @click=${() => this.toggleDone(index)}>
                                ${task.text}
                            </span>
                            <button @click=${() => this.removeTask(index)}>Remove</button>
                        </li>
                    `), [this.tasks])}
                </ul>
            </div>
        `;
    }

    styles() {
        return css`
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

$(document).append(new ToDoApp());

@CustomElement('example-component')
class ExampleComponent extends JDOMComponent {
    @State()
    private name: Hook<String> = 'Hello World'

    @Computed(s => [s.name])
    private greetings() {
        return comp`Hello ${this.name}`
    }

    render() {
        return html`
            <h1>${this.greetings}</h1>
            <input :bind=${this.name}>
          `
    }
}

$(document).append(new ExampleComponent())