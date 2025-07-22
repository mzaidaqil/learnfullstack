// Todo App JavaScript
class TodoApp {
    constructor() {
        this.todos = this.loadTodos();
        this.todoInput = document.getElementById('todoInput');
        this.addBtn = document.getElementById('addBtn');
        this.todoList = document.getElementById('todoList');
        this.emptyState = document.getElementById('emptyState');
        this.totalTasks = document.getElementById('totalTasks');
        this.completedTasks = document.getElementById('completedTasks');
        
        this.init();
    }
    
    init() {
        // Event listeners
        this.addBtn.addEventListener('click', () => this.addTodo());
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTodo();
            }
        });
        
        // Initial render
        this.render();
    }
    
    addTodo() {
        const text = this.todoInput.value.trim();
        
        if (text === '') {
            this.todoInput.focus();
            return;
        }
        
        const todo = {
            id: Date.now().toString(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        this.todos.unshift(todo); // Add to beginning of array
        this.todoInput.value = '';
        this.todoInput.focus();
        
        this.saveTodos();
        this.render();
    }
    
    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
            this.render();
        }
    }
    
    deleteTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.saveTodos();
        this.render();
    }
    
    render() {
        // Update stats
        const total = this.todos.length;
        const completed = this.todos.filter(t => t.completed).length;
        
        this.totalTasks.textContent = `${total} task${total !== 1 ? 's' : ''}`;
        this.completedTasks.textContent = `${completed} completed`;
        
        // Show/hide empty state
        if (total === 0) {
            this.emptyState.classList.remove('hidden');
            this.todoList.innerHTML = '';
            return;
        } else {
            this.emptyState.classList.add('hidden');
        }
        
        // Render todos
        this.todoList.innerHTML = '';
        
        this.todos.forEach(todo => {
            const todoItem = this.createTodoElement(todo);
            this.todoList.appendChild(todoItem);
        });
    }
    
    createTodoElement(todo) {
        const li = document.createElement('li');
        li.className = 'todo-item';
        li.innerHTML = `
            <div class="todo-checkbox ${todo.completed ? 'checked' : ''}" 
                 onclick="todoApp.toggleTodo('${todo.id}')">
            </div>
            <span class="todo-text ${todo.completed ? 'completed' : ''}">${this.escapeHtml(todo.text)}</span>
            <button class="delete-btn" onclick="todoApp.deleteTodo('${todo.id}')" title="Delete task">
                ×
            </button>
        `;
        
        return li;
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    saveTodos() {
        try {
            localStorage.setItem('todos', JSON.stringify(this.todos));
        } catch (error) {
            console.error('Error saving todos to localStorage:', error);
        }
    }
    
    loadTodos() {
        try {
            const stored = localStorage.getItem('todos');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading todos from localStorage:', error);
            return [];
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.todoApp = new TodoApp();
});

// Add some nice keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Focus input when typing (if not already focused on input)
    if (e.target.tagName !== 'INPUT' && e.key.length === 1 && e.key.match(/[a-zA-Z0-9]/)) {
        document.getElementById('todoInput').focus();
    }
});