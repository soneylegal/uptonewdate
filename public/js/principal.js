// public/js/principal.js

document.addEventListener('DOMContentLoaded', function () {
  const btnIniciar = document.getElementById('btn-iniciar');
  const telaInicial = document.getElementById('tela-inicial');
  const telaPrincipal = document.getElementById('tela-principal'); // Esta é a div que contém o formulário de login
  const transicao = document.getElementById('transicao');

  if (btnIniciar) {
    btnIniciar.addEventListener('click', () => {
      // 1. Esconde a tela inicial
      if (telaInicial) {
        telaInicial.classList.remove('ativa'); // Remove a classe 'ativa'
        // O CSS já define display: none quando 'ativa' é removida, ou opacity: 0;
      }

      // 2. Mostra a transição "Carregando..."
      if (transicao) {
        transicao.classList.add('ativa'); // Adiciona a classe 'ativa'
        // O CSS já define display: flex quando 'ativa' é adicionada
      }

      // 3. Após a transição (3 segundos), esconde a transição e mostra a tela de login
      setTimeout(() => {
        if (transicao) {
          transicao.classList.remove('ativa'); // Esconde a transição
        }
        if (telaPrincipal) {
          telaPrincipal.classList.add('ativa'); // Mostra a tela principal (com o formulário de login)
        }
        // O restante do fluxo (submeter o formulário) será feito pelo botão "OK"
        // dentro do seu principal.html, como um submit normal de formulário.
      }, 3000); // Duração da transição em milissegundos
    });
  }

  // Efeito de onda no h1#carregamento (Mantenha este código, ele está ok com seu CSS)
  const carregamento = document.getElementById('carregamento');
  if (carregamento) {
    const texto = carregamento.textContent;
    carregamento.textContent = ''; // Limpa o texto para adicionar os spans

    [...texto].forEach((letra, i) => {
      const span = document.createElement('span');
      span.textContent = letra;
      // As propriedades de animação estão no CSS, então só precisamos adicionar a classe 'span'
      // span.style.display = 'inline-block'; // Já está no CSS
      // span.style.animation = 'onda 0.2s ease-in-out infinite'; // Já está no CSS
      span.style.animationDelay = `${i * 0.1}s`;
      carregamento.appendChild(span);
    });
  }
});