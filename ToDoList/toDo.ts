// 1. Define structure for our Task object
interface ToDoItem {
    id: number;
    name: string;
    dueDate: string;
    completed: boolean;
}

// Automatically load data onto the window on startup
window.onload = getData;

// 2. SUBMIT FUNCTION
function addToDo(event: SubmitEvent): void {
    event.preventDefault(); // Stop page reload

    const nameInput = document.getElementById('name') as HTMLInputElement | null;
    const dueDateInput = document.getElementById('dueDate') as HTMLInputElement | null;

    if (!nameInput || !dueDateInput) return;

    if (!nameInput.value.trim()) {
        alert("Please enter a task name!");
        return;
    }

    const newToDo: ToDoItem = {
        id: Date.now(),
        name: nameInput.value,
        dueDate: dueDateInput.value,
        completed: false
    };

    const rawData = localStorage.getItem('myToDos');
    let toDoList: ToDoItem[] = rawData ? JSON.parse(rawData) : [];
    
    toDoList.push(newToDo);
    localStorage.setItem('myToDos', JSON.stringify(toDoList));

    // Reset form fields
    const form = event.target as HTMLFormElement;
    form.reset();

    // Load newly submitted data instantly onto the page
    getData(); 
}

// 3. DISPLAY FUNCTION
function getData(): void {
    const toDoContainer = document.querySelector('.toDoList') as HTMLDivElement | null;
    if (!toDoContainer) return;

    const rawData = localStorage.getItem('myToDos');
    const toDoList: ToDoItem[] = rawData ? JSON.parse(rawData) : [];

    toDoContainer.innerHTML = '';

    if (toDoList.length === 0) {
        toDoContainer.innerHTML = '<p style="color: gray;">No tasks added yet!</p>';
        return;
    }

    toDoList.forEach((task: ToDoItem) => {
        const taskCard = document.createElement('div');
        taskCard.style.border = "1px solid #ccc";
        taskCard.style.padding = "10px";
        taskCard.style.margin = "10px 0";
        taskCard.style.borderRadius = "5px";
        taskCard.style.display = "flex";
        taskCard.style.alignItems = "center";
        taskCard.style.gap = "15px";
        
        const textStyle = task.completed 
            ? "text-decoration: line-through; color: gray;" 
            : "text-decoration: none; color: black;";

        taskCard.innerHTML = `
            <input type="checkbox" 
                   ${task.completed ? 'checked' : ''} 
                   onchange="toggleTaskStatus(${task.id})">
            
            <div style="flex-grow: 1; ${textStyle}">
                <h3 style="margin: 0 0 5px 0;">${task.name}</h3>
                <p style="margin: 0; font-size: 0.9em;"><strong>Due:</strong> ${task.dueDate || 'No due date'}</p>
            </div>

            <button onclick="deleteTask(${task.id})" style="background-color: #ff4d4d; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">
                Delete
            </button>
        `;

        toDoContainer.appendChild(taskCard);
    });
}

// 4. TOGGLE COMPLETED FUNCTION
function toggleTaskStatus(taskId: number): void {
    const rawData = localStorage.getItem('myToDos');
    let toDoList: ToDoItem[] = rawData ? JSON.parse(rawData) : [];

    toDoList = toDoList.map(task => {
        if (task.id === taskId) {
            task.completed = !task.completed; 
        }
        return task;
    });

    localStorage.setItem('myToDos', JSON.stringify(toDoList));
    getData();
}

// 5. DELETE FUNCTION
function deleteTask(taskId: number): void {
    const rawData = localStorage.getItem('myToDos');
    let toDoList: ToDoItem[] = rawData ? JSON.parse(rawData) : [];

    toDoList = toDoList.filter(task => task.id !== taskId);

    localStorage.setItem('myToDos', JSON.stringify(toDoList));
    getData();
}

// 6. EXPOSE TO GLOBAL WINDOW SCOPE

(window as any).addToDo = addToDo;
(window as any).toggleTaskStatus = toggleTaskStatus;
(window as any).deleteTask = deleteTask;