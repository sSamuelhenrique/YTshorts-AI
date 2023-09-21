import { server } from "./server.js";

const form = document.querySelector("#form")
const input = document.querySelector("#url")
const content = document.querySelector("#content")



/* independente se no form no html tem um input ou button com type submit ou nao, caso o usuario clique em um buton existente dentro do form
ou enter é clicado, o evento submit, ainda ocorre  */
form.addEventListener("submit", async (event) => {
  /* event passado como parametro traz um objeto contendo informações sobre o evento submit
  ja o preventDefault() é uma função usada para prevenir o comportamento padrao de um evento, nesse caso do event submit, que quando um form é enviado, a pagina é recarregada automaticamente*/
  event.preventDefault();
  content.classList.add("placeholder")
  const videoURL = input.value

  /* o includes verifica se em uma determinada string está contida dentro de outra string*/
  /* a condição do if verifica se dentro da variavel videoURL não contenha a string shorts, se nao tiver é feito um return e o que está abaixo da condição não é executado */
  if (!videoURL.includes("shorts")) {
    return content.textContent = "Esse vídeo não é um shorts do YouTube"
  }

  /* não preciso do índice 0, utilizei _ para omiti-lo */
  const [_, params] = videoURL.split("/shorts/")
  /* https://youtube.com/shorts/TFGAMLL68CA?si=hs45HH2QhpuwG5Nq link de um short compartilhado*/
  const [videoID] = params.split("?si")
  /* em um link de shorts utilizando o compartilhar do yt, depois do id vem outros parametros. o primeiro split cria um novo array, pegando tudo
  antes de /shorts/ e depois tambem, sendo o que vem depois o id que queremos, porém o que vem depois alem do id, virá outro parametro chamado si
  entao utilizamos o metodo split novamente que acessa a variavel params que contem tudo que veio depois de shorts, e a condição desse split é que pegue tudo o que vem antes e depois de ?si (?si é outro parametro, usado pelo yt para rastrear a origem do trafico). No fim o que queremos é o elemento que está na posição 0, que é o id do video*/
  content.textContent = "Extraíndo o texto do shorts..."
  const transcription  = await server.get("/summary/" + videoID);
  content.textContent = "Realizando o resumo..."

  const summary = await server.post("/summary", {
    text: transcription.data.result,
  })
  content.textContent = summary.data.result;
  content.classList.remove("placeholder")
})
