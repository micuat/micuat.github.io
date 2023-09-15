import html from "choo/html";
import { css } from "@emotion/css";

import HydraElement from "../components/hydra-element.js";

import underConstructionImg from "../../img/underconstruction.gif";

const w = 250;
const mw = 30;

const mainCss = css`
@media only screen and (min-width: ${ (w + mw) * 2 }px) {
  -moz-column-count: 2;
  -webkit-column-count: 2;
  column-count: 2;
}

@media only screen and (min-width: ${ (w + mw) * 3 }px) {
  -moz-column-count: 3;
  -webkit-column-count: 3;
  column-count: 3;
}

@media only screen and (min-width: ${ (w + mw) * 4 }px) {
  -moz-column-count: 4;
  -webkit-column-count: 4;
  column-count: 4;
}

@media only screen and (min-width: ${ (w + mw) * 5 }px) {
  -moz-column-count: 5;
  -webkit-column-count: 5;
  column-count: 5;
}

.section {
  margin: 2em 0;
}
img {
  width: 100%;
}
.window {
  page-break-inside: avoid;
}
.hydra-holder {
  z-index: -1;
  width: 100%;
  height: 100%;
  position: fixed;
}
.no-display {
  display: none;
}
`;

class Element {
  constructor({ img, title, text }) {
    this.img = img;
    this.title = title;
    this.text = text;
    this.minimized = false;
    this.maximized = false;
  }
  toggleMinimize() {
    this.minimized = !this.minimized;
  }
  toggleMinimize() {
    this.maximized = !this.maximized;
  }
  html(state, emit) {
    const minimize = (e) => {
      this.toggleMinimize();
      emit("render");
    }
    const maximize = (e) => {
      this.toggleMaximize();
      emit("render");
    }

    return html`
      <div class="window" style="margin: ${ mw }px; width: ${ w }px">
        <div class="title-bar">
          <div class="title-bar-text">
            ${ this.title ? html`<div>${ this.title }</div>` : "" }
          </div>
          <div class="title-bar-controls">
            <button aria-label="Minimize" onclick=${ minimize }></button>
            <button aria-label="Maximize" onclick=${ maximize }></button>
            <button aria-label="Close"></button>
          </div>
        </div>
        <div class="window-body ${ this.minimized ? "no-display" : "" }">
          ${ this.img ? html`<img src="${ this.img }" />` : "" }
          ${ this.text ? html`<div>${ this.text }</div>` : "" }
        </div>
      </div>
    `;
  }
}
const contents = [
  {
    img: underConstructionImg,
    title: "#UnderConstruction",
    text: html`
    <div>
      The website is currently (and forever) underconstruction.
      You can find the old version <a href="/2022">here</a>.
    </div>`,
  },
  {
    img: "https://img.glitches.me/images/2023/07/26/naoto-new-banner.jpg",
    title: "New Banner",
    text: html`
    <div>
      I made a new banner at KHM.
    </div>`,
  },
  {
    img: "https://img.glitches.me/images/2023/07/26/cards_sq.jpg",
    title: "Naoto's Cards",
    text: html`
    <div>
      Here are Naoto's cards! More editions are coming.
    </div>`,
  },
  {
    img: "https://img.glitches.me/images/2022/02/13/banner.jpg",
    title: "#NaotoHieda",
    text: html`
    <div>
      This is a big banner I made in 2022 with a scaffolding!
    </div>`,
  },
  {
    img: "https://img.glitches.me/images/2023/07/26/20230722_KHM_RundgangDSC_0739_c_Doerthe_Boxberg_sq.jpg",
    title: "Naoto's Nail Salon",
    text: html`
    <div>
      Naoto's nail salon.
    </div>`,
  },
  {
    img: "https://img.glitches.me/images/2022/08/31/IMG_1034.jpg",
    title: "#BestPractices",
    text: html`
    <div>
      Best Practices in Contemporary Dance is a project with Jorge Guevara.
    </div>`,
  },
  {
    // img: "https://img.glitches.me/images/2022/08/31/IMG_1034.jpg",
    title: "Portfolio",
    text: html`
    <div>
      You can find a complete list of my work in my <a href="https://naoto-portfolio.glitch.me/">portfolio</a>.
    </div>`,
  },
].map(e => new Element(e));

// export module
export default function(state, emit) {
  return html`
    <div class=${ mainCss }>

      <div class="window" style="margin: 0 ${ mw }px; width: ${ w }px">
        <div class="title-bar">
          <div class="title-bar-text">
            Hi!
          </div>
        </div>
        <div class="window-body">
          Hi! Welcome to Naoto's website!

        </div>
      </div>
      ${ contents.map(e => e.html(state, emit)) }
      ${ state.cache(HydraElement, 'my-hydra').render(state, emit) }
    </div>
  `;

}
