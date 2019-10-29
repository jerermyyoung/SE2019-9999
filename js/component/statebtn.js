import Button from './button'
export default class StateBtn extends Button{ //拓展按钮，bg为['',''],state
  constructor(text, bg, x, y, width, height, color = 'white',state=false) {
    if (state == true) super(text, bg[1], x, y, width, height, color);
    else if (state == false) super(text, bg[0], x, y, width, height, color);
    this.bg=bg;
    this.state=state;
  }

  render(ctx) {
    if (!this.visible)
      return
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
    ctx.fillStyle = 'white'
    ctx.font = '16px Arial';
    let tmpsta = ctx.textAlign;
    if (this.text != '') ctx.textAlign = "center" //文字居中
    ctx.fillStyle = this.color;
    ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2 + 2)
    ctx.textAlign = tmpsta;
    // ctx.draw();
  }

  isTapped(x, y) { //检测是否触发
    if (x > this.x && x < (this.x + this.width) && y > this.y && y < (this.y + this.height)) {
      return true
    }
    return false
  }

  changeState()
  {
    this.state = !this.state;
    if (this.state == true) this.img.src = this.bg[1];
    else if (this.state == false) this.img.src = this.bg[0];
    // console.log(this.img.src);
  }
}