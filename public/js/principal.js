// principal.js

document.addEventListener('DOMContentLoaded', function () {
  const btnIniciar = document.getElementById('btn-iniciar');
  const telaInicial = document.getElementById('tela-inicial');
  const telaPrincipal = document.getElementById('tela-principal');
  const transicao = document.getElementById('transicao');

  btnIniciar.addEventListener('click', () => {
    telaInicial.classList.remove('ativa');
    transicao.classList.add('ativa');
    setTimeout(() => {
      transicao.classList.remove('ativa');
      telaPrincipal.classList.add('ativa');
      document.getElementById('trilha-sonora').play();
    }, 1000);
  });
});