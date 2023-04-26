const popupToggle = document.getElementById('myBtn');
  
function createModal(){
  const modalHtml = 
  '<div id="mypopup" class="popup">' +
    '<div class="popup-content">' +
      '<div class="popup-header">' +
        '<h2>Add New Task</h2>' +
      '</div>' +
      '<div class="popup-body">' +
        '<input id="task-title" class="title-task" type="text" placeholder="Task title" onkeyup="changeTheColorOfButton()">' +
        '<div class="container-date-options">' +
                '<div class="option">' +
                    '<div class="option health">health</div>' +
                    '<div class="option work">work</div>' +
                    '<div class="option home">home</div>' +
                    '<div class="option other">other</div>' +
                '</div>' +
                '<input id="date-choose" class="calendar" type="date">' +
          '</div>' +
      '</div>' +
      '<div class="popup-footer">' +
        '<button class="close" onclick="closeItem()">Close</button>' +
        '<button class="addTask2" id="task-button" onclick="addItem()">Add Task</button>' +
      '</div>' +
    '</div>' +
  '</div>';

  const existingPopup = document.getElementById('mypopup');
  if (existingPopup) {
    existingPopup.remove();
  }
  document.body.insertAdjacentHTML('beforebegin', modalHtml);

  const dateElement = document.getElementById('date-choose');
  const today = new Date().toISOString().split('T')[0];
  dateElement.setAttribute('min', today);
}


popupToggle.addEventListener("click", function(){
  createModal();
});

function closeItem(){
  const popup = document.getElementById('mypopup');
  popup.style.display="none";
}
function closeModal(){
  const modal = document.getElementById('myModal');
  modal.style.display="none";
}

function changeTheColorOfButton() {
  if (document.getElementById("task-title").value !== "") {
     document.getElementById("task-button").style.background = "#3C86F4";
  } else {
    document.getElementById("task-button").style.background = "#D3D3D3";
 }
}

let searchTextBox = document.getElementById("find");

searchTextBox.addEventListener("input", function(){
  let trlist = document.querySelectorAll("li");
  Array.from(trlist).forEach(function(item){
    let searchedText = item.innerText;
    let searchTextBoxVal = searchTextBox.value;
    let re = new RegExp(searchTextBoxVal, 'gi');
    if (searchedText.match(re)){
      item.style.display="block";
    }
    else {
      item.style.display="none";
    }
  })
});

async function getAllTodos(){
  const res = await fetch("http://localhost:3000/tasks");
  const todos = await res.json();
  for (let i = 0; i < todos.length; i++){
    if(todos[i]["completed"] === true){
      CompletedToHTML(todos[i])
    }else{
      todoToHTML(todos[i])
    }
  }
}

window.addEventListener('DOMContentLoaded', getAllTodos);

function todoToHTML({id, completed, title, dateValue}){
  const todoList = document.getElementById('ntc');

  todoList.insertAdjacentHTML('beforeend', 
  ` <li><input id="check" onclick="toggleCompletedTodo(${id}, '${title}', ${!completed}, '${dateValue}')" type="checkbox" ${completed && 'checked'}>
    <label id="label-title">${title}</label>
    <button class="deleteIcon" onclick="deleteTodo(${id})"><img src = "./img/Shape.svg"/></button>
    </li>
  `);
}
function CompletedToHTML({title}){
  const todoList = document.getElementById('cmplt');

  todoList.insertAdjacentHTML('beforeend', `
                  <li><input type="checkbox" checked disabled="disabled">
                  <label class="compl">${title}</label>
                  </li>
  `);
}

async function addItem(){
  const input = document.getElementById('task-title');
  const title = input.value;
  const dateElement  = document.getElementById('date-choose');
  const dateValue  = dateElement.value;

  if (title && dateValue) {
    const res = await fetch("http://localhost:3000/tasks", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({title, completed: false, dateValue})
    });

    const todo = await res.json();
    todoToHTML(todo);
    document.getElementById('find').value = '';
  }
}

async function deleteTodo(id){
  const res = await fetch(`http://localhost:3000/tasks/${id}`, {
    method: 'DELETE',
    headers:{
      'Content-Type': 'application/json',
    }
  });
  const data = await res.json();
  if (data){
    document.getElementById('ntc').remove();
  }
}
async function toggleCompletedTodo(id, title, completed, dateValue){

  const res = await fetch(`http://localhost:3000/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({title, completed, dateValue})
  })
  const data = await res.json();
  // return data;
}