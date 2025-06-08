// public/js/principal.js

document.addEventListener('DOMContentLoaded', function () {
  const btnIniciar = document.getElementById('btn-iniciar');
  const telaInicial = document.getElementById('tela-inicial');
  const telaPrincipal = document.getElementById('tela-principal'); // Esta é a div que contém o formulário de login
  const transicao = document.getElementById('transicao');

  if (btnIniciar) {
    btnIniciar.addEventListener('click', () => {
      if (telaInicial) {
        telaInicial.classList.remove('ativa');
      }

      if (transicao) {
        transicao.classList.add('ativa');
      }

      setTimeout(() => {
        if (transicao) {
          transicao.classList.remove('ativa');
        }
        if (telaPrincipal) {
          telaPrincipal.classList.add('ativa');
        }
      }, 3000);
    });
  }

  const carregamento = document.getElementById('carregamento');
  if (carregamento) {
    const texto = carregamento.textContent;
    carregamento.textContent = '';

    [...texto].forEach((letra, i) => {
      const span = document.createElement('span');
      span.textContent = letra;
      span.style.animationDelay = `${i * 0.1}s`;
      carregamento.appendChild(span);
    });
  }
});