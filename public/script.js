var btn = document.getElementById("btn"); //submit button
var input = document.getElementById("input"); //input area
var MemeList = document.getElementById("MemeList");
var pic = document.getElementById("files");
var data, meme, file; //it will store array

//initially, getting all the saved memes on reloading
getDataFromServer();

btn.addEventListener("click", addMeme);

//function to execute on pressing done: add memes to list
function addMeme(){
    getDataFromServer();
}

function getDataFromServer(){
    var request = new XMLHttpRequest();
     request.open("get", "/getData");

    request.setRequestHeader("Content-Type", "application/json");
    request.send();

    request.addEventListener("load", function(response){
         data = JSON.parse(response.target.responseText);
         addMemesToDom(data); //data is array of all the info of data.txt
    });

}

var i=2;
//function to display memes
function addMemesToDom(memes){
   clear(MemeList);
   memes.forEach(currMeme=>{
      	//creating div for new meme
  var item = document.createElement("div");
	//item.style.width = "200px";
	//item.style.height = "50px";
  item.style.padding = "5px";
  if(i%2 == 0)
	item.style.backgroundColor="#FF7600";
  else
  item.style.backgroundColor="#52006A";
  i++;
  item.style.margin = "70px";
  item.id = currMeme.id


  //adding description about meme
	var tname = document.createElement("label");
	tname.innerHTML = currMeme.name;
	tname.style.marginRight = "50px";
  tname.style.marginLeft="10px";
	item.appendChild(tname);


  //image
   var img = document.createElement("img");
   img.setAttribute("src", currMeme.img);
   item.appendChild(img);

  //add done option
        var check = document.createElement('input');
        check.type = "checkbox";
        check.dataset.checkId = currMeme.id;
        check.checked = currMeme.complete;
        check.style.backgroundColor="#ce97b0";
        check.innerHTML = "&#9829";
        check.addEventListener('click', updateStatus);
        item.appendChild(check);

        var fav = document.createElement("label");
      	fav.innerHTML = "Mark as Favourite            ";
      	item.appendChild(fav);

  //add delete option
    var cancel = document.createElement('input');
        cancel.type = 'button';
        cancel.innerText = "&#10060";
        item.appendChild(cancel);
	    cancel.addEventListener("click", function(event){
        //get its id
    var targetParent = event.target.parentNode
    memeTodelete = targetParent.getAttribute('id')
    deleteMeme(memeTodelete);
    targetParent.parentNode.removeChild(targetParent);
	  }
	)

  var remove = document.createElement("label");
  remove.innerHTML = "Remove it";
  item.appendChild(remove);

   document.getElementById("MemeList").appendChild(item);


   })
}

function clear(MemeList){
    while (MemeList.firstChild) {
        MemeList.removeChild(MemeList.firstChild);
}
}

function updateStatus(event){
    //finding the id of the button that was checked, and changing its status
    data.forEach(current =>{
        if(current.id == event.target.dataset.checkId){
            current.complete = !current.complete;
        }
    });

    //updating the same on server also
    var request = new XMLHttpRequest();
    request.open("post", "/update");
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify(data));

    //get the changed data from server
    getDataFromServer();
}

function deleteMeme(memeTodelete){
  for(var i = 0; i<data.length; i++){
        if(data[i].id == memeTodelete){
            data.splice(i, 1);
            //updating the same on server also
            var request = new XMLHttpRequest();
           request.open("post", "./update");
           request.setRequestHeader('Content-Type', 'application/json');
            request.send(JSON.stringify(data));
            break;
        }
    }
}
