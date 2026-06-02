const contador = document.getElementById("contador");

const inicio = new Date("2026-04-09T15:20:00");

function atualizar(){

const agora = new Date();

const diff = agora - inicio;

const dias =
Math.floor(diff/(1000*60*60*24));

const horas =
Math.floor(
(diff%(1000*60*60*24))
/
(1000*60*60)
);

const minutos =
Math.floor(
(diff%(1000*60*60))
/
(1000*60)
);

const segundos =
Math.floor(
(diff%(1000*60))
/
1000
);

contador.innerHTML=
`
❤️ ${dias} dias<br>
❤️ ${horas} horas<br>
❤️ ${minutos} minutos<br>
❤️ ${segundos} segundos
`;
}

setInterval(atualizar,1000);

atualizar();