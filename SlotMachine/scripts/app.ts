var stage;

function init() {

    stage = new createjs.Stage(document.getElementById("canavs"));

    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", handleTick);

    alert("Canvas is ready");
}

function handleTick() {
    stage.update();


}