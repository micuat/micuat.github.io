import raw from "choo/html/raw";
import html from "choo/html";

export default (state, emitter) => {
  function initHydra() {
    const bgImg = new Image();
    bgImg.src = "/img/xp.jpg";
    bgImg.onload = () => {
      s0.init({ src: bgImg });
      src(o1).hue(.002)
      .layer(src(s0).mask(
        osc(1,.6).modulate(noise(2,1),.7)
        .thresh(()=>Math.min(time/3,0.8),0)))
      .out(o1)
      src(o1).scale(1, ()=>bgImg.width/bgImg.height*(window.innerHeight/window.innerWidth))
      .out(o0)
    }
  }
  emitter.on("DOMContentLoaded", () => {
    initHydra();
  });
}