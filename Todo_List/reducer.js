import storage from "./util/storage.js"


const init = {
    todos: storage.get(),
    filter: 'all',
    filters: {
        all: () => true,
        active: todo => !todo.completed,
        completed: todo => todo.completed,
    },
    editIndex: null,
}

const actions = {
    add({ todos }, title) {
        if (title){
            todos.push({ title, completed: false })
            storage.set(todos)
        }
    },
    toggle({ todos }, index){
        const todo = todos[index]
        todo.completed = !todo.completed
        // vì object có tính tham chiếu
        storage.set(todos)
    },
    toggleAll({ todos }, completed){
        todos.forEach(todo => todo.completed = completed)
        storage.set(todos)
    },
    destroy({ todos }, index){
        todos.splice(index, 1)
        storage.set(todos)
    },
    switchFilter(state, filter) {
        state.filter = filter
    },
    clearCompleted(state) {
        state.todos = state.todos.filter(state.filters.active)
        storage.set(state.todos)
    },
    startEdit(state, index){
        state.editIndex = index
    },
    endEdit(state, title) {
        if (this.startEdit.editIndex !== null){
            if (title) {
                state.todos[state.editIndex].title = title
                storage.set(state.todos)
            }
            else {
                this.destroy(state, state.editIndex)
            }
            state.editIndex = null
        }
    },
    cancelEdit(state) {
        state.editIndex = null
    }
}

// tùy vào mỗi action mà xử lý từng logic, sửa lại state, và load lại view
export default function reducer(state = init, action, agrs){
    actions[action] && actions[action](state, ...agrs)
    return state;
    
}