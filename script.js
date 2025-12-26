const playlist = [
    "music/musica1.mp3",
    "music/musica2.mp3",
    "music/musica3.mp3"
];

let index = 0;
const player = document.getElementById("player");
const now = document.getElementById("now");

function playCurrent() {
    player.src = playlist[index];
    now.innerText = "▶️ Tocando: " + playlist[index];
    player.play();
}

player.addEventListener("ended", () => {
    index = (index + 1) % playlist.length;
    playCurrent();
});

playCurrent();
