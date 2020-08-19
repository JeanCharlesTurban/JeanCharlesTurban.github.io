

var listofdivs = document.getElementsByClassName("tile");



function flipcard(event){

  var wasTile = false;
  var counter = 0;
  var tileid;
  while(!(wasTile)){

    tempattr = event.path[counter].getAttribute("style");
    tempid = event.path[counter].id;


    if(tempid.includes("tile")){
      wasTile = true;
      tileid = tempid;

    }
    if(counter == event.path.length-1){
      wasTile = true;
    }
    counter = counter + 1;
  }
  console.log(document.getElementById(tileid))
  var tilecard = document.getElementById(tileid);
  if(tilecard.getAttribute("flipped") == "false"){
    tilecard.setAttribute("style", "transform: rotateY(180deg);");
    tilecard.setAttribute("flipped", "true");
  }
  else if(tilecard.getAttribute("flipped") == "true"){
    tilecard.setAttribute("style", "transform: rotateY(360deg);");
    tilecard.setAttribute("flipped", "false");
  }



}

console.log(listofdivs)


for (var i = 0; i < listofdivs.length; i++) {

    listofdivs[i].setAttribute("flipped", "false")
    listofdivs[i].id = "tile"+i
    listofdivs[i].addEventListener("click",flipcard);
}
