// principal.js

  document.addEventListener('DOMContentLoaded', function () {
    const btnIniciar = document.getElementById('btn-iniciar');
    const telaInicial = document.getElementById('tela-inicial');
    const telaPrincipal = document.getElementById('tela-principal');
  
 btnIniciar.addEventListener('click', () => {
    telaInicial.classList.remove('ativa');
    telaPrincipal.classList.add('ativa');
  });
});
  
