// public/js/principal.js

document.addEventListener('DOMContentLoaded', function () {
  const btnIniciar = document.getElementById('btn-iniciar');
  const telaInicial = document.getElementById('tela-inicial');
  const telaPrincipal = document.getElementById('tela-principal');
  const transicao = document.getElementById('transicao');

  if (btnIniciar) { // Verifica se o botão existe antes de adicionar o listener
    btnIniciar.addEventListener('click', () => {
      // Esconde a tela inicial
      if (telaInicial) {
        telaInicial.classList.remove('ativa');
        telaInicial.style.display = 'none'; // Adicione para garantir que ela suma
      }
      // Mostra a transição
      if (transicao) {
        transicao.classList.add('ativa');
      }

      // Após a transição, redireciona para a rota /login
      setTimeout(() => {
        // Aqui você deve fazer a requisição POST para a rota /login
        // Você pode usar um formulário oculto ou um fetch.
        // Como seu /login é um POST, o mais simples é simular um submit de formulário.

        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/login';

        // Opcional: Adicionar campos de user/campo se forem obrigatórios para o login
        // const userInput = document.createElement('input');
        // userInput.type = 'hidden';
        // userInput.name = 'user';
        // userInput.value = 'usuarioPadrao'; // Ou um valor default
        // form.appendChild(userInput);

        // const campoInput = document.createElement('input');
        // campoInput.type = 'hidden';
        // campoInput.name = 'campo';
        // campoInput.value = 'ocupacaoPadrao'; // Ou um valor default
        // form.appendChild(campoInput);

        document.body.appendChild(form);
        form.submit(); // Isso enviará a requisição POST para /login

        // Ou se você quiser fazer um fetch (mais complexo para POST para renderizar EJS):
        /*
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user: 'usuarioPadrao', campo: 'ocupacaoPadrao' })
        })
        .then(response => {
            if (response.ok) {
                window.location.href = response.url; // Redireciona para a página de infoProta renderizada
            } else {
                console.error('Erro no login:', response.statusText);
            }
        })
        .catch(error => console.error('Erro na requisição de login:', error));
        */

      }, 3000); // Duração da transição
    });
  }

  // Efeito de onda no h1#carregamento (se aplicável ao principal.html)
  const carregamento = document.getElementById('carregamento');
  if (carregamento) {
    const texto = carregamento.textContent;
    carregamento.textContent = '';

    [...texto].forEach((letra, i) => {
      const span = document.createElement('span');
      span.textContent = letra;
      span.style.display = 'inline-block';
      span.style.animation = 'onda 0.2s ease-in-out infinite';
      span.style.animationDelay = `${i * 0.1}s`;
      carregamento.appendChild(span);
    });
  }
});