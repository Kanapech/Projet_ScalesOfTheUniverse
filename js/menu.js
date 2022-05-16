var sidenav = document.getElementById("addmenu");
var openBtn = document.getElementById("addbtn");
var closeBtn = document.getElementById("closebtn");

var inputModel = document.getElementById("path");
var inputFileName = document.getElementById("inputFilename");

var loadJSONButton = document.getElementById("loadJSONButton");
var inputJSON = document.getElementById('newFileInput');

inputModel.addEventListener( 'change', showFilename );
sidenav.addEventListener('click', function (e) {e.stopPropagation();}); //Empêche la propagation du clic à la scène
openBtn.addEventListener( 'click', openNav );
closeBtn.addEventListener( 'click', closeNav );
inputJSON.addEventListener('change', loadJSON);

function loadFromJSON(e){
  var input = document.getElementById('newFileInput');
  input.click();

}

function loadJSON(event){
  event.preventDefault();
  var input = event.srcElement;

  if (!input.value.length) return;

  var reader = new FileReader();
  reader.onload = function(e){
    var data = JSON.parse(e.target.result);
    window.localStorage.setItem("modelList", JSON.stringify(data))
    //console.log(JSON.stringify(data));
  }
  reader.readAsText(input.files[0])
  location.reload();
}

function showFilename(event){
  var input = event.srcElement;
  inputFileName.innerHTML = input.files[0].name;
}

function openNav(event) {
  event.stopPropagation(); //Empêche la propagation du clic à la scène
  sidenav.classList.add("active");
}

function closeNav(event) {
  event.stopPropagation(); //Empêche la propagation du clic à la scène
  sidenav.classList.remove("active");
}

function defaultScene(e){
  if(confirm('Vous êtes sur de retourner à la scène par défaut ?')) {
      e.preventDefault();
      window.localStorage.clear();
      location.reload();
  }
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