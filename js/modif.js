var data = JSON.parse(window.localStorage.getItem("modelList"));
console.log(data[0]);
var modifTable = document.getElementById("modifBody");
for(let i = 0; i<data.length-1; i++){
    var tr = document.createElement("tr");
    tr.innerHTML = `<th>`+ i +`</th>
                <td><strong>`+ data[i].name+`</strong></td>
                <td>`+ data[i]["description"]+`</td>
                <td>`+ data[i]["size"]+`</td>
                <td><button onclick="deleteFromScene(`+ i +`)">Supprimer</td>
                `;
                modifTable.appendChild(tr);
}

function deleteFromScene(e){
    data.splice(e, 1);
    window.localStorage.setItem("modelList", JSON.stringify(data));
    location.reload();
    console.log(window.localStorage.getItem("modelList"));
}
    
