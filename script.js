async function enviarParaGitHubActions(nome, arquivo) {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = async () => {
      const base64 = btoa(reader.result);

      const url = `https://api.github.com/repos/iagoh3041-design/radio-upload/actions/workflows/upload.yml/dispatches`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `token SEU_TOKEN_PARA_DISPATCH`,
          'Accept': 'application/vnd.github+json'
        },
        body: JSON.stringify({
          ref: "main",
          inputs: {
            filename: nome,
            content: base64
          }
        })
      });

      if (response.ok) {
        resolve(`Arquivo ${nome} enviado com sucesso!`);
      } else {
        reject(await response.json());
      }
    };
    reader.readAsBinaryString(arquivo);
  });
}
