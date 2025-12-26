const form = document.getElementById('uploadForm');
const resultado = document.getElementById('resultado');
const listaArquivos = document.getElementById('listaArquivos');

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

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const arquivosInput = document.getElementById('arquivos');
  const arquivos = arquivosInput.files;

  if (arquivos.length === 0) { alert('Selecione pelo menos um arquivo!'); return; }

  resultado.innerHTML = 'Enviando...';

  for (let i = 0; i < arquivos.length; i++) {
    const arquivo = arquivos[i];
    const formData = new FormData();
    formData.append('file', arquivo);

    try {
      const response = await fetch('https://file.io/?expires=1w', { method: 'POST', body: formData });
      const data = await response.json();
      if (data.success) {
        criarCard(arquivo.name, data.link, arquivo.type);
      } else { alert(`Erro ao enviar: ${arquivo.name}`); }
    } catch (err) { alert(`Erro ao enviar: ${arquivo.name}`); console.error(err); }
  }

  resultado.innerHTML = 'Upload concluído!';
  arquivosInput.value = '';
});
