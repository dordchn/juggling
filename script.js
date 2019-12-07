const T=25; // ms
const VX_0 = -0.12; // unit: px/ms
const VY_0 = -0.48; // unit: px/ms
const G=0.00032; // unit: px/ms^2
const PENDING_TIME = 500; // unit: ms. Has to be multiplication of T!
const PENDING_SHIFT = 60; // pixels
const BALLS_COUNT = 5;

const CYCLE_TIME = 2*(2*Math.abs(VY_0)/G)+2*PENDING_TIME;
const PHASE_TIME = CYCLE_TIME / BALLS_COUNT; // unit: ms

const delay = t => new Promise(resolve => setTimeout(resolve, t));

for (let i=0; i<BALLS_COUNT; i++){
  setTimeout(()=>juggleBall(createBall()), PHASE_TIME*i);
}

function createBall(){
  let ball = document.createElement("div");
  ball.classList.add("ball");
  document.getElementById("container").appendChild(ball);
  return {
    el: ball,
    enabled: false,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0
  };
}

async function juggleBall(ball) {
  ball.enabled = true;
  await throwBall(ball, false);
  await slideBallX(ball, PENDING_SHIFT,PENDING_TIME);
  await throwBall(ball, true);
  await slideBallX(ball, -PENDING_SHIFT,PENDING_TIME);
  if (ball.enabled) {
    juggleBall(ball);
  }
}


function throwBall(ball, reverseDir) {
  ball.vx = reverseDir ? -VX_0 : VX_0;
  ball.vy = VY_0;
  return new Promise((resolve,reject)=>{
    let moveInterval = setInterval(()=>{
      ball.x += ball.vx * T;
      ball.y += ball.vy * T;
      ball.vy += G * T;
      ball.el.style.transform = `translate(${ball.x}px, ${ball.y}px)`;
      if (ball.y + ball.vy * T > 0) { // If the next move cross base
        ball.y=0;
        clearInterval(moveInterval);
        resolve();
      }
    },T);  
  });
}

function slideBallX(ball, slideDistance, time){ // time unit: ms
  ball.vx = slideDistance / time;
  let t = 0; // in ms
  return new Promise((resolve,reject)=>{
    let moveInterval = setInterval(()=>{
      ball.x += ball.vx * T;
      ball.el.style.transform = `translate(${ball.x}px, 0)`;
      t+=T;
      if (t == time) {
        clearInterval(moveInterval);
        resolve();
        return;
      }
    },T);
  });
}