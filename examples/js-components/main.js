import { JDOMComponent, $, html, css, computed } from '../../index.js';
import Hook from "../../src/Hook.js";

class ToDoApp extends JDOMComponent {
    tasks = new Hook([]);
    newTaskText = new Hook('');
    constructor() {
        super();
    }

    addTask() {
        if (this.newTaskText.value.trim()) {
            this.tasks.value = [...this.tasks.value, { text: this.newTaskText.value.trim(), done: false }];
            this.newTaskText.value = ''; // Clear input field
        }
    }

    toggleDone(index) {
        this.tasks.value = this.tasks.value.map((task, i) =>
            index === i ? { ...task, done: !task.done } : task
        );
    }

    removeTask(index) {
        this.tasks.value = this.tasks.value.filter((_, i) => i !== index);
    }

    render() {
        return html`
            <div id="todo-app">
                <input 
                    type="text" 
                    placeholder="Add a new task" 
                    :bind=${this.newTaskText}
                    @keyup=${(e) => e.key === 'Enter' && this.addTask()} 
                />
                <button @click=${() => this.addTask()}>Add Task</button>
                <ul>
                    ${computed(() => this.tasks.value.map((task, index) => html`
                        <li class=${{ 'done': task.done }}>
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

// Register custom element
window.customElements.define('todo-app', ToDoApp);