const form = document.getElementById('uploadForm');
const resultado = document.getElementById('resultado');
const listaArquivos = document.getElementById('listaArquivos');

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
    const formData = new FormData();
    formData.append('file', arquivo);

    try {
      const response = await fetch('https://file.io/?expires=1w', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        // Cria item da lista com link + player
        const li = document.createElement('li');
        li.innerHTML = `
          <a href="${data.link}" target="_blank">${arquivo.name}</a>
          <audio controls>
            <source src="${data.link}" type="${arquivo.type}">
            Seu navegador não suporta o elemento de áudio.
          </audio>
        `;
        listaArquivos.appendChild(li);
      } else {
        alert(`Erro ao enviar o arquivo: ${arquivo.name}`);
      }

    } catch (error) {
      alert(`Erro ao enviar o arquivo: ${arquivo.name}`);
      console.error(error);
    }
  }

  resultado.innerHTML = 'Envio concluído!';
  arquivosInput.value = '';
});
