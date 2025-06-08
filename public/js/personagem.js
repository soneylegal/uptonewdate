class Personagem {
    #nome;
    #ocupacao;
    #habilidade1;
    #habilidade2;
    #vida;
    #armadura;
    #velocidade;
    #dinheiro;

    constructor(nome, ocupacao, vida, armadura, velocidade, dinheiro, habilidade1, habilidade2) {
        this.#nome = nome;
        this.#ocupacao = ocupacao;
        this.#vida = vida;
        this.#armadura = armadura;
        this.#velocidade = velocidade;
        this.#dinheiro = dinheiro;
        this.#habilidade1 = habilidade1;
        this.#habilidade2 = habilidade2;
    }

    get nome() { return this.#nome; }
    get ocupacao() { return this.#ocupacao; }
    get vida() { return this.#vida; }
    get armadura() { return this.#armadura; }
    get velocidade() { return this.#velocidade; }
    get dinheiro() { return this.#dinheiro; }

    get habilidade1() { return this.#habilidade1; }
    set habilidade1(hab) { this.#habilidade1 = hab; }

    get habilidade2() { return this.#habilidade2; }
    set habilidade2(hab) { this.#habilidade2 = hab; }

    set vida(novaVida) {
        if (novaVida >= 0) this.#vida = novaVida;
        else console.log("Encerrar jogo");
    }

    levarDano(dano) {
        this.#vida -= dano;
    }
}

module.exports = { Personagem };
