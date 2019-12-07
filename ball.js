
class Ball {
  constructor(){
    this.el = document.createElement("div");
    this.el.classList.add("ball");
    document.getElementById("container").appendChild(this.el);

    this.isJuggling = false;
    this.params = {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0
    };
  }

  async juggle() {
    this.isJuggling = true;
    await this.throwItUp();
    await this.slideX(PENDING_SHIFT,PENDING_TIME);
    await this.throwItUp(/*reverseDir=*/ true);
    await this.slideX(-PENDING_SHIFT,PENDING_TIME);
    if (this.isJuggling) {
      this.juggle();
    }
  }

  throwItUp(reverseDir = false) {
    this.params.vx = reverseDir ? -VX_0 : VX_0;
    this.params.vy = VY_0;
    return new Promise((resolve,reject)=>{
      let moveInterval = setInterval(()=>{
        this.params.x += this.params.vx * T;
        this.params.y += this.params.vy * T;
        this.params.vy += G * T;
        this.el.style.transform = `translate(${this.params.x}px, ${this.params.y}px)`;
        if (this.params.y + this.params.vy * T > 0) { // If the next move cross base
          this.params.y=0;
          clearInterval(moveInterval);
          resolve();
        }
      },T);  
    });
  }

  slideX(slideDistance, time){ // time unit: ms
    this.params.vx = slideDistance / time;
    let t = 0; // in ms
    return new Promise((resolve,reject)=>{
      let moveInterval = setInterval(()=>{
        this.params.x += this.params.vx * T;
        this.el.style.transform = `translate(${this.params.x}px, 0)`;
        t+=T;
        if (t == time) {
          clearInterval(moveInterval);
          resolve();
          return;
        }
      },T);
    });
  }
}
