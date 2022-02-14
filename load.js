const load = async (file) => {
  const url = `https://raw.githubusercontent.com/brunoti/${file}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    return console.error(`Não foi possivel carregar a url: ${url}`);
  }
  
  const script = await response.text();
  
  const scriptElement = document.createElement('script');
  scriptElement.textContent = `{
    ${script}
  }`;

  document.body.appendChild(scriptElement);
}

window.load = load;
