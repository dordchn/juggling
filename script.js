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

async function main(){   
  for (let i=0; i<BALLS_COUNT; i++){
    let ball = new Ball();
    ball.juggle();
    await delay(PHASE_TIME);
  }
}

main();