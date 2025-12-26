const form = document.getElementById('uploadForm');
const resultado = document.getElementById('resultado');
const listaArquivos = document.getElementById('listaArquivos');

// === CONFIGURAÇÕES GITHUB ===
const GITHUB_USER = 'iagoh3041-design;        // substitua pelo seu usuário GitHub
const GITHUB_REPO = 'radio-upload';    // substitua pelo nome do repositório
const GITHUB_TOKEN = 'SEU_TOKEN_AQUI';    // substitua pelo token
const GITHUB_BRANCH = 'main';             // branch onde será feito commit

// Função para enviar arquivo para GitHub
async function enviarParaGitHub(nomeArquivo, arquivo) {
  const url = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/uploads/${nomeArquivo}`;
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = async () => {
      const base64 = btoa(reader.result);

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: `Upload ${nomeArquivo}`,
          content: base64,
          branch: GITHUB_BRANCH
        })
      });

      const data = await response.json();
      if (data.content && data.content.download_url) {
        resolve(data.content.download_url);
      } else {
        reject(data);
      }
    };
    reader.readAsBinaryString(arquivo);
  });
}

// Função para criar card da música
function criarCard(nome, url, tipo) {
  const card = document.createElement('div');
  card.className = 'card';

  const img = document.createElement('img');
  img.src = 'https://i.ibb.co/7yz5NQ6/music-icon.png';
  img.alt = 'Música';

  const detalhes = document.createElement('div');
  detalhes.className = 'card-details';
  detalhes.innerHTML = `
    <a href="${url}" target="_blank">${nome}</a>
    <audio controls>
      <source src="${url}" type="${tipo}">
      Seu navegador não suporta o elemento de áudio.
    </audio>
  `;

  card.appendChild(img);
  card.appendChild(detalhes);
  listaArquivos.appendChild(card);
}

// Evento do formulário
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const arquivosInput = document.getElementById('arquivos');
  const arquivos = arquivosInput.files;

  if (arquivos.length === 0) {
    alert('Selecione pelo menos um arquivo!');
    return;
  }

  resultado.innerHTML = 'Enviando...';

  for (let i = 0; i < arquivos.length; i++) {
    const arquivo = arquivos[i];
    try {
      const url = await enviarParaGitHub(arquivo.name, arquivo);
      criarCard(arquivo.name, url, arquivo.type);
    } catch (error) {
      console.error(error);
      alert(`Erro ao enviar: ${arquivo.name}`);
    }
  }

  resultado.innerHTML = 'Upload concluído!';
  arquivosInput.value = '';
});
