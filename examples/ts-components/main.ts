import {JDOMComponent, $, html, css, computed, comp} from '../../index.js';
import {Attribute, CustomElement} from '../../src/decorators';
import Hook from "../../src/Hook";

interface Task {
    text: string;
    done: boolean;
}

@CustomElement('todo-app')
class ToDoApp extends JDOMComponent {
    public tasks = new Hook<Task[]>([]);

    public tasksList = computed(() => this.tasks.value.map((task, index) => html`
        <li class=${{ 'done': task.done }}>
            <span @click=${() => this.toggleDone(index)}>
                ${task.text}
            </span>
            <button @click=${() => this.removeTask(index)}>Remove</button>
        </li>
    `));

    private newTaskText = new Hook<String>('');

    constructor() {
        super();
    }

    addTask() {
        if (this.newTaskText.value.trim()) {
            this.tasks.value = [...this.tasks.value, { text: this.newTaskText.value.trim(), done: false }];
            this.newTaskText.value = ''; // Clear input field
        }
    }

    toggleDone(index: number) {
        this.tasks.value = this.tasks.value.map((task, i) =>
            index === i ? { ...task, done: !task.done } : task
        );
    }

    removeTask(index: number) {
        this.tasks.value = this.tasks.value.filter((_, i) => i !== index);
    }

    render() {
        console.log(this.tasks)
        console.log(this.tasksList)
        console.log(this.tasks)
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