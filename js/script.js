//Selectores
const todoInput = document.querySelector('.todo-input');
const todoButton = document.querySelector('.todo-button');
const todoList = document.querySelector('.todo-list');
const filterOption = document.querySelector('.filter-todo');
const colorBtn = document.getElementsByClassName('color')[0];
const theme = document.querySelector("#light-theme");
let themeStatus = JSON.parse(localStorage.getItem("theme"));


//Event Listeners
document.addEventListener('DOMContentLoaded',checkTheme);
document.addEventListener('DOMContentLoaded',getTodos);
document.addEventListener('DOMContentLoaded',getCheckedTodos);
document.addEventListener('DOMContentLoaded',checkTodoLi);
todoButton.addEventListener('click', addTodo);
todoList.addEventListener('click',deleteCheck);
filterOption.addEventListener('click',filterTodo);
colorBtn.addEventListener('click',darkTheme);


//Functions
function darkTheme(){

    if(colorBtn.textContent === 'Go dark'){

        colorBtn.textContent = 'Go light';
        theme.href = "./css/darkStyle.css";

        localStorage.setItem("theme",JSON.stringify(1));

    }else if(colorBtn.textContent === 'Go light') {

        colorBtn.textContent = 'Go dark';
        theme.href = "./css/style.css";

        localStorage.setItem("theme",JSON.stringify(0));
    }
}
function checkTheme(){

    if(themeStatus == 1){

        colorBtn.textContent = 'Go light';
        theme.href = "./css/darkStyle.css";

    }else {

        colorBtn.textContent = 'Go dark';
        theme.href = "./css/style.css";
    }
}

function checkTodoLi(){

    const todos = todoList.childNodes;
    const checkedTodos = getCheckedTodos();

    todos.forEach(todo => {

        let todoText= todo.firstChild.innerText;
        
        checkedTodos.forEach(chTodo=>{

            if(chTodo === todoText){

                todo.classList.toggle("completed");
            }

        })

    })
}

function addTodo(event){

    // Prevent form to submit
    event.preventDefault();

    //Todo Div
    const todoDiv = document.createElement('div');
    todoDiv.classList.add("todo");

    //Create Li
    const newTodo = document.createElement('li');
    newTodo.innerText = todoInput.value;
    newTodo.classList.add('todo-item');
    todoDiv.appendChild(newTodo);

    //ADD TODO A LOCALSTORAGE
    saveLocalTodos(todoInput.value);

    //CHECK MARK BUTTON
    const completedButton = document.createElement('button');
    completedButton.innerHTML = '<i class = "fas fa-check"></i>';
    completedButton.classList.add('complete-btn');
    todoDiv.appendChild(completedButton);

    //CHECK TRASH BUTTON
    const trashButton = document.createElement('button');
    trashButton.innerHTML = '<i class = "fas fa-trash"></i>';
    trashButton.classList.add('trash-btn');
    todoDiv.appendChild(trashButton);

    //APPEND TO LIST
    todoList.appendChild(todoDiv);

    //Clear TodoInput.vlaue
    todoInput.value = '';

}

function deleteCheck(e){

    const item = e.target;
    
    //DELETE TODO
    if(item.classList[0] === 'trash-btn') {

        const todo = item.parentElement;
        todo.classList.add("fall");
        removeLocalTodo(todo);
        todo.addEventListener('transitionend',()=>{
            todo.remove();
        })
    }

    //CHECK MARK
    if(item.classList[0] === 'complete-btn') {

        const todo = item.parentElement;
        todo.classList.toggle("completed");
        const checkedTodo = item.parentElement.children[0].innerText;
        saveCheckedTodos(checkedTodo);

    }

}

function filterTodo(e){

    const todos = todoList.childNodes;
    todos.forEach(todo => {

        switch(e.target.value){

            case "all":

                todo.style.display = 'flex';
                break;

            case "completed": 

                if(todo.classList.contains('completed')){
                    todo.style.display = 'flex';
                }else {
                    todo.style.display = 'none';
                }
            break;    

            case "uncompleted": 

            if(!todo.classList.contains('completed')){
                todo.style.display = 'flex';
            }else {
                todo.style.display = 'none';
            }
            break;  
        }

    })
}

function saveLocalTodos(todo){

    //Chequear si tengo algo en localstorages
    let todos = checkIfTodos();

    todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(todos));
}

function saveCheckedTodos(todo){

    let checkTodos = getCheckedTodos();
    let find = checkTodos.find(e => e === todo);
    
    if(find != undefined){

        let checkIndex = checkTodos.indexOf(find);
        //elimino el valor del array de todos
        checkTodos.splice( checkIndex, 1);
        localStorage.setItem('checkTodos', JSON.stringify(checkTodos));

    }else {

        checkTodos.push(todo);
        localStorage.setItem('checkTodos', JSON.stringify(checkTodos));

    }

}

function getCheckedTodos(){

    //Chequear si tengo algo en localstorage
    let checkTodos;

    if(localStorage.getItem('checkTodos') === null){
        checkTodos = [];
    } else {

        checkTodos = JSON.parse(localStorage.getItem('checkTodos'));
    }
    return checkTodos;
}

function getTodos(){

    //Chequear si tengo algo en localstorage
    let todos = checkIfTodos();

    todos.forEach((todo)=>{
        //Todo Div
        const todoDiv = document.createElement('div');
        todoDiv.classList.add("todo");

        //Create Li
        const newTodo = document.createElement('li');
        newTodo.innerText = todo;
        newTodo.classList.add('todo-item');
        todoDiv.appendChild(newTodo);

        //CHECK MARK BUTTON
        const completedButton = document.createElement('button');
        completedButton.innerHTML = '<i class = "fas fa-check"></i>';
        completedButton.classList.add('complete-btn');
        todoDiv.appendChild(completedButton);
        //CHECK TRASH BUTTON
        const trashButton = document.createElement('button');
        trashButton.innerHTML = '<i class = "fas fa-trash"></i>';
        trashButton.classList.add('trash-btn');
        todoDiv.appendChild(trashButton);
        //APPEND TO LIST
        todoList.appendChild(todoDiv);
    })
}

function removeLocalTodo(todo){

    //Chequear si tengo algo en localstorage
    let todos = checkIfTodos();
    let checkedTodos = getCheckedTodos();

    //Busco el valor de texto del elem clickeado
    const todoValue = todo.children[0].innerText;
    const todoIndex = todos.indexOf( todoValue );
    const checkTodoIndex = checkedTodos.indexOf( todoValue );
    //elimino el valor del array de todos
    todos.splice( todoIndex, 1);

    checkedTodos.forEach(chTodo =>{

        if(chTodo === todo.children[0].innerText){

            checkedTodos.splice( checkTodoIndex, 1);
        }
    })
    
    //Vuelvo a guardar el array
    localStorage.setItem('todos',JSON.stringify(todos));
    localStorage.setItem('checkTodos',JSON.stringify(checkedTodos));


}

function checkIfTodos(){

    //Chequear si tengo algo en localstorage
    let todos;

    if(localStorage.getItem('todos') === null){
        todos = [];
    } else {

        todos = JSON.parse(localStorage.getItem('todos'));
    }
    return todos;
}