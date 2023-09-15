import html from "choo/html";
import { css } from "@emotion/css";

import HydraElement from "../components/hydra-element.js";

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
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow-y: scroll;

	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	justify-content: center;
	align-items: center;
	align-content: stretch;
  .window.full {
    position: relative;
    width: 100%;
    max-width: 1024px;
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
      flex-direction: column;
      flex-wrap: nowrap;
      justify-content: flex-start;
      align-items: center;
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
          ${ this.img ? html`<img onclick=${ maximize } alt="${ this.alt }" src="${ this.img }" />` : "" }
          ${ this.text && (this.maximized || this.img == null) ? html`<div>${ this.text }</div>` : "" }
        </div>
      </div>
    </div>
    `;
  }
}
const contents = [
  {
    img: "/img/underconstruction.gif",
    title: "#UnderConstruction",
    alt: "under construction 90s banner",
    icon: "/img/favicon-32-new.png",
    text: html`
    <div>
      <div>
        The website is currently (and forever) underconstruction. Finally it is upgraded to "XP". But you can find the old "98" version <a href="/2022">here</a> (its contents will not be updated, though).
      </div>
      <div>
        GIF taken from
        <a href="http://www.textfiles.com/underconstruction/" target="_blank">here</a> (beware - many images)
      </div>
    </div>`,
  },
  {
    img: "https://img.glitches.me/images/2023/07/26/naoto-new-banner.jpg",
    title: "New Banner",
    alt: "banner of closeup of naoto's face displayed outside",
    icon: "/img/favicon-32-banner.png",
    text: html`
    <div>
      <div>
      <a target="_blank" href="https://new-banner.glitch.me/">New banner</a>
      </div>
    </div>`,
  },
  {
    img: "https://img.glitches.me/images/2023/07/26/cards_sq.jpg",
    title: "Naoto's Cards",
    alt: "naoto's cards displayed",
    icon: "https://cdn.glitch.global/61984d65-52b6-418b-b420-2547b4acca3d/favicon-32.png?v=1694627304921",
    text: html`
    <div>
      <div>
        My cards, spawned from the autobiographical project
        <a href="https://soup.glitches.me"
        target="_blank">
        soup.glitches.me</a>.
      </div>
      <div>
        A new edition and tutorial will be released at
        <a href="https://www.interposed.de/"
        target="_blank">
        interposed</a> in October 2023.
      </div>
    </div>`,
  },
  {
    img: "https://img.glitches.me/images/2022/02/13/banner.jpg",
    title: "#NaotoHieda",
    alt: "hashtag naoto hieda, an artwork of a printed banner",
    icon: "/img/favicon-32-nh.png",
    text: html`
    <div>
      <div>
        <p>
          #NaotoHieda is an artwork around a computer program and a body. A screenshot of a performance using the artist’s body and a custom-made web editor for live-coding is printed as a 12-meter-wide construction banner, exhibited at Pola Museum Annex in Tokyo, Japan.
        </p>
        <p>
          Details can be found <a href="https://naotohieda.glitch.me/" target="_blank">naotohieda.glitch.me</a> as well as on <a href="https://www.creativeapplications.net/member-submissions/naotohieda-live-coding-on-a-construction-banner/" target="_blank">CreativeApplications.Net</a>.
        </p>
      </div>
    </div>`,
  },
  {
    img: "https://img.glitches.me/images/2023/07/26/20230722_KHM_RundgangDSC_0739_c_Doerthe_Boxberg_sq.jpg",
    title: "Naoto's Nail Salon",
    icon: "/img/favicon-32-nail.png",
    text: html`
    <div>
      <p>
      Photo: Dörthe Boxberg
      </p>
      <p>
        <a href="https://nail.glitches.me" target="_blank">Naoto's nail salon log</a>
      </p>
      <p>
        Naoto’s Nail Salon is a nail salon by Naoto. Everyone is invited to have nails done for free. It was founded on 28th September 2022 at the National University of Colombia, Bogotá during a writing seminar as a response to a topic around hands.
      </p>
    </div>`,
  },
  {
    img: "https://bild.glitches.me/images/2023/03/09/_DSC1986fa8b502b7cfb68e8.jpg",
    alt: "people sitting around and cutting vegetables",
    title: "Naoto's Festival",
    icon: "/img/favicon-32-festival.png",
    text: html`
    <div>
      <p>
        <a href="https://festival.naotohieda.com/" target="_blank">festival.naotohieda.com</a><br />
        Photo by Andrea Gamboa (IG <a href="https://instagram.com/acciondevista" target="_blank">@acciondevista</a>)
      </p>
    </div>`,
  },
  {
    img: "https://img.glitches.me/images/2022/08/31/IMG_1034.jpg",
    alt: "naoto and jorge posing in front of best practices printed banner on a scaffold",
    title: "#BestPractices",
    icon: "/img/favicon-32-bp.png",
    text: html`
    <div>
      <div>
        NEWS! We are going to develop a new work SFDCANBAC++ at <a href="https://modina.eu/projects/sfdcanbac/" target="_blank">MODINA</a> this coming December-January.
      </div>
      <div>
        Project with <a href="https://jorgeguevara.myportfolio.com/" target="_blank">Jorge Guevara</a>
      </div>
      <div>
        Jorge Guevara and Naoto Hieda met over the internet as part of a series of meetups that Naoto organized during lockdown in April 2020, which turned into focused sessions called “Best Practices in Contemporary Dance”. Since then, on a weekly basis, Naoto Hieda in Cologne and Jorge Guevara in Brussels meet online to “practice” for an hour. We stream, distort and alter the videos of ourselves and each other both using commercial and/or open-source software to blend our bodies in the “pixel space”. We do not define what tools and components are to be used, and the practice might include spontaneous reading, writing, eating or body painting. The project is not intended to produce a performance; the practice itself is the outcome and the objective is to create a fluid, queer form of conversation between technology and bodies. Another aspect of the process is a “chat”, a casual discussion to reflect on the practice. Both the practices and chats are recorded and uploaded on YouTube as a massive online archive. The project was presented at NODE20 Festival (Frankfurt), Performing Arts Forum (Saint-Erme, France), SEADS (Space Ecologies Art and Design), IDOCDE (ImPulsTanz, Vienna), NEW NOW (Essen), Hauptsache Frei (Hamburg) as (ever-)work-in-progress.
      </div>
      <div>
        Details can be found on <a href="https://best-practices.glitch.me/" target="_blank">best-practices.glitch.me</a>.
      </div>
    </div>`,
  },
  {
    img: "https://bild.glitches.me/images/2022/09/24/naoto_spektrum.gif",
    alt: "video screened in a station",
    title: "#spektrum",
    // icon: "/img/favicon-32-riso.png",
    text: html`
    <div>
      <p>
        10 sec video screened at Cologne Main Station as part of ctrl-space by Christian Sievers
      </p>
      <p>
        #spektrum is a convolution of identity questions that we face, including, but not only, the gender spectrum and autism spectrum. The fingers as an analog, imperfect medium with a color spectrum of nail polish count binary numbers mimicking a self-stimulatory behavior (stimming) to provoke and to challenge the stigma of "binariness" of autism.
      </p>
    </div>`,
  },
  {
    img: "https://img.glitches.me/images/2022/03/15/riso_.jpg",
    alt: "riso.glitches.me, a mass printed risograph work",
    title: "riso.glitches.me",
    icon: "/img/favicon-32-riso.png",
    text: html`
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
    </div>`,
  },
  {
    img: "https://img.glitches.me/images/2022/02/26/glitchme.jpg",
    alt: "glitch me with flor de fuego",
    title: "GlitchMe3D",
    text: html`
    <div>
      <p>
        Project with <a href="https://flordefuego.github.io/" target="_blank">Flor de Fuego</a> as part of fellowship at Academy for Theater and Digitality (Dortmund, Germany).
      </p>
      <p>
        GlitchMe is a laboratory of witchcraft around composition of scenic objects and decomposition of algorithms invoking a network of feedback loops. Digitality can become dreams moving and interacting in multiple spaces in a non-linear time. Through feedback loops we create windows that can open new possibilities to narrate distorted and glitched worlds.
      </p>
      <p>
        Details can be found on <a href="https://3d.glitches.me/" target="_blank">3d.glitches.me</a>.
      </p>
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
  {
    // img: "https://img.glitches.me/images/2022/08/31/IMG_1034.jpg",
    title: "Credits",
    text: html`
    <div>
      <p class="center-text"><span class="naoto">Naoto Hieda</span> - design by <a href="https://glitches.me" target="_blank">glitches.me</a></p>
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
            Welcome to Naoto's homepage! Press image or maximize button on the top right of each window for more information.

          </div>
        </div>
        ${ contents.map(e => e.html(state, emit)) }
      </div>
      ${ state.cache(HydraElement, 'my-hydra').render(state, emit) }
    </div>
  `;

}
