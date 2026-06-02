function entrar(){

const senha =
document.getElementById("senha")
.value
.trim();

if(senha === "130311"){

window.location.href =
"home.html";

}
else{

document
.getElementById("erro")
.innerText =
"Data incorreta ❤️";

}

}

document
.getElementById("senha")
.addEventListener(
"keypress",
function(e){

if(e.key === "Enter"){

entrar();

}

}
);