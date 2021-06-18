let deter;
let counttimes=0;
let startup=1;                    //Initial number of cicles
let choice="sqr";                //sqr, sawtooth,tri
deter=solve(choice,startup);
let reset=startup+1;
let circulo=[];
let theta=0,a,b;
let wave=["oi"];
let wave2=["yo"];
let wl;                     //wave.length
let sizewave=1200;           //size of the array wave
let of=300;                 //Offset para senoide

let theta2=0;
let a2, b2;

function setup() {
  createCanvas(2000, 920);

  for(let i=0;i<deter.r.length;i++){
    circulo[i]=new circ(deter.r[i],deter.v[i]);
  }
}

function draw() {

  background(20);

  let sumy=circulo[0].pos.y;
  let sumx=circulo[0].pos.x;

  circulo[0].update(0);
  circulo[0].disp(350,300);

  for (let i=1;i<circulo.length;i++){

    circulo[i].update();
    circulo[i].disp(circulo[i-1].pos.x,circulo[i-1].pos.y);
    sumy+=circulo[i].pos.y;
    sumx+=circulo[i].pos.x;

  }

  for (let i=1;i<circulo.length;i++){
    translate(-circulo[i-1].pos.x,-circulo[i-1].pos.y);
  }

  stroke(100,200,40);

  wl=wave.length;
  wave.unshift(sumy);
  wave2.unshift(sumx);

  if(wl>=sizewave){
    wave.pop();
    wave2.pop();
  }

  for (let i=2;i<(wl-1);i++){
    curve(of+i-2,wave[i-2],of+i-1,wave[i-1],of+i,wave[i],of+i+1,wave[i+1]);
    curve(wave2[i-2],of+i-2,wave2[i-1],of+i-1,wave2[i],of+i,wave2[i+1],of+i+1,);
  }
}

function circ(r_,v_){

  this.r=r_;
  let v=v_;

  let x=this.r;
  let y=0;
  this.pos=createVector(x,y);

  this.theta=0;


  this.update=function(qual){
    this.theta-=v;
    this.pos.x=this.r*cos(this.theta);
    this.pos.y=this.r*sin(this.theta);

    if(qual==0){
      counttimes++;
      if(counttimes>6.28/deter.v[0]){
        deter=solve(choice,reset);
        counttimes=0;
        console.log(reset);
        reset++;
        for(let i=0;i<deter.r.length;i++){
          circulo[i]=new circ(deter.r[i],deter.v[i]);
        }
      }
    }
  }

  this.disp=function(tx,ty){
    translate(tx,ty);
    noFill();
    stroke(256);
    strokeWeight(1);
    line(0,0,this.pos.x,this.pos.y);
    stroke(256,50);
    circle(0,0,this.r);
  }

}

//Função para determinação dos coeficientes
function solve(type,startup){
  let n=startup;         //Número de parcelas

  let r=[];
  let v=[];

  switch(type){
    case "sqr":
      for(let i=0;i<n;i++){
        r[i]=300/(3.14*(2*i+1));
        v[i]=0.015*(2*i+1);
      }
    break;

    case "sawtooth":
      for(let i=0;i<n;i++){
        r[i]=300/(3.14*(i+1));
        v[i]=0.005*(i+1)*3.14;
      }
    break;

    case "tri":
      for(let i=0;i<n;i++){
        r[i]=150/(((2*i+1)*3.14)^2);
        v[i]=0.005*(2*i+1)*3.14;
      }
    break;

  }

  return {r,v} ;
}
