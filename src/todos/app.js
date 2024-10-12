import html from './app.html?raw';
import todoStore, { Filters } from '../store/todo.store'
import { renderTodos, renderPending } from './use-cases';

const elementIDs = {
    ClearCompleted: '.clear-completed',
    TodoList: '.todo-list',
    NewTodoInput: '#new-todo-input',
    TodoFilters: '.filtro',
    PendingCountLabel: '#pending-count',
} 
export const App = (elementId)=>{

    const displayTodos = ()=>{
        const todos = todoStore.getTodos( todoStore.getCurrentFilter());
        console.log(todos);
        renderTodos( elementIDs.TodoList, todos);
        updatePendingCount();
    }

    const updatePendingCount = ()=>{
        renderPending(elementIDs.PendingCountLabel);
    }

    (()=>{
        const app = document.createElement('div');
        app.innerHTML = html;
        document.querySelector(elementId).append(app);
        displayTodos();

    })();


    //Referencias HTML
    const newDescriptionInput = document.querySelector(elementIDs.NewTodoInput);
    const todoListUL = document.querySelector( elementIDs.TodoList);
    const ClearCompletedButton = document.querySelector(elementIDs.ClearCompleted);
    const filtersLIs = document.querySelectorAll( elementIDs.TodoFilters);

    newDescriptionInput.addEventListener('keyup', (event) =>{
        if(event.keyCode !== 13) return;
        if(event.target.value.trim().length === 0 )return;

        todoStore.addTodo( event.target.value);
        displayTodos();
        event.target.value = '';

    });

    todoListUL.addEventListener('click',(event)=>{
       const element = event.target.closest('[data-id]');
       todoStore.toggleTodo(element.getAttribute('data-id'));
       displayTodos();
    });

    todoListUL.addEventListener('click',(event)=>{
        if (event.target.className !== 'destroy')return;

        const element = event.target.closest('[data-id]');
        todoStore.deleteTodo(element.getAttribute('data-id'));
        displayTodos();

     });

     ClearCompletedButton.addEventListener('click',()=>{
        todoStore.deleteTodoCompleted();
        displayTodos();
     });

     filtersLIs.forEach( element =>{

        element.addEventListener('click', (element) =>{
            filtersLIs.forEach(el => el.classList.remove('selected'));
            element.target.classList.add('selected');

            

            switch(element.target.text){
                case 'Todos':
                    todoStore.setFilter(Filters.All);
                break;
                case 'Completados':
                    todoStore.setFilter(Filters.Completed);
                break;
                case 'Pendientes':
                    todoStore.setFilter(Filters.Pending);
                break;
            }

            displayTodos();

        });

     });
}