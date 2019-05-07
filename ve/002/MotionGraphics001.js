// instance mode by Naoto Hieda

var s = function (p) {

  p.setup = function () {
    p.createCanvas(512, 512)//.parent('p-holder');
  }

  p.draw = function () {
    p.background(0);
    p.translate(p.width / 2, p.height / 2);
    p.stroke(255)
    for(let i = -1; i <= 1; i++) {
      for(let j = -1; j <= 1; j++) {
        p.ellipse(j*100, i*100, 100)
      }
    }
  }

};

var p001 = new p5(s);
