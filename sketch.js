const  maxFrame = 340;
function setup() {
  createCanvas(700, 700);
}

function draw() {
  background("#CCE08D");
  let t = frameCount % maxFrame;
  // ciclo (quando esce riesegue il disegno)
  drawBeeWithTrail(t, 60, 170, 3, 150, 117)
  // tempo corrente, altezza ape, lunghezza corpo, n strisce, parametri iniziali usati dalle funzioni getX/getY per la traiettoria
}

function getX(t, startPosX){
  return t*4 - 150 - startPosX;
  // tempo*n frame(fattore di velocità), offset iniziali per spostare dove comincia movimento
}

function getY(t, startPosY){
  let ty = t;
  let y = 0.0572*startPosY/100*cos(4.667*ty/startPosY*100)+
          0.0218*startPosY/75*cos(12.22*ty/startPosY*20);
  return startPosY*2 + y*500;
  // getY produce un’oscillazione complessa (sovrapposizione di due cos) la cui ampiezza dipende da startPosY
  
}

function drawBeeWithTrail(t, r, len, numStripes, startPosX, startPosY){
  // draw trail con lunghezza limitata e animazione immediata
  let col = color('#795548');
  noStroke();
  let trailLength = 100; // lunghezza della scia in frame

  // parte sempre da t-trailLength, ma mai meno di 0
  for (let i = max(-7, t - trailLength); i < t; i += 10) {
  // opacità proporzionale: se i < 0, alpha minimo 0
  let alphaFactor = (i - max(0, t - trailLength)) / trailLength;
  col.setAlpha(alphaFactor * 255);
  
  fill(col);

  x = getX(i, startPosX);
  y = getY(i, startPosY) + r;

  circle(x, y, max(3, r/10));
}
  
  
  x = getX(t, startPosX);
  y = getY(t, startPosY);
  drawBee(x,y,r,len, numStripes);
  // dimensione minima 3 px, altrimenti proporzionale a r, poi calcola la posizione corrente x,y e chiama drawBee(...) per disegnare l’ape sopra la scia
}

function drawBee(x, y, r, len, numStripes){ //funzione che disegna una singola ape
  push();
  // variables
  let stripeWidth = (len-(2*r)) /(1.5*numStripes);
  //larghezza di ciascuna striscia calcolata basandosi sulla lunghezza del corpo e sul numero di strisce
  let h = r + r;
  // altezza del corpo (2*r), eyeSize e stingerSize dimensionano occhi e pungiglione
  let eyeSize = max(3, r/5);
  let stingerSize = r/2;
  
  // pungiglione
  noStroke();
  fill('#795548')
  triangle(x-stingerSize, y+r, // punta sinistra (dietro)
           x+5, y+r-stingerSize/2, // angolo superiore dx
           x+5, y+r+stingerSize/2) // angolo inferiore dx
  
  // wings
  fill('#EBFDFF')
  stroke('#AABABC')
  strokeWeight(r/10)
  angleMode(DEGREES)
  let wingOriginX = x + len / 2;
  let wingOriginY = y;

  // ala destra (dritta, spostata leggermente a sinistra)
  push();
  translate(wingOriginX + r*0.17, wingOriginY);
  ellipse(0, -r*0.5, r, r*2);
  line(0, 0, 0, -r*1.5); // venatura
  pop();

  // ala sinistra (ruotata 20° verso sinistra)
  push();
  translate(wingOriginX, wingOriginY);
  rotate(-20); // senso orario = verso sinistra
  ellipse(0, -r*0.5, r, r*2);
  line(0, 0, 0, -r*1.5); // venatura
  pop();
  
  // body
  noStroke();
  stroke('#795548')
  fill('#FFEB3B');
  rect(x, y, len, h, r, r); // disegna un rettangolo arrotondato:
  // x, y = posizione del rettangolo
  // len = lunghezza del corpo
  // h = altezza del corpo
  // r, r = raggio degli angoli arrotondati (2 parametri uguali = angoli simmetrici)
  
  // stripes
  noStroke();
  fill('#795548')
  for (let i=0; i< (numStripes*2 - 1); i+=2){
    rect(x+r-20+i*stripeWidth, y, stripeWidth, h )
    // ciclo for:
    // i parte da 0 fino a (numStripes*2 - 1) con step 2 → alternanza strisce/spazi.
    // x + r - 20 + i*stripeWidth → posizione orizzontale di ogni striscia:
    // x + r = inizia subito dopo il bordo sinistro del corpo.
    // -20 = sposta le strisce verso sinistra rispetto al centro.
    // i*stripeWidth = posizione progressiva della striscia successiva.
    // rect(..., y, stripeWidth, h) → disegna ogni rettangolo verticale (striscia) con altezza = corpo.
  }

  // eyes
  fill('#795548')
  noStroke();
  circle(x+len-r, y+r, eyeSize) // primo occhio (sinistra-destra rispetto al corpo)
  circle(x+len-r*0.2, y+r-eyeSize, eyeSize) // secondo occhio, leggermente più in alto e più vicino al bordo destro
  
  // mouth
  noFill()
  stroke('#795548')
  arc(x+len-r*0.8+eyeSize, y+r-eyeSize, r, r, 45, 90);
  // centro dell’arco, r, r = larghezza e altezza dell’arco, angoli iniziale e finale dell’arco in gradi
  pop();
  
}