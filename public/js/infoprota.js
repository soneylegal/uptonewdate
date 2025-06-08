// public/js/infoProta.js

// Variáveis globais ou de escopo de arquivo
let meuProta;
let telaMorte;
let protagonistaRelaxadoImg;
let protagonistaAtaqueImg;
let protagonistaMortoImg;
let vidaDisplay;

// Função chamada quando o personagem morre
function morrerPersonagem() {
    if (telaMorte) {
        telaMorte.classList.add('ativa');
        const infoGeralProtaDiv = document.getElementById('info-geral-prota');
        if (infoGeralProtaDiv) {
            infoGeralProtaDiv.style.display = 'none';
        }

        if (protagonistaRelaxadoImg) protagonistaRelaxadoImg.style.display = 'none';
        if (protagonistaAtaqueImg) protagonistaAtaqueImg.style.display = 'none';
        if (protagonistaMortoImg) protagonistaMortoImg.style.display = 'block';
    } else {
        console.error("Tela de morte não encontrada ao tentar ativar.");
    }
}

// Classe do personagem
class PersonagemFrontend {
    #nome; #ocupacao; #habilidade1; #habilidade2; #vida;
    #armadura; #dinheiro;
    #onDeathCallback;

    constructor(nome, ocupacao, vida, armadura, dinheiro, habilidade1, habilidade2, onDeathCallback) {
        this.#nome = nome;
        this.#ocupacao = ocupacao;
        this.#vida = vida;
        this.#armadura = armadura;
        this.#dinheiro = dinheiro;
        this.#habilidade1 = habilidade1;
        this.#habilidade2 = habilidade2;
        this.#onDeathCallback = onDeathCallback;
    }

    get nome() { return this.#nome; }
    get ocupacao() { return this.#ocupacao; }
    get vida() { return this.#vida; }
    get armadura() { return this.#armadura; }
    get dinheiro() { return this.#dinheiro; }
    get habilidade1() { return this.#habilidade1; }
    get habilidade2() { return this.#habilidade2; }

    set vida(novaVida) {
        if (novaVida < 0) {
            this.#vida = 0;
            if (this.#onDeathCallback) this.#onDeathCallback();
        } else {
            this.#vida = novaVida;
        }
        atualizarVidaDisplay();
        salvarVidaNoBanco(this.#vida);
    }

    levarDano(dano) {
        this.vida = this.vida - dano;
    }
}

// Funções auxiliares
function atualizarVidaDisplay() {
    if (vidaDisplay && meuProta) {
        vidaDisplay.textContent = `Vida: ${meuProta.vida}`;
    }
}

async function salvarVidaNoBanco(vida) {
    try {
        const response = await fetch('/api/atualizar-vida-protagonista', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ vidaAtual: vida })
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Erro HTTP! Status: ${response.status} - ${errorData.message}`);
        }
        const data = await response.json();
        console.log('Vida salva no banco:', data.message, 'Nova vida:', data.newLife);
    } catch (error) {
        console.error('Erro ao salvar vida no banco de dados:', error);
    }
}

// Evento que espera o carregamento do DOM
document.addEventListener('DOMContentLoaded', function () {
    telaMorte = document.getElementById('tela-morte');
    const reiniciarBtn = document.getElementById('reiniciar-btn');
    const menuPrincipalBtn = document.getElementById('menu-principal-btn');
    vidaDisplay = document.getElementById('vida-display');
    const jogarBtn = document.getElementById('jogar-btn');

    protagonistaRelaxadoImg = document.querySelector('.protagonista.relaxado');
    protagonistaAtaqueImg = document.querySelector('.protagonista.ataque');
    protagonistaMortoImg = document.querySelector('.protagonista.morto');

    function inicializarProta() {
        if (typeof prota !== 'undefined' && prota !== null) {
            meuProta = new PersonagemFrontend(
                prota.nome, prota.ocupacao, prota.vida,
                prota.armadura, prota.dinheiro,
                prota.habilidade1, prota.habilidade2,
                morrerPersonagem
            );
            console.log("Protagonista inicializado no frontend:", meuProta.nome, "Vida:", meuProta.vida);
            atualizarVidaDisplay();

            if (protagonistaRelaxadoImg) protagonistaRelaxadoImg.style.display = 'block';
            if (protagonistaAtaqueImg) protagonistaAtaqueImg.style.display = 'none';
            if (protagonistaMortoImg) protagonistaMortoImg.style.display = 'none';

            if (telaMorte) telaMorte.classList.remove('ativa');
        } else {
            console.error("Objeto 'prota' não disponível. Verifique o infoprota.ejs.");
            alert("Erro ao carregar dados do personagem. Voltando ao menu principal.");
            window.location.href = '/';
        }
    }

    // Botão reiniciar
    if (reiniciarBtn) {
        reiniciarBtn.addEventListener('click', () => {
            if (meuProta) meuProta.vida = 160;
            window.location.reload();
        });
    }

    // Botão menu principal
    if (menuPrincipalBtn) {
        menuPrincipalBtn.addEventListener('click', () => {
            window.location.href = '/';
        });
    }

    // Botão jogar (simulação de dano)
    if (jogarBtn) {
        jogarBtn.addEventListener('click', () => {
            console.log("Iniciando simulação de dano...");
            if (meuProta) {
                if (protagonistaRelaxadoImg) protagonistaRelaxadoImg.style.display = 'none';
                if (protagonistaAtaqueImg) protagonistaAtaqueImg.style.display = 'block';

                setTimeout(() => {
                    if (protagonistaAtaqueImg) protagonistaAtaqueImg.style.display = 'none';
                    if (protagonistaRelaxadoImg) protagonistaRelaxadoImg.style.display = 'block';
                }, 1000);

                setTimeout(() => {
                    meuProta.levarDano(50);
                }, 2000);

                setTimeout(() => {
                    meuProta.levarDano(70);
                }, 4000);

                setTimeout(() => {
                    meuProta.levarDano(45);
                }, 6000);
            }
        });
    }

    inicializarProta();
});
