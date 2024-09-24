import { $, $r, state, computed, html, JDOMComponent } from '../../index.js';

class Test2 extends JDOMComponent {
    test = state('Test2')

    constructor() {
        super()
    }
    render() {
        console.log(this.test)
        return html`a: ${this.test}`
    }
}
$r('test-app', Test2)

class Test {
    image = state('Test1')
    create(){
        html`<${Test2} test=${this.image} /> <button @click=${() => this.image.value = 'OOO'}>OO</button>`.appendTo(document.body);
    }
}

new Test().create()




const tasks = state([]);

// Function to add a new task
const addTask = text => {
    console.log('Added', text)
    if (text) {
        tasks.value = [...tasks.value, { text, done: false }];
    }
    return true
};

// Function to toggle the done state of a task
const toggleDone = index => {
    tasks.value = tasks.value.map((task, i) =>
        i === index ? { ...task, done: !task.done } : task
    );
};

// Function to remove a task
const removeTask = index => {
    tasks.value = tasks.value.filter((_, i) => i !== index);
};

// Define the component for a single task
const TaskItem = ({ task, index }) => html`
  <li class="${task.done ? 'done' : ''}">
    <span @click=${() => toggleDone(index)}>
      ${task.text}
    </span>
    <button @click=${() => removeTask(index)}>Remove</button>
  </li>
`;

// Define the component for the task input form
const TaskInput = () => {
    let input = state('');

    const enterEvent = e => {
        if (e.key === 'Enter') {
            addTask(input.value)
            input.value = ''
        }
    }

    const clickEvent = () => {
        addTask(input.value)
        input.value = ''
    }

    return html`
        <div>
          <input type="text" placeholder="Add a new task" :bind=${input}
            @keyup=${enterEvent}
          />
          <button @click=${clickEvent}>
            Add Task
          </button>
        </div>
      `;
};

// Define the main app component combining the task list and the input form
const App = () => html`
  <div id="todo-app">
    ${TaskInput()}
    <ul>
      ${computed(() => tasks.value.map((task, index) => TaskItem({ task, index })), [tasks])}
    </ul>
  </div>
`;

// Attach the main app component to the document
$(document.body).append(App());