// https://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
const mobileCheck = function () {
  let check = false;
  (function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
};
const isMobile = mobileCheck();

class HydraApp extends Torus.StyledComponent {
  init() {
    this.canvas = document.createElement("CANVAS");
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.hydra = new Hydra({
      canvas: this.canvas,
      detectAudio: false,
      enableStreamCapture: false
    });
    window.addEventListener('resize',
      () => {
        this.hydra.setResolution(window.innerWidth, window.innerHeight);
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
      }, true);
  }
  styles() {
    return css`
      position: absolute;
      top: 0;
      left: 0;
      z-index: 0;
      width: 100%;
      height: 100%;
      background-color: black;
    `
  }
  compose() {
    return jdom`<div>${this.canvas}</div>`;
  }
}

class SectionApp extends Torus.StyledComponent {
  init(props) {
    const keys = Object.keys(props);
    for (const key of keys) {
      this[key] = props[key];
    }
    if (this.code === undefined) this.code = () => osc().out();
  }
  styles() {
    let c = `
    padding: 20px 0 20px 0;
    margin: 60px 0 60px 0;
    background-color: rgba(255, 255, 255, 0.9);
    box-shadow: 0 0 10px #000;
    -webkit-box-shadow: 0 0 10px #000;
    width: auto;
    border-radius: 15px;
    `;

    if (this.nopad) {
      c += `padding: 0;
      overflow: hidden;
      `
    }
    else {
      c += `padding: 20px 0 20px 0;`;
    }
    if (this.pointer) {
      c += `cursor: pointer;
      `;
    }
    return css`${c}`;
  }
  onclick() {
    this.code();
    if (this.className === "hidecanvas") {
      app.toggleCanvas();
    }
  }
  compose() {
    return jdom`
      <section class="${this.className}" onclick="${() => this.onclick()}">
        ${this.dom}
      </section>
    `
  }
}

class TitleApp extends SectionApp {
  init(props) {
    super.init(props);
    this.toggle = false;
    this.dom = this.dome;
  }
  onclick() {
    super.onclick();
    this.toggle = !this.toggle;
    if (this.toggle) {
      this.dom = this.domj;
    }
    else {
      this.dom = this.dome;
    }
    this.render();
  }
}

class ContentApp extends Torus.StyledComponent {
  init() {
    this.s = [
      new SectionApp({
        dom: jdom`
    <div class="msg center-text">😵Hide/show background</div>
    `, className: "hidecanvas", pointer: true
      }),
      new TitleApp({
        dome: jdom`
    <h1>
      Naoto Hieda
    </h1>
    `, domj: jdom`
    <h1 style="font-weight: normal">
      稗田直人
    </h1>
    `, pointer: true, code: defaultCode
      }),
      new SectionApp({
        dom: jdom`
    <div>
    <h2>
          What's Up
        </h2>

        <p>
          <a href="https://festival.glitches.me"
            >festival.glitches.me (2021-2022)</a
          >
          is an independent online festival organized by and for
          <span class="naoto">Naoto</span>.
        </p>

        <p>
          <a href="https://best-practices.glitch.me/"
            >Best Practices In Contemporary Dance (2020-)</a
          >
          is a practice and a playground by Jorge Guevara and
          <span class="naoto">Naoto</span> to experiment with online bodies
          and pixels.
        </p>
        </div>
    `, code: () => {
          osc(60, 0.1, 1.5)
            .modulate(
              noise(3).modulatePixelate(noise(4).pixelate(32, 32).thresh(0, 0.5), 1024, 32)
            ).out()
        }
      }),
      new SectionApp({
        dom: jdom`
    <div>
      <p class="center-text">
        This website is permanently under construction
      </p>
      <img
        class="projects"
        alt="under construction"
        src="./img/underconstruction.gif"
      />
      <p class="center-text">
        <span class="naoto">Naoto</span> is permanently under pressure
      </p>
    </div>
    `, code: () => {
          osc(2, 0, 1.5).modulate(solid(2)).contrast(2).out()

        }
      }),
      new SectionApp({
        dom: jdom`
    <div>
    <a href="https://www.youtube.com/watch?v=d0KMUUOrUvs" target="_blank">
    <img
      class="projects"
      alt="glitch me with flor de fuego"
      style="width: 100%; height: auto"
      src="https://img.glitches.me/images/2021/09/20/vlcsnap-2021-09-20-19h11m28s562.jpg"
    />
    </a>
    </div>
    `, nopad: true, code: () => {
          solid(1, 1, 1).layer(
            src(o0).scale(1, 0.5, -1).hue(2 / 3))
            .layer(
              osc(50, 0.02, 1.5).mask(osc(25, -0.01).thresh(0.5, 0)).mult(osc(25, -0.01, 1.5).r().luma(0, 0))
                .modulate(noise(2, 0.05).modulate(solid(0, 1), () => time * .2), 0.05)
            ).out()
        }
      }),
      new SectionApp({
        dom: jdom`
    <div>
      <a href="https://www.creativeapplications.net/member-submissions/best-practices-in-contemporary-dance/" target="_blank">
      <img
        class="projects"
        alt="best practices"
        style="width: 100%; height: auto"
        src="https://img.glitches.me/images/2021/05/31/image.png"
      />
      </a>
    </div>
    `, nopad: true
      }),
      new SectionApp({
        dom: jdom`
    <div>
    <a href="https://best-public.glitch.me/" target="_blank">
    <img
      class="projects"
      alt="under construction exhibition"
      style="width: 100%; height: auto"
      src="https://cdn.glitch.com/c872ab9a-264e-4ce2-91db-721811e90193%2Funderconstruction.jpg"
    />
    </a>
    </div>
    `, nopad: true
      }),
      new SectionApp({
        dom: jdom`
      <div>

      <p>
        <a href="https://bestchat.glitch.me/"
          >Best Practices Chat (2020-)</a
        >
        is a space for Jorge Guevara and
        <span class="naoto">Naoto</span> to reflect on the practices.
      </p>

      <p>
        <a href="https://razio.glitch.me"
          >Razio (2020-)</a
        >
        is a podcast by <span class="naoto">Naoto</span> with a special guest.
      </p>

      <p>
        <a href="https://naotohieda.com/blog/">Blog (2019-)</a> is a place
        where you can find latest or stale information about
        <span class="naoto">Naoto</span>.
      </p>

      <p>
        <a href="https://naoto-portfolio.glitch.me/">Portfolio (2014-)</a> is an online exhibition of every work that 
        <span class="naoto">Naoto</span> created and contributed.
      </p>

      <p>
        <a href="https://www.khm.de/home/">KHM (1990-)</a> is where
        <span class="naoto">Naoto</span> is at.
      </p>
    </div>
    `}),
      new SectionApp({
        dom: jdom`
    <div>
      <h2>
        Who
      </h2>

      <p class="center-text">
        <span class="naoto">Naoto</span> is a human. Contact me on mail@naotohieda.com
      </p>
    </div>
    `}),
      new SectionApp({
        dom: jdom`
    <p class="center-text"><span class="naoto">Naoto Hieda</span> - design by <a href="https://glitches.me" target="_blank">glitches.me</a></p>
    `})];
  }
  styles() {
    return css`
    position: relative;
    z-index: 1;
    background-color: rgba(255, 255, 255, 0);
    max-width: 768px;
    /* margin: 20px 0 20px 0; */
    padding: 0 10px 0 10px;  
    `
  }
  compose() {
    return jdom`
    <div id="container">
      ${this.s.map(s => s.node)}
    </div>
    `;
  }
}

class App extends Torus.StyledComponent {
  init() {
    this.hydraApp = new HydraApp();
    this.contentApp = new ContentApp();
    this.showCanvas = true;

    if (isMobile !== true) {
      s0.initVideo("./img/bp.webm");
    }
    defaultCode();
  }
  toggleCanvas() {
    this.showCanvas = !this.showCanvas;
    this.render();
  }
  // styles() {
  //   return css`
  //   background-color: black;
  //   `;
  // }
  compose() {
    return jdom`
    <div>
    ${this.showCanvas ? this.hydraApp.node : ""}
    ${this.contentApp.node}
    </div>
    `
  }
}

const defaultCode = () => {
  if (isMobile !== true) {
    osc(20, 0.02, 1.5).rotate(0.1)
      .hue(() => document.body.scrollTop / 1000)
      .layer(
        src(s0).repeat(3, 3).mask(
          solid(1, 1, 1).sub(shape(4, 0.5, 0).scale(1, 1, 2).repeat(3, 3, 0.5).scale(1, 3).mult(src(s0).repeat(3, 3)))
        )
      )
      .scale(() => (Math.sin(-document.body.scrollTop / 200) + 1) * 1)
      .modulatePixelate(noise(8, 0.3).pixelate(32, 32).thresh(0.4, 0.2), -1000 + 32, 1000).out()
  }
  else {
    osc(20, 0.02, 1.5).rotate(0.1)
      .hue(() => document.body.scrollTop / 1000)
      .scale(() => (Math.sin(-document.body.scrollTop / 200) + 1) * 1)
      .modulatePixelate(noise(8, 0.3).pixelate(32, 32).thresh(0.4, 0.2), -1000 + 32, 1000).out()
  }
}
const app = new App();
document.querySelector("div#main").appendChild(app.node);
