var sidenav = document.getElementById("addmenu");
var openBtn = document.getElementById("addbtn");
var closeBtn = document.getElementById("closebtn");

sidenav.addEventListener('click', function (e) {e.stopPropagation();}); //Empêche la propagation du clic à la scène
openBtn.addEventListener( 'click', openNav );
closeBtn.addEventListener( 'click', closeNav );

function openNav(event) {
  event.stopPropagation(); //Empêche la propagation du clic à la scène
  sidenav.classList.add("active");
}

function closeNav(event) {
  event.stopPropagation(); //Empêche la propagation du clic à la scène
  sidenav.classList.remove("active");
}

async function handleFormSubmit(event) {
  
  const input = document.getElementById("path")
  event.preventDefault();
  const data = new FormData(event.target);
  data.append("path", "./models/"+input.files[0].name);
  
  var models = JSON.parse(window.localStorage.getItem("modelList"));
  models.push(Object.fromEntries(data.entries()))
  window.localStorage.setItem("modelList", JSON.stringify(models))
  location.reload();
  /*console.log(obj);
  console.log(JSON.stringify(models));*/
}
const form = document.getElementById("addform");
form.addEventListener('submit', handleFormSubmit);