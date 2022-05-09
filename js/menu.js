var sidenav = document.getElementById("addmenu");
var openBtn = document.getElementById("addbtn");
var closeBtn = document.getElementById("closebtn");

openBtn.onclick = openNav;
closeBtn.onclick = closeNav;

function openNav() {
  sidenav.classList.add("active");
}

function closeNav() {
  sidenav.classList.remove("active");
}

async function handleFormSubmit(event) {
  
  const input = document.getElementById("model_uploads")
  event.preventDefault();
  const data = new FormData(event.target);
  data.append(input.files[0])
  const obj = JSON.stringify(Object.fromEntries(data.entries()));

  console.log(input.files[0]);
  await fetch('test.json', { 
    method: "POST", 
    body: obj
  }); 
  alert('You have successfully upload the file!');
}
const form = document.getElementById("addform");
form.addEventListener('submit', handleFormSubmit);