async function entrar(){

const senha =
document.getElementById("senha")
.value
.trim();

const encoder =
new TextEncoder();

const data =
encoder.encode(senha);

const hashBuffer =
await crypto.subtle.digest(
"SHA-256",
data
);

const hashArray =
Array.from(
new Uint8Array(hashBuffer)
);

const hash =
hashArray
.map(b =>
b.toString(16)
.padStart(2,"0")
)
.join("");

const hashCorreto =
"2a6b3ee0c7b0f8a6e2d2c5df0fbc4a4eb7fd3fd8261eb998f8a0b6a5e0b80d70";

if(hash === hashCorreto){

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