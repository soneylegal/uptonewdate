// principal.js

  document.addEventListener('DOMContentLoaded', function () {
    const btnIniciar = document.getElementById('btn-iniciar');
    const telaInicial = document.getElementById('tela-inicial');
    const telaPrincipal = document.getElementById('tela-principal');
  
    btnIniciar.addEventListener('click', function() {
      telaInicial.style.display = 'none'; // Esconde a tela inicial
      telaPrincipal.style.display = 'block'; // Mostra a tela principal
    });
  });
  