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

function handleFormSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    const obj = Object.fromEntries(data.entries());
    console.log({obj});
}
  
  const form = document.getElementById("addform");
  form.addEventListener('submit', handleFormSubmit);