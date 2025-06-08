const { Personagem } = require('./personagem');

class Protagonista extends Personagem {
    #nome;
    #ocupacao;
    #vida;
    #armadura;
    #dinheiro;
    #habilidade1;
    #habilidade2;

    constructor(nome, ocupacao, vida, armadura, velocidade, dinheiro, habilidade1, habilidade2, reputacao, caixaItens) {
        super(nome, ocupacao, vida, armadura, velocidade, dinheiro, habilidade1, habilidade2);
        this.#nome = nome;
        this.#ocupacao = ocupacao;
        this.#vida = vida;
        this.#armadura = armadura;
        this.#dinheiro = dinheiro;
        this.#habilidade1 = habilidade1;
        this.#habilidade2 = habilidade2;
    }

    get nome() { return this.#nome; }
    get ocupacao() { return this.#ocupacao; }
    get vida() { return this.#vida; }
    get armadura() { return this.#armadura; }
    get dinheiro() { return this.#dinheiro; }
    get habilidade1() { return this.#habilidade1; }
    get habilidade2() { return this.#habilidade2; }
}

module.exports = { Protagonista };
