const BASE_URL = "https://jsonplaceholder.typicode.com/todos/"
const BASE_URL_PARAMS = "https://jsonplaceholder.typicode.com/todos?_sort=id&_order=desc&_limit=7"
const todos = [];                                           //skapar users array
const todoList = document.querySelector('#todo-list');      //skapar todoList och kopplar till #user-list div som ska fyllas
const form = document.querySelector('#form');
let modal = document.getElementById('modal');

const getTodos = async function() {
    const res = await fetch(BASE_URL_PARAMS)                //Hämtar JSON datan från databasen från "BASE_URL" och lägger i "res"
    const data = await res.json()                           //Hämtar JSON datan från "res" och konverterar till JS och lägger i "data"

    data.forEach(function(todo) {                           //lägger in varje todo från "data" i "todo"
    todos.push(todo)                                        //lägger in allt från "todo" in i "todos" arrayen
    })
    listTodos()                                             //kör funktionen som skriver ut datan på sidan
}

getTodos();                                                 //kör funktionen med tillhörande funktion som har en annan funktion (funkception)

const listTodos = function() {
    todoList.innerHTML = ''

    todos.forEach(function(todo) {                          //loopar igenom todos arrayen för varje todo
        const todoElement = createTodoElement(todo)         //skapar todo element av todo från createtodoElement och lägger in i todoElement
        todoList.appendChild(todoElement)                   //appendar todoList som skrivs ut på sidan
    })
    console.log(todos)
}

const createTodoElement = function(todoData) {              //funktion skapar todo element. Tar in "todo" från listTodos funktionen men kallar den todoData
    let todo = document.createElement('div')                //skapar <div> för todo
    todo.id = todoData.id                                   //lägger till det som finns under id i databasen som ett id på todo <div>
    todo.classList.add('todo')                              //lägger till klass till <div>

    let title = document.createElement('p')                 //skapar <p> för title
    title.classList.add('todo_title')                       //lägger till klass på p
    title.innerText = todoData.title                        //lägger in det som finns under title i databasen som inner text i variabeln title

    let btnRemove = document.createElement('a')
    btnRemove.classList.add('remove_button')
    btnRemove.innerText = 'DELETE'

    let btnComp = document.createElement('a')
    btnComp.classList.add('completed_button')
    btnComp.innerText = `Change Completed`
 
    todo.appendChild(title)                                 //appendar todo <div> med title som är en <p> med klass todo_title med innertext från databasen
    todo.appendChild(btnComp)
    todo.appendChild(btnRemove)
    
    if (todoData.completed == true){                        //om completed är true - lägg till en till klass på todo <div>
        todo.classList.add('true') 
    }
    
    return todo                                             //returnar todo <div> färdigbyggd i funktionen som sparas i todoElement
}

const removeTodo = function(e) {                            //funktion som tar bort todo, e = eventhandler
    if(!e.target.classList.contains('remove_button')){      //om target inte har klass remove_button - avslutar funktionen
        return
    } else if(!e.target.parentElement.classList.contains('true')) { //om targets parentelement (div) inte har class true - kör felmeddelande funktion & avslutar funktionen
        openModal()
        return
    } else {
        fetch(BASE_URL + e.target.parentElement.id, {          //tar id från div som removeknappen ligger i och tar bort todon med det id från databasen
            method: 'DELETE'
        })
            .then(res => {
            console.log(res)
            if(res.ok) {
                e.target.parentElement.remove()                 //tar bort div som removeknappen ligger i från DOM
                const index = todos.findIndex(todo => todo.id == e.target.id) //hittar rätt index i arrayen
                todos.splice(index, 1)                                        //tar bort 1 med den indexen
            }
            })
    }    
}

const markCompleted = function(e) {
    if(!e.target.classList.contains('completed_button')){      //om target inte har klass completed_button - avslutar funktionen
        return
    } else if (e.target.parentElement.classList.contains('true')){  //annars om target parent element innehåller klass true - ta bort klass true
        e.target.parentElement.classList.remove('true')
    } else {                                                        //annars lägg till klass true
        e.target.parentElement.classList.add('true')
    }
}

const handleSubmit = function(e) {
    e.preventDefault()                                       //gör så att sidan inte laddas om vid submit
    
    let titleText = document.forms["form"]["title"].value;  //hämtar värdet på title-fältet
    
    if (titleText == null || titleText == "") {             //om värdet på title-fältet är null eller tomt
        console.log("YOU MUST ENTER A TODO TITLE!");
        const validation = document.getElementById("validation");//hämtar validation <p> och ger den ett namn
        validation.classList.remove('d-none');                   //tar bort classen d-none på validation <p> så den syns
    } else {
        validation.classList.add('d-none');                      //lägger till d-none på validation <p> så att den inte syns

        const newTodo = {
            userId: 10,
            title: document.querySelector('#title').value,
            completed: false,
            
        }
        
        fetch(BASE_URL_PARAMS, {                                       //fetch som POSTar till databasen
            method: 'POST',
            body: JSON.stringify(newTodo),                      //ändrar newTodo till JSON
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
        .then((res) => res.json())
        .then((data) => {
            todos.unshift(data);           //lägger till högst upp i array 
            listTodos()                 //hämtar från array till DOM
        }); 
    }
}

const openModal = function(){               //lägger till class open_modal på modal - körs i removeTodo() vid fel
    modal.classList.add('open_modal')
}
const closeModal = function(){              //tar bort class open_modal på modal - körs vid click på modal button
    modal.classList.remove('open_modal')
}

todoList.addEventListener('click', removeTodo)
todoList.addEventListener('click', markCompleted)
form.addEventListener('submit', handleSubmit)