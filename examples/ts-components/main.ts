import {JDOMComponent, $, html, css, computed, comp} from '../../index.js';
import {Attribute, Computed, CustomElement, State, Watch} from '../../src/decorators';
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

    @Computed(s => [s.tasks])
    tasksList() {
        return this.tasks.value.map((task, index) => html`
            <li class=${{ 'done': task.done }}>
                <span @click=${() => this.toggleDone(index)}>
                    ${task.text}
                </span>
                <button @click=${() => this.removeTask(index)}>Remove</button>
            </li>
        `)
    }

    render() {
        return html`
            <div id="todo-app">
                <input 
                    type="text" 
                    placeholder="Add a new task" 
                    :bind=${this.newTaskText}
                    @keyup=${(e: KeyboardEvent) => e.key === 'Enter' && this.addTask()}
                />
                <button @click=${() => this.addTask()}>Add Task</button>
                <ul>
                    ${this.tasksList}
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