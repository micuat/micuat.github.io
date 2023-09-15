import raw from "choo/html/raw";
import html from "choo/html";

export default (state, emitter) => {
  function initHydra() {
    const bgImg = new Image();
    bgImg.src = "/img/xp.jpg";
    bgImg.onload = () => {
      s0.init({ src: bgImg });
      src(o1).colorama(.015)
      .modulate(
        osc(6,0,1.5)
        .modulate(
          noise(3,.1)
          .sub(gradient()),1)
          .brightness(-.5)
          ,0.01)
      .layer(
        src(o1)
        .mask(osc(30,.05).thresh(.2,0).modulate(
          src(s0)
          .scale(1, ()=>bgImg.width/bgImg.height*(window.innerHeight/window.innerWidth))
          .sub(gradient()),1))
      )
      .layer(
        src(s0)
        .scale(1, ()=>bgImg.width/bgImg.height*(window.innerHeight/window.innerWidth))
        .mask(
        osc(1,.6).modulate(
          src(s0)
          .scale(1, ()=>bgImg.width/bgImg.height*(window.innerHeight/window.innerWidth))
          .sub(gradient()),1)
        //.modulate(src(s0).sub(gradient()),1)
        .thresh(()=>Math.min(time/3,0.8),0)))
      .out(o1)
      src(o1)
      .out(o0)
    }
  }
  emitter.on("DOMContentLoaded", () => {
    initHydra();
  });
}