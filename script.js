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

const popupWidth = 500;
class PopupApp extends Torus.StyledComponent {
  init(app, params) {
    this.app = app;
    this.params = params;
    this.drag = {
      isMoving: false,
      x: 0,
      y: 0,
      dx: 0,
      dy: 0,
    };
    this.closeState = "";
    this.active = false;
  }
  styles() {
    return css`
    font-family: "arial", sans-serif;
    position: ${ this.params.sticky ? "fixed" : "absolute" };
    z-index: 10;
    left: ${ this.params.x + this.drag.dx }px;
    top: ${ this.params.y + this.drag.dy }px;
    padding: 5px;
    background-color: #bbb;
    border: 2px outset #eee;
    /* border-radius: 1px;
    box-shadow: 0 0 2px black; */
    overflow: hidden;
    max-width: ${ popupWidth }px;

    .content {
      margin: 0 2px;
    }
    .title {
      margin: 0 2px;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: flex-start;
      align-items: center;
      align-content: stretch;
      .icon {
        height: 1em;
        margin: 0.1em;
      }
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      user-select: none;
      background-color: ${ this.active ? "#00f" : "#888" };
      color: white;
    }
    .button {
      background-color: #bbb;
      color: ${ this.params.sticky !== true ? "#000" : "#fff" };
      margin: 2px;
      width: 1em;
      text-align: center;
      border: 2px outset #eee;
    }
    .pressed {
      border: 2px inset #eee;
    }
    `
  }
  compose() {
    return jdom`
    <div onmousedown=${ () => { this.app.sortUp(this) } } >
      <div class="header"
        onmousedown=${ (ev) => {
          if (this.closeState !== "pressed") {
            this.drag.isMoving = true;
            this.drag.x = ev.pageX;
            this.drag.y = ev.pageY;
            const move = (ev) => {
              if (this.drag.isMoving) {
                this.drag.dx = ev.pageX - this.drag.x;
                this.drag.dy = ev.pageY - this.drag.y;
                this.render();
              }
            }
            const up = (ev) => {
              console.log(ev)
              this.drag.isMoving = false;
              this.params.x += this.drag.dx;
              this.params.y += this.drag.dy;
              this.drag.dx = 0;
              this.drag.dy = 0;
              this.render();
              window.removeEventListener("mousemove", move);
              window.removeEventListener("mouseup", up);
            }
            window.addEventListener("mousemove", move);
            window.addEventListener("mouseup", up);
          }
        } }
      >
        <div class="title">${ this.params.icon ?
          jdom`<img class="icon" src="${ this.params.icon }" />` :
          "" }${ this.params.title }</div>
        <div class="button ${ this.closeState }"
          onmousedown=${ () => {
            if (this.params.sticky !== true) {
              this.closeState = "pressed";
              this.render();
            }
          } }
          onmouseup=${ () => {
            if (this.params.sticky !== true) {
              this.closeState = "";
              this.render();
            }
          } }
          onmouseleave=${ () => {
            if (this.params.sticky !== true) {
              this.closeState = "";
              this.render();
            }
          } }
          onclick=${ () => {
            if (this.params.sticky !== true) {
              this.app.closePopup(this);
            }
          } }
          ontouchstart=${ (ev) => {
            if (this.params.sticky !== true) {
              // ev.preventDefault();
              this.app.closePopup(this);
            }
          } }>x</>
      </div>
      <div class="content">
        ${ this.params.dom.node === undefined ? this.params.dom : this.params.dom.node }
      </div>
    </div>
    `;
  }
}

class SectionApp extends Torus.StyledComponent {
  init(props) {
    const keys = Object.keys(props);
    for (const key of keys) {
      this[key] = props[key];
    }
    if (this.code === undefined) this.code = () => osc().out();
    if (this.title === undefined) {
      this.title = "";
    }
  }
  styles() {
    let c = `
    // padding: 20px 0 20px 0;
    margin: 60px 5px 60px 5px;
    background-color: rgba(255, 255, 255, 1);
    box-shadow: 2px 2px 0px #000;
    -webkit-box-shadow: 2px 2px 0px #000;
    width: auto;
    max-width: 500px;
    padding: 5px;

    border: 2px outset #eee;
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      // cursor: pointer;
      user-select: none;
      background-color: ${ this.active ? "#00f" : "#888" };
      color: white;
    }
    .button {
      background-color: #bbb;
      color: "#fff";
      margin: 2px;
      width: 1em;
      text-align: center;
      border: 2px outset #eee;
    }
    .title {
      margin: 0 2px;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: flex-start;
      align-items: center;
      align-content: stretch;
    }
    .icon {
      height: 1em;
      margin: 0.1em;
    }

    img {
      cursor: pointer;
    }
    `;

    if (this.nopad) {
      c += `padding: 5px;
      overflow: hidden;
      `
    }
    else {
      // c += `padding: 20px 0 20px 0;`;
    }
    if (this.pointer) {
      c += `cursor: pointer;
      `;
    }
    return css`${c}`;
  }
  onmousedown(ev) {
    this.clicking = true;
  }
  onmouseup(ev) {
    if (this.clicking !== true) {
      return;
    }
    this.clicking = false;
    this.code();
    if (this.className === "hidecanvas") {
      app.toggleCanvas();
    }
    if (this.modal !== undefined) {
      app.modalApp.toggle(this.modal, ev.pageX, ev.pageY);
    }
  }
  compose() {
    return jdom`
      <section class="${this.className}"
        onmousedown="${ev => this.onmousedown(ev)}"
        onmouseup="${ev => this.onmouseup(ev)}"
      >
        <div class="header">
          <div class="title">${ this.icon ?
            jdom`<img class="icon" src="${ this.icon }" />` :
            "" }${ this.title }</div>
          <div class="button" >x</>
        </div>
        <div class="content">
          ${this.dom()}
        </div>
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

let showCanvas = true;
class ContentApp extends Torus.StyledComponent {
  init(app) {
    this.app = app;
    this.s = [
      new SectionApp({
        title: "Settings",
        dom: () => jdom`
    <div class="msg center-text">${showCanvas ? "😵Hide" : "😎Show"} background</div>
    `, className: "hidecanvas", pointer: true
      }),
      new TitleApp({
        icon: "/favicon_32.png",
        title: "Name",
        dome: () => jdom`
    <h1>
      Naoto Hieda
    </h1>
    `, domj: () => jdom`
    <h1 style="font-weight: normal">
      稗田直人
    </h1>
    `, pointer: true, code: defaultCode
      }),
      new SectionApp({
        title: "What's Up",
        dom: () => jdom`
        <div>
          <img
          class="projects"
          alt="naoto coding"
          src="https://cdn.glitch.global/cada0ae2-f902-428d-81e3-6a68f5e589e5/photo1682454956.jpeg?v=1683810904398"
          style="width: 100%; height: auto"
          onclick=${ (ev) => {
            this.app.openPopup(
              "What's Up",
              jdom`
              <div class="w">
                <div>
                Workshop in April at Hauptsache Frei <br /> Photo by Bente Stachowske
                </div>
              </div>
              `,
              ev);
          } } />
        </div>
    `, code: () => {
          osc(60, 0.1, 1.5)
            .modulate(
              noise(3).modulatePixelate(noise(4).pixelate(32, 32).thresh(0, 0.5), 1024, 32)
            ).out()
        }
      }),
    //   new SectionApp({
    //     title: "Net Art",
    //     dom: () => jdom`
    //     <div>
    //       <img
    //       class="projects"
    //       alt="naoto desktop screen"
    //       src="https://cdn.glitch.global/cada0ae2-f902-428d-81e3-6a68f5e589e5/2023-06-14-syms.jpg?v=1687102224701"
    //       style="width: 100%; height: auto"
    //       onclick=${ (ev) => {
    //         this.app.openPopup(
    //           "Net Art",
    //           jdom`
    //           <div class="w">
    //             <div>
    //             Some net art stuff
    //             </div>
    //           </div>
    //           `,
    //           ev);
    //       } } />
    //     </div>
    // `, code: () => {
    //       osc(60, 0.1, 1.5)
    //         .modulate(
    //           noise(3).modulatePixelate(noise(4).pixelate(32, 32).thresh(0, 0.5), 1024, 32)
    //         ).out()
    //     }
    //   }),
      new SectionApp({
        title: "New Banner",
        icon: "img/favicon-32-banner.png",
        dom: () => jdom`
        <div>
          <img
          class="projects"
          alt="naoto banner"
          src="https://img.glitches.me/images/2023/07/26/naoto-new-banner.jpg"
          style="width: 100%; height: auto"
          onclick=${ (ev) => {
            this.app.openPopup(
              "New Banner",
              jdom`
              <div class="w">
                <div>
                New banner
                </div>
              </div>
              `,
              ev,
              "img/favicon-32-banner.png"
            );
          } } />
        </div>
    `, code: () => {
          osc(60, 0.1, 1.5)
            .modulate(
              noise(3).modulatePixelate(noise(4).pixelate(32, 32).thresh(0, 0.5), 1024, 32)
            ).out()
        }
      }),
      new SectionApp({
        icon: "https://cdn.glitch.global/61984d65-52b6-418b-b420-2547b4acca3d/favicon-32.png?v=1694627304921",
        title: "Naoto's Cards",
        dom: () => jdom`
        <div>
          <img
          class="projects"
          alt="naoto's cards displayed"
          src="https://img.glitches.me/images/2023/07/26/cards_sq.jpg"
          style="width: 100%; height: auto"
          onclick=${ (ev) => {
            this.app.openPopup(
              "Naoto's Cards",
              jdom`
              <div class="w">
                <div>
                My cards, spawned from the autobiographical project
                <a href="https://soup.glitches.me"
                target="_blank">
                soup.glitches.me</a>
                </div>
              </div>
              `,
              ev,
              "https://cdn.glitch.global/61984d65-52b6-418b-b420-2547b4acca3d/favicon-32.png?v=1694627304921",
            );
          } } />
        </div>
    `, code: () => {
          osc(60, 0.1, 1.5)
            .modulate(
              noise(3).modulatePixelate(noise(4).pixelate(32, 32).thresh(0, 0.5), 1024, 32)
            ).out()
        }
      }),
    //   new SectionApp({
    //     title: "Under Construction",
    //     dom: () => jdom`
    // <div>
    //   <img
    //     class="projects"
    //     alt="under construction"
    //     src="./img/underconstruction.gif"
    //     style="width: 100%; height: auto"
    //     onclick=${ (ev) => {
    //       this.app.openPopup(
    //         "Under Construction",
    //         jdom`
    //         <div class="w">
    //           <div>
    //             <p>
    //             GIF taken from
    //             <a href="http://www.textfiles.com/underconstruction/" target="_blank">here</a> (beware - many images)
    //             </p>
    //             <p>
    //               This website is permanently under construction
    //             </p>
    //             <p>
    //             <span class="naoto">Naoto</span> is permanently under pressure
    //             </p>
    //         </div>
    //         `,
    //         ev);
    //     } } />
    //     <p class="center-text">
    //   </p>
    // </div>
    // `, code: () => {
    //       osc(2, 0, 1.5).modulate(solid(2)).contrast(2).out()

    //     },
    //   }),
      new SectionApp({
        title: "#NaotoHieda",
        dom: () => jdom`
    <div>
    <img
      class="projects"
      alt="hashtag naoto hieda, an artwork of a printed banner"
      style="width: 100%; height: auto"
      src="https://img.glitches.me/images/2022/02/13/banner.jpg"
      onclick=${ (ev) => {
      this.app.openPopup(
        "#NaotoHieda",
        jdom`
        <div class="w">
          <div>
            <p>
              #NaotoHieda is an artwork around a computer program and a body. A screenshot of a performance using the artist’s body and a custom-made web editor for live-coding is printed as a 12-meter-wide construction banner, exhibited at Pola Museum Annex in Tokyo, Japan.
            </p>
            <p>
              Details can be found <a href="https://naotohieda.glitch.me/" target="_blank">naotohieda.glitch.me</a> as well as on <a href="https://www.creativeapplications.net/member-submissions/naotohieda-live-coding-on-a-construction-banner/" target="_blank">CreativeApplications.Net</a>.
            </p>
          </div>
        </div>
        `,
        ev);
    } } />

    </div>
    `, nopad: true,
        code: () => {
          osc(30,0.03,1.5).out()
        },
      }),
      new SectionApp({
        title: "riso.glitches.me",
        dom: () => jdom`
    <div>
    <img
      class="projects"
      alt="riso.glitches.me, a mass printed risograph work"
      style="width: 100%; height: auto"
      src="https://img.glitches.me/images/2022/03/15/riso_.jpg"
      onclick=${ (ev) => {
        this.app.openPopup(
          "riso.glitches.me",
          jdom`
          <div class="w">
            <div>
              <p>
                riso.glitches.me is an artwork consisting of risograph prints of the artist’s brain and a custom-made computer program.
              </p>
              <p>
                Image processing is applied to an MRI scan pattern of the brain, and the output is printed as 2-color risograph. The image processing is sophisticatedly designed so that the printing offset of risograph generates different shading for each print from the same set of master patterns. 
              </p>
              <p>
                Details can be found on <a href="https://riso.glitches.me/" target="_blank">riso.glitches.me</a>. Photo by Pola Museum Annex.
              </p>
            </div>
          </div>
          `,
          ev);
      } } />
    </div>
    `, nopad: true,
        code: () => {
          osc(60,0.03).thresh(.7,.1).color(1,0,0)
          .add(osc(60,0.03).thresh(.7,.1).color(0,0,1).modulate(noise(3),.01))
          .rotate().invert().hue().out()
        },
      }),

      new SectionApp({
        icon: "/img/favicon-32-festival.png",
        title: "festival.naotohieda.com",
        dom: () => jdom`
        <div>
          <img
          class="projects"
          alt="people sitting around and cutting vegetables"
          src="https://bild.glitches.me/images/2023/03/09/_DSC1986fa8b502b7cfb68e8.jpg"
          style="width: 100%; height: auto"
          onclick=${ (ev) => {
            this.app.openPopup(
              "festival.naotohieda.com",
              jdom`
              <div class="w">
                <div>
                  <p>
                    <a href="https://festival.naotohieda.com/" target="_blank">festival.naotohieda.com</a><br />
                    Photo by Andrea Gamboa (IG <a href="https://instagram.com/acciondevista" target="_blank">@acciondevista</a>)
                  </p>
                </div>
              </div>
              `,
              ev,
              "/img/favicon-32-festival.png",
            );
          } } />
        </div>
      `, nopad: true,
      code: () => {
          osc(60, 0.1, 1.5)
            .modulate(
              noise(3).modulatePixelate(noise(4).pixelate(32, 32).thresh(0, 0.5), 1024, 32)
            ).out()
        }
      }),

      new SectionApp({
        icon: "/img/favicon-32-nail.png",
        title: "nail.glitches.me",
        dom: () => jdom`
    <div>
    <img
      class="projects"
      alt="naoto painting nails"
      style="width: 100%; height: auto"
      src="https://img.glitches.me/images/2023/07/26/20230722_KHM_RundgangDSC_0739_c_Doerthe_Boxberg_sq.jpg"
      onclick=${ (ev) => {
      this.app.openPopup(
        "nail.glitches.me",
        jdom`
        <div class="w">
          <div>
          <p>
          Photo: Dörthe Boxberg
          </p>
          <p>
            <a href="https://nail.glitches.me" target="_blank">Naoto's nail salon</a>
          </p>
          <p>
            Naoto’s Nail Salon is a nail salon by Naoto. Everyone is invited to have nails done for free. It was founded on 28th September 2022 at the National University of Colombia, Bogotá during a writing seminar as a response to a topic around hands.
          </p>
          </div>
        </div>
        `,
        ev,
        "/img/favicon-32-nail.png",
      );
    } } />
    </div>
    `, nopad: true,
        code: () => {
          osc(30,0.03,1.5).out()
        },
      }),

    //   new SectionApp({
    //     title: "#spektrum",
    //     dom: () => jdom`
    // <div>
    // <img
    //   class="projects"
    //   alt="video screened in a station"
    //   style="width: 100%; height: auto"
    //   src="https://bild.glitches.me/images/2022/09/24/naoto_spektrum.gif"
    //   onclick=${ (ev) => {
    //   this.app.openPopup(
    //     "#spektrum",
    //     jdom`
    //     <div class="w">
    //       <div>
    //         <p>
    //           10 sec video screened at Cologne Main Station as part of ctrl-space by Christian Sievers
    //         </p>
    //         <p>
    //           #spektrum is a convolution of identity questions that we face, including, but not only, the gender spectrum and autism spectrum. The fingers as an analog, imperfect medium with a color spectrum of nail polish count binary numbers mimicking a self-stimulatory behavior (stimming) to provoke and to challenge the stigma of "binariness" of autism.
    //         </p>
    //       </div>
    //     </div>
    //     `,
    //     ev);
    // } } />
    // </div>
    // `, nopad: true,
    //     code: () => {
    //       osc(30,0.03,1.5).out()
    //     },
    //   }),

      new SectionApp({
        title: "GlitchMe3D",
        dom: () => jdom`
    <div>
    <img
      class="projects"
      alt="glitch me with flor de fuego"
      style="width: 100%; height: auto"
      src="https://img.glitches.me/images/2022/02/26/glitchme.jpg"
      onclick=${ (ev) => {
        this.app.openPopup(
          "GlitchMe3D",
          jdom`
          <div class="w">
            <p>
              Project with <a href="https://flordefuego.github.io/" target="_blank">Flor de Fuego</a> as part of fellowship at Academy for Theater and Digitality (Dortmund, Germany).
            </p>
            <p>
              GlitchMe is a laboratory of witchcraft around composition of scenic objects and decomposition of algorithms invoking a network of feedback loops. Digitality can become dreams moving and interacting in multiple spaces in a non-linear time. Through feedback loops we create windows that can open new possibilities to narrate distorted and glitched worlds.
            </p>
            <p>
              Details can be found on <a href="https://3d.glitches.me/" target="_blank">3d.glitches.me</a>.
            </p>
          </div>
          `,
          ev);
      } } />
    </div>
    `, nopad: true,
        code: () => {
          solid(1, 1, 1).layer(
            src(o0).scale(1, 0.5, -1).hue(2 / 3))
            .layer(
              osc(50, 0.02, 1.5).mask(osc(25, -0.01).thresh(0.5, 0)).mult(osc(25, -0.01, 1.5).r().luma(0, 0))
                .modulate(noise(2, 0.05).modulate(solid(0, 1), () => time * .2), 0.05)
            ).out()
        },
      }),

      new SectionApp({
        icon: "/img/favicon-32-bp.png",
        title: "#BestPracticesInContemporaryDance",
        dom: () => jdom`
    <div>
      <img
        class="projects"
        alt="best practices"
        style="width: 100%; height: auto"
        src="https://img.glitches.me/images/2022/08/31/IMG_1034.jpg"
        onclick=${ (ev) => {
          this.app.openPopup(
            "#BestPracticesInContemporaryDance",
            jdom`
            <div class="w">
              <p>
                Project with <a href="https://jorgeguevara.myportfolio.com/" target="_blank">Jorge Guevara</a>
              </p>
              <p>
                Jorge Guevara and Naoto Hieda met over the internet as part of a series of meetups that Naoto organized during lockdown in April 2020, which turned into focused sessions called “Best Practices in Contemporary Dance”. Since then, on a weekly basis, Naoto Hieda in Cologne and Jorge Guevara in Brussels meet online to “practice” for an hour. We stream, distort and alter the videos of ourselves and each other both using commercial and/or open-source software to blend our bodies in the “pixel space”. We do not define what tools and components are to be used, and the practice might include spontaneous reading, writing, eating or body painting. The project is not intended to produce a performance; the practice itself is the outcome and the objective is to create a fluid, queer form of conversation between technology and bodies. Another aspect of the process is a “chat”, a casual discussion to reflect on the practice. Both the practices and chats are recorded and uploaded on YouTube as a massive online archive. The project was presented at NODE20 Festival (Frankfurt), Performing Arts Forum (Saint-Erme, France), SEADS (Space Ecologies Art and Design), IDOCDE (ImPulsTanz, Vienna), NEW NOW (Essen), Hauptsache Frei (Hamburg) as (ever-)work-in-progress.
              </p>
              <p>
              Details can be found on <a href="https://best-practices.glitch.me/" target="_blank">best-practices.glitch.me</a>.
            </p>
            </div>
            `,
            ev,
            "/img/favicon-32-bp.png",
          );
        } } />
      </div>
    `, nopad: true,
    code: () => src(o0).modulate(osc(6,0,1.5).modulate(noise(3).sub(gradient()),1).brightness(-.5),0.01).layer(osc(80,0.1,1.5).mask(shape(4,0.3,0))).out()
      }),

    //   new SectionApp({
    //     title: "Leewa",
    //     dom: () => jdom`
    // <div>
    // <img
    //   class="projects"
    //   alt="screen of live coding"
    //   style="width: 100%; height: auto"
    //   src="https://cdn.glitch.me/cada0ae2-f902-428d-81e3-6a68f5e589e5%2Fvlcsnap-2021-11-18-10h55m20s617.png?v=1637200592768"
    //   onclick=${ (ev) => {
    //   this.app.openPopup(
    //     "Leewa",
    //     jdom`
    //     <div class="w">
    //       <div>
    //         <p>
    //           Audiovisual with <a href="https://www.ekheo.com/" target="_blank">Ekheo (Aude Langlois and Belinda Sykora)</a>. Watch <a href="https://www.youtube.com/watch?v=MTmKFf6HImA" target="_blank">here</a>
    //         </p>
    //         <p>
    //         <i>
    //           The latest absolutely eye-popping work made with free Web live-coding tool Hydra comes from artist Naoto Hieda, with sound by the duo Ekheo (Aude Langlois and Belinda Sykora) and some eerie AI poetry. If that didn’t melt your brain entirely, you can follow along with tutorials to harness the powers of Hydra, too.
    //           </i>
    //         </p>
    //         <p>
    //           -- Quote from <a href="https://cdm.link/2021/11/livecoding-glitch-eye-searing-colors-ai-poetry-and-the-knowledge-to-make-it-yourself-for-free/" target="_blank">CDM article by Peter Kirn</a>
    //         </p>
    //       </div>
    //     </div>
    //     `,
    //     ev);
    // } } />
    // </div>
    // `, nopad: true,
    //     code: () => {
    //       osc(30,0.03,1.5).out()
    //     },
    //   }),

    //   new SectionApp({
    //     title: "Conversations with Computers",
    //     dom: () => jdom`
    // <div>
    // <img
    //   class="projects"
    //   alt="exhibition view of a laptop and a banner"
    //   style="width: 100%; height: auto"
    //   src="https://cwc.radical-openness.org/html-space/img/exhibition/Exhibition(22).edit.jpg"
    //   onclick=${ (ev) => {
    //   this.app.openPopup(
    //     "Conversations with Computers",
    //     jdom`
    //     <div class="w">
    //       <div>
    //         <p>
    //           The show is the outcome of a <a href="https://core.servus.at/en/projekt/conversations-computers/review-silicon-friend-camp-2021" target="_blank">week-long worksession</a> with 15 international artists in the austrian alps organized by servus.at and Matthias Pitscher as part of the 2021 <a href="https://research.radical-openness.org/2021/" target="_blank">Art Meets Radical Openness Research Lab</a>
    //         </p>
    //         <p>
    //           Photo from exhibition documentation below
    //         </p>
    //         <p>
    //           Details <a target="_blank" href="https://cwc.radical-openness.org">here</a>
    //         </p>
    //       </div>
    //     </div>
    //     `,
    //     ev);
    // } } />
    // </div>
    // `, nopad: true,
    //     code: () => {
    //       osc(30,0.03,1.5).out()
    //     },
    //   }),

    //   new SectionApp({
    //     title: "NODE20",
    //     dom: () => jdom`
    // <div>
    // <img
    //   class="projects"
    //   alt="screenshot of mozila hubs with various 3d models"
    //   style="width: 100%; height: auto"
    //   src="https://cdn.glitch.com/e9f27e4f-87e5-46c9-8645-e03a6aedc236%2F201007node.png?v=1603140395893"
    //   onclick=${ (ev) => {
    //   this.app.openPopup(
    //     "NODE20",
    //     jdom`
    //     <div class="w">
    //       <div>
    //         <p>
    //           Choreographic Coding Lab Online is a series of events organized and curated by Naoto Hieda as an official unconference that took place at <a target="_blank" href="https://20.nodeforum.org/">NODE20 (Frankfurt, Germany)</a>.
    //         </p>
    //         <p>
    //           The sessions format depends on the host: there may be workshops, lectures, discussions, performative practices or formats in between. Topics will vary from somatic movements to programming bots, or even collective cooking. Festival participants are invited to all the sessions and may propose and host additional sessions.
    //         </p>
    //         <p>
    //           Details can be found on <a href="https://cconline-node.glitch.me/" target="_blank">cconline-node.glitch.me</a>.
    //         </p>
    //       </div>
    //     </div>
    //     `,
    //     ev);
    // } } />
    // </div>
    // `, nopad: true,
    //     code: () => {
    //       osc(30,0.03,1.5).out()
    //     },
    //   }),

      new SectionApp({
        title: "misc",
        dom: () => jdom`
      <div>
      
      <p>
        <a href="https://festival.glitches.me"
          >festival.glitches.me (2021-2022)</a
        >
        is an independent online festival organized by and for
        <span class="naoto">Naoto</span>.
      </p>

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
    `, code: () =>
    solid().layer(
  osc(4,0,1.5).modulate(osc(20, 0.0001, 0).brightness(-0.4).sub(gradient()),1)
    .mask(
      osc(20, 0.0001).scrollX(() => -document.body.scrollTop / 10000)
        .rotate(Math.PI * 4 / 180)
        .thresh(0.6, 0)
    )
    .rotate(Math.PI / 2)
    .modulateScale(noise(8, 0.003)
      .pixelate(8, 8)
      .modulate(noise(3, 0.01))
      .thresh(0.4, 0.2), 1, -0.95)
    .modulateRotate(noise(8, 0.003)
    .pixelate(8, 8)
    .modulate(noise(3, 0.01))
    .thresh(0.4, 0.2), 6)
      .scale(1,()=>window.innerHeight/window.innerWidth)
    ).out()}),
      new SectionApp({
        title: "Who",
        dom: () => jdom`
    <div>
      <p class="center-text">
        <span class="naoto">Naoto</span> is a human. Contact me on mail@naotohieda.com
      </p>
    </div>
    `}),
      new SectionApp({
        title: "Credits",
        dom: () => jdom`
    <p class="center-text"><span class="naoto">Naoto Hieda</span> - design by <a href="https://glitches.me" target="_blank">glitches.me</a></p>
    `, code: () => noise().out()})];
  }
  styles() {
    return css`
    position: relative;
    z-index: 1;
    background-color: rgba(255, 255, 255, 0);
    /* margin: 20px 0 20px 0; */
    padding: 0 10px 0 10px;  
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: flex-start;
    align-content: stretch;
    `
  }
  render() {
    this.s.forEach(s => s.render());
    super.render();
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
    this.contentApp = new ContentApp(this);

    if (isMobile !== true) {
      s0.initVideo("./img/bp.webm");
    }
    defaultCode();
    this.popups = [];
  }
  dummy() {
    const params = {};
    params.x = 5;
    params.y = window.innerHeight - 100;
    params.title = "热烈欢迎";
    params.sticky = true;
    params.dom = jdom`test`
    this.popups.push(new PopupApp(this, params));
    this.popups[0].active = true;
    this.popups[0].render();
  }
  toggleCanvas() {
    showCanvas = !showCanvas;
    this.contentApp.render()
    this.render();
  }
  openPopup(title, dom, ev, icon) {
    if (this.popups.find(e => e.params.title === title)) return; // oops
    const params = {};
    params.x = ev.pageX;
    if (window.innerWidth - params.x < popupWidth) {
      params.x = Math.max(0, window.innerWidth - popupWidth);
    }
    params.y = ev.pageY;
    params.title = title;
    params.icon = icon;
    params.dom = dom;
    this.popups.push(new PopupApp(this, params));
    this.render();
    this.updatePopups();
  }
  closePopup(popup) {
    const index = this.popups.indexOf(popup);
    if (index >= 0) {
      this.popups.splice(index, 1);
      this.render();
    }
    this.updatePopups();
  }
  sortUp(popup) {
    if (this.popups[this.popups.length - 1] === popup) {
      return;
    }
    this.closePopup(popup);
    this.popups = [...this.popups, popup];
    this.render();
    this.updatePopups();
  }
  updatePopups() {
    this.popups.forEach((p, i) => {
      if (i === this.popups.length - 1) {
        p.active = true;
      }
      else {
        p.active = false;
      }
      p.render();
    });
  }
  // styles() {
  //   return css`
  //   background-color: black;
  //   `;
  // }
  compose() {
    return jdom`
    <div>
    ${showCanvas ? this.hydraApp.node : ""}
    ${ this.popups.map(e => e.node) }
    ${this.contentApp.node}
    </div>
    `
  }
}

const defaultCode = () => {
  // if (isMobile !== true) {
  //   osc(20, 0.02, 1.5).rotate(0.1)
  //     .hue(() => document.body.scrollTop / 1000)
  //     .layer(
  //       src(s0).repeat(3, 3).mask(
  //         solid(1, 1, 1).sub(shape(4, 0.5, 0).scale(1, 1, 2).repeat(3, 3, 0.5).scale(1, 3).mult(src(s0).repeat(3, 3)))
  //       )
  //     )
  //     .scale(() => (Math.sin(-document.body.scrollTop / 200) + 1) * 1)
  //     .modulatePixelate(noise(8, 0.3).pixelate(32, 32).thresh(0.4, 0.2), -1000 + 32, 1000).out()
  // }
  // else {
  //   osc(20, 0.02, 1.5).rotate(0.1)
  //     .hue(() => document.body.scrollTop / 1000)
  //     .scale(() => (Math.sin(-document.body.scrollTop / 200) + 1) * 1)
  //     .modulatePixelate(noise(8, 0.3).pixelate(32, 32).thresh(0.4, 0.2), -1000 + 32, 1000).out()
  // }
  // solid(.3,.3,1)
  osc(.2,0,1.5).modulate(solid(5,0),()=>-2+document.body.scrollTop / 2000)
  .add(noise(3,0.01).add(noise(6,0.01)).thresh())
  .layer(
    shape(999,.1,.05).r().color(1,.5,0)
    .modulate(solid(.75,0),1)
    .rotate(()=>document.body.scrollTop / 2000)
    .modulate(solid(.5,.1),-1))
  .layer(
    solid(0,1,0).mult(osc(7,0).rotate(-.5),.7)
    .mask(shape(1,0,0)).modulate(
      osc(3.5,0.01).brightness(-.5),.1)
    .modulate(solid(1), ()=>-document.body.scrollTop / 2000)
  )
  .scale(1,()=>window.innerHeight/window.innerWidth)
  .out()
  
}
const app = new App();
document.querySelector("div#main").appendChild(app.node);
