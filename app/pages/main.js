import html from "choo/html";
import { css } from "@emotion/css";

import underConstructionImg from "../../img/underconstruction.gif";

const mainCss = css`
.section {
  margin: 2em 0;
  img {
    width: 300px;
  }
}
`;

const contents = [
  {
    img: underConstructionImg,
    text: html`
    <div>
      The website is currently (and forever) underconstruction.
      You can find the old version <a href="/2022">here</a>.
    </div>`,
  },
  {
    img: "https://img.glitches.me/images/2023/07/26/naoto-new-banner.jpg",
    text: html`
    <div>
      I made a new banner at KHM.
    </div>`,
  },
  {
    img: "https://img.glitches.me/images/2023/07/26/cards_sq.jpg",
    text: html`
    <div>
      Here are Naoto's cards! More editions are coming.
    </div>`,
  },
  {
    img: "https://img.glitches.me/images/2022/02/13/banner.jpg",
    text: html`
    <div>
      This is a big banner I made in 2022 with a scaffolding!
    </div>`,
  },
  {
    img: "https://img.glitches.me/images/2023/07/26/20230722_KHM_RundgangDSC_0739_c_Doerthe_Boxberg_sq.jpg",
    text: html`
    <div>
      Naoto's nail salon.
    </div>`,
  },
  {
    img: "https://img.glitches.me/images/2022/08/31/IMG_1034.jpg",
    text: html`
    <div>
      Best Practices in Contemporary Dance is a project with Jorge Guevara.
    </div>`,
  },
  {
    // img: "https://img.glitches.me/images/2022/08/31/IMG_1034.jpg",
    text: html`
    <div>
      You can find a complete list of my work in my <a href="https://naoto-portfolio.glitch.me/">portfolio</a>.
    </div>`,
  },
];

// export module
export default function(state, emit) {
  return html`
    <div class=${ mainCss }>
      <div class="section">
        Hi! Welcome to Naoto's website!
      </div>
      <div>
        ${ contents.map(e => html`
          <div class="section">
            ${ e.img ? html`<img src="${ e.img }" />` : "" }
            ${ e.text ? html`<div>${ e.text }</div>` : "" }
          </div>
        `) }
      </div>
    </>
  `;
}
