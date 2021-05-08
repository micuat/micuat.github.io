let hydra, hydraCanvas;
hydraCanvas = document.createElement("canvas");
hydraCanvas.width = 512;
hydraCanvas.height = 512;
hydraCanvas.style.width = "100%";
hydraCanvas.style.height = "100%";
hydraCanvas.id = "hydraCanvas";
document.getElementById("backtex").appendChild(hydraCanvas);

hydra = new Hydra({
  canvas: hydraCanvas,
  detectAudio: false,
  enableStreamCapture: false,
  width: 512,
  height: 512
});

s0.initVideo("./img/bp.webm");
osc(20,0.02,1.5).rotate(0.1)
.hue(()=>document.body.scrollTop / 1000)
  .scale(() => (Math.sin(-document.body.scrollTop / 200) + 1) * 1)
  .modulatePixelate(noise(8,0.3).pixelate(32,32).thresh(0.4, 0.2), -1000+32, 1000).layer(
    src(s0).repeat(3,3).mask(
      shape(4,0.5,0).scale(1,1,2).repeat(3,3,0.5).scale(1,3).sub(src(s0).repeat(3,3))
    )
  ).out()
