window.onload = getData;

function addToDo(event){
     event.preventDefault()

     const name = document.getElementById('name');
     const dueDate= document.getElementById('dueDate');

     const newToDo = {
        name:name.value,
        dueDate: dueDate.value,
        id: Date.now() ,// Unique ID to help delete/manage tasks later
        complete:false //task pending
    };

    let toDoList = JSON.parse(localStorage.getItem('myToDos')) || []

    toDoList.push(newToDo)

    localStorage.setItem('myToDos', JSON.stringify(toDoList))

    event.target.reset()

    getData()

}

function getData(){
     const toDoContainer = document.querySelector('div.toDoList');
     const toDoList = JSON.parse(localStorage.getItem('myToDos')) || [];

     toDoContainer.innerHTML = ''

    if (toDoList.length === 0) {
        toDoContainer.innerHTML = '<p style="color: gray;">No tasks added yet!</p>';
        return;
    }

    toDoList.forEach(function(task) {
        const taskCard = document.createElement('div');
        taskCard.style.border = "1px solid #ccc";
        taskCard.style.padding = "10px";
        taskCard.style.margin = "10px 0";
        taskCard.style.borderRadius = "5px"

        const textStyle = task.completed 
            ? "text-decoration: line-through; color: gray;" 
            : "text-decoration: none; color: black;"
        
        
        taskCard.innerHTML = `
            <input type="checkbox" 
                   ${task.completed ? 'checked' : ''} 
                   onchange="toggleTaskStatus(${task.id})">
            
            <div style="flex-grow: 1; ${textStyle}">
                <h3 style="margin: 0 0 5px 0;">${task.name}</h3>
                <p style="margin: 0; font-size: 0.9em;"><strong>Due:</strong> ${task.dueDate || 'No due date'}</p>
            </div>

            <button onclick="deleteTask(${task.id})" style="background-color: #ff4d4d; color: white; border: none; padding: 10px 10px; border-radius: 3px; cursor: pointer; text-align:left">
                Delete
            </button>
        `

        toDoContainer.appendChild(taskCard);
    })

}

function toggleTaskStatus(taskId){

     let list = JSON.parse(localStorage.getItem('myToDos')) ||[]

     list= list.map(task =>{
          if(task.id ===taskId){
               task.completed = !task.completed
          }
          return task
     })

     localStorage.setItem('myToDos',JSON.stringify(list))

     getData()
}

function deleteTask(taskID){

     let list = JSON.parse(localStorage.getItem('myToDos'))||[]

     list = list.filter(task=> task.id !== taskID)

     localStorage.setItem('myToDos',JSON.stringify(list))

     getData()
}