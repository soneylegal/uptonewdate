// public/js/protagonista.js
const { Personagem } = require('./personagem');

class Protagonista extends Personagem {
    #reputacao;
    #caixaItens;

    constructor(nome, ocupacao, vida, armadura, velocidade, dinheiro, habilidade1, habilidade2, reputacao = 0, caixaItens = null) {
        super(nome, ocupacao, vida, armadura, velocidade, dinheiro, habilidade1, habilidade2);
        this.#reputacao = reputacao;
        this.#caixaItens = caixaItens;
    }

    // Getters
    get reputacao() { return this.#reputacao; }
    get caixaItens() { return this.#caixaItens; }

    // Setters
    set reputacao(novaReputacao) { this.#reputacao = novaReputacao; }
    set caixaItens(novaCaixa) { this.#caixaItens = novaCaixa; }

    // Você pode adicionar ou sobrescrever métodos aqui se a lógica do protagonista
    // for diferente da lógica geral do personagem para esses aspectos no backend.
    // Exemplo:
    // levarDano(dano) {
    //     // Lógica específica para o protagonista no backend
    //     super.levarDano(dano); // Chama o método da classe pai
    //     // console.log(`Protagonista ${this.nome} levou dano. Vida atual: ${this.vida}`);
    // }
}

module.exports = { Protagonista };