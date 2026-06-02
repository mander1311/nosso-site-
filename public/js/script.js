const contador = document.getElementById("contador");

const inicio = new Date("2025-04-09T15:20:00");

function atualizar() {

const agora = new Date();

const diferenca = agora - inicio;

const dias = Math.floor(diferenca / (1000*60*60*24));

const horas = Math.floor(
(diferenca % (1000*60*60*24))
/
(1000*60*60)
);

const minutos = Math.floor(
(diferenca % (1000*60*60))
/
(1000*60)
);

const segundos = Math.floor(
(diferenca % (1000*60))
/
1000
);

contador.innerHTML =
`
❤️ ${dias} dias<br>
❤️ ${horas} horas<br>
❤️ ${minutos} minutos<br>
❤️ ${segundos} segundos
`;
}

setInterval(atualizar,1000);
atualizar();