import fs, { readFileSync } from 'fs'; //(file system) biblioteca nativa do node.js que gerencia arquivos, permitindo a leitura quanto gravar/baixar arquivos 
import wav from 'node-wav'; //biblioteca node-wav pode trabalhar com arquivos de audio em formato WAV em Node.js, permitindo a leitura, escrita e manipulação de dados de áudio e informações associadas a esses arquivos.
import ffmpeg from "fluent-ffmpeg"; //biblioteca ffmpeg é um conjunto de programas e funções que ajudam a manipular video e audios em computadores
import ffmpegStatic from "ffmpeg-static"; //utilizamos essa biblioteca para apontar para qual biblioteca vamos utilizar, que será a fluent-ffmpeg

const filePath = "./tmp/audio.mp4" /* onde o arquivo está sendo salvado */
const outputPath = filePath.replace(".mp4", ".wav");/* onde será salvo o arquivo convertido */

export const convert = () => new Promise((resolve, reject) => {
  console.log("convertendo o video");
  ffmpeg.setFfmpegPath(ffmpegStatic);/* está definindo o caminho para a biblioteca FFmpeg que será usada pelo modulo fluente-ffmpeg */
  ffmpeg()
  .input(filePath)/* método input() utilizado para especificar onde o arquivo que será processado no FFmpeg está localizado */
  .audioFrequency(16000) /* método utilizado para escolher o quao claro ou nítido o som será em um arquivo de audio. atributo 16000 (16kHz) terá uma qualidade de audio razoavel */
  .audioChannels(1) /* audio terá um canal. Isso quer dizer que o som será reproduzido em mono (voce ouvirá o som igualmente em ambos os alto-falantes) */
  .format("wav") /* define o formato */
  .on("end", () => {
   const file =  fs.readFileSync(outputPath); /* função em node.js que le um arquivo de forma sincrona, ou seja, espera até que o arquivo seja completamente lido antes de continuar com outras tarefas. o arquivo será pego em .wav */
   const fileDecoded = wav.decode(file); /* o arquivo .wav será decodificado de .wav para código */
   const audioData = fileDecoded.channelData[0];  /* a gravação do audio foi gravada em apenas um canal, logo é um audio mono, entao ESTÁ SENDO PEGO OS DADOS DESSE AUDIO DESSE UNICO CANAL. (se o audio tivesse sido gravado em dois canais (estéreo), eu poderia acessar os dados somente de algum lado deles, ou os dois, sendo o valor 0 lado esquerdo e o 1 o direito) */

   const floatArray = new Float32Array(audioData);/* está sendo pego os dados desse audio que serão convertidos em valores de audio, que são numeros com casas decimais e esses valores serão salvos num float array. ESSE FORMATO É O QUE A INTELIGENCIA ARTIFICIAL UTILIZA */

   console.log("vídeo convertido com sucesso");
   resolve(floatArray);
   fs.unlinkSync(outputPath) /*  a função agurdará até que o arquivo seja excluido para continuar com a execução do programa */
  })
  .on("error", () => {
    console.log("Erro ao converter o vídeo", error);
    reject(error);
  })
  .save(outputPath)/* onde será salvo o arquivo */
})