// script.js

let playerHealth = 100;

function takeDamage(amount) {
    playerHealth -= amount;
    if (playerHealth <= 0) {
        showDeathScreen();
    }
}

function showDeathScreen() {
    const deathScreen = document.getElementById("death-screen");
    deathScreen.classList.remove("hidden");
    deathScreen.classList.add("show");
}

function restartGame() {
    playerHealth = 100;
    // lógica para resetar seu jogo aqui (posição do player, inimigos, etc.)

    const deathScreen = document.getElementById("death-screen");
    deathScreen.classList.remove("show");
    deathScreen.classList.add("hidden");
}
