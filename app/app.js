// import choo
import choo from "choo";
import html from "choo/html";

// import machine from "./stores/machine.js";

// initialize choo
const app = choo({ hash: true });
// app.use(machine);

app.route("/*", notFound);

function notFound() {
  return html`
    <div>
      <a href="/"> 404 with love ❤ back to top! </a>
    </div>
  `;
}

// import a template
import mainView from "./pages/main.js";

app.route("/", mainView);

// start app
app.mount("#choomount");
