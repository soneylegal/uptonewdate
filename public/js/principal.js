document.addEventListener('DOMContentLoaded', function () {
  const btnIniciar = document.getElementById('btn-iniciar');
  const telaInicial = document.getElementById('tela-inicial');
  const telaPrincipal = document.getElementById('tela-principal');
  const transicao = document.getElementById('transicao');

  // Tela de carregamento escura
  btnIniciar?.addEventListener('click', () => {
    telaInicial.classList.remove('ativa');
    transicao.classList.add('ativa');

    setTimeout(() => {
      transicao.classList.remove('ativa');
      telaPrincipal.classList.add('ativa');
      document.getElementById('trilha-sonora')?.play();
    }, 3000);
  });

  // Efeito de onda no h1#carregamento
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
