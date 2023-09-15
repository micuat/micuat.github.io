import html from "choo/html";
import { css } from "@emotion/css";

import HydraElement from "../components/hydra-element.js";

import underConstructionImg from "../../img/underconstruction.gif";

const w = 300;
const mw = 10;

const mainCss = css`
display: flex;
flex-direction: row;
flex-wrap: nowrap;
justify-content: center;
align-items: center;
align-content: center;
padding: 10px;

.windows {
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
}
img {
  width: 100%;
}
.title-bar-text {
  .icon {
    width: 20px;
    height: 20px;
    margin-right: 5px;
  }
  display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	justify-content: flex-start;
	align-items: center;
	align-content: stretch;
}
.window {
  page-break-inside: avoid;
  margin: ${ mw }px;
  width: ${ w }px;
  font-size: 10pt;
  box-sizing: border-box;
}
.window-wrap.full {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  margin: 0;
  padding: 0 10px;
  overflow-y: scroll;
  .window.full {
    position: relative;
    width: 100%;
    height: 100%;
    margin: 0;
    overflow-y: scroll;
    .window-body {
      img {
        max-width: 50%;
      }
      @media only screen and (max-width: 600px) {
        display: inherit;
        img {
          max-width: 100%;
        }
      }
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: flex-start;
      align-items: stretch;
      align-content: stretch;
    }
  }
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
  constructor({ img, alt, icon, title, text }) {
    this.img = img;
    this.alt = alt;
    this.icon = icon;
    this.title = title;
    this.text = text;
    this.minimized = false;
    this.maximized = false;
  }
  toggleMinimize() {
    if (this.maximized) {
      this.minimized = false;
      this.maximized = false;
    }
    else {
      this.minimized = !this.minimized;
      this.maximized = false;
    }
  }
  toggleMaximize() {
    this.maximized = !this.maximized;
    this.minimized = false;
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
    <div class="window-wrap ${ this.maximized ? "full" : "" }">
      <div class="window ${ this.maximized ? "full" : "" }">
        <div class="title-bar">
          <div class="title-bar-text">
            ${ this.icon ? html`
            <img class="icon" src="${ this.icon }" />
            ` : "" }
            ${ this.title ? this.title : "" }
          </div>
          <div class="title-bar-controls">
            <button aria-label="Minimize" onclick=${ minimize }></button>
            <button aria-label="Maximize" onclick=${ maximize }></button>
            <button aria-label="Close" class="no-display"></button>
          </div>
        </div>
        <div class="window-body ${ this.minimized ? "no-display" : "" }">
          ${ this.img ? html`<img alt="${ this.alt }" src="${ this.img }" />` : "" }
          ${ this.text && this.maximized ? html`<div>${ this.text }</div>` : "" }
        </div>
      </div>
    </div>
    `;
  }
}
const contents = [
  {
    img: underConstructionImg,
    title: "#UnderConstruction",
    alt: "under construction 90s banner",
    icon: "/img/favicon-32-new.png",
    text: html`
    <div>
      The website is currently (and forever) underconstruction. Finally it is upgraded to "7". But you can find the old "98" version <a href="/2022">here</a> (its contents will not be updated, though).
    </div>`,
  },
  {
    img: "https://img.glitches.me/images/2023/07/26/naoto-new-banner.jpg",
    title: "New Banner",
    alt: "banner of closeup of naoto's face displayed outside",
    icon: "/img/favicon-32-banner.png",
    text: html`
    <div>
      I made a new banner at KHM.
    </div>`,
  },
  {
    img: "https://img.glitches.me/images/2023/07/26/cards_sq.jpg",
    title: "Naoto's Cards",
    alt: "naoto's cards displayed",
    icon: "https://cdn.glitch.global/61984d65-52b6-418b-b420-2547b4acca3d/favicon-32.png?v=1694627304921",
    text: html`
    <div>
      Here are Naoto's cards! More editions are coming.
    </div>`,
  },
  {
    img: "https://img.glitches.me/images/2022/02/13/banner.jpg",
    title: "#NaotoHieda",
    alt: "hashtag naoto hieda, an artwork of a printed banner",
    icon: "/img/favicon-32-nh.png",
    text: html`
    <div>
      This is a big banner I made in 2022 with a scaffolding!
    </div>`,
  },
  {
    img: "https://img.glitches.me/images/2023/07/26/20230722_KHM_RundgangDSC_0739_c_Doerthe_Boxberg_sq.jpg",
    title: "Naoto's Nail Salon",
    icon: "/img/favicon-32-nail.png",
    text: html`
    <div>
      Naoto's nail salon.
    </div>`,
  },
  {
    img: "https://bild.glitches.me/images/2023/03/09/_DSC1986fa8b502b7cfb68e8.jpg",
    alt: "people sitting around and cutting vegetables",
    title: "Naoto's Festival",
    icon: "/img/favicon-32-festival.png",
    text: html`
    <div>
      Naoto's Festival.
    </div>`,
  },
  {
    img: "https://img.glitches.me/images/2022/08/31/IMG_1034.jpg",
    alt: "naoto and jorge posing in front of best practices printed banner on a scaffold",
    title: "#BestPractices",
    icon: "/img/favicon-32-bp.png",
    text: html`
    <div>
      Best Practices in Contemporary Dance is a project with Jorge Guevara.
    </div>`,
  },
  {
    img: "https://img.glitches.me/images/2022/03/15/riso_.jpg",
    alt: "riso.glitches.me, a mass printed risograph work",
    title: "riso.glitches.me",
    icon: "/img/favicon-32-riso.png",
    text: html`
    <div>
      Risography prints generated by code and my brain.
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
      <div class="windows">
        <div class="window" style="margin: 0 ${ mw }px; width: ${ w }px">
          <div class="title-bar">
            <div class="title-bar-text">
              Hi!
            </div>
          </div>
          <div class="window-body">
            Welcome to Naoto's homepage! Press maximize button on the top right of each window for more information.

          </div>
        </div>
        ${ contents.map(e => e.html(state, emit)) }
      </div>
      ${ state.cache(HydraElement, 'my-hydra').render(state, emit) }
    </div>
  `;

}
