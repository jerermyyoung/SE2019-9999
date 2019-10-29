export default class Button {
  constructor(text, bg, x, y, width, height,color = 'white') {
    this.img = new Image()
    this.img.src = bg
    this.text = text
    this.x = x
    this.y = y
    this.height = height
    this.width = width
    this.color = color;
    this.visible = true
  }

  render(ctx) {
    if (!this.visible)
      return
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
    ctx.fillStyle='white'
    ctx.font = '16px Arial';
    let tmpsta = ctx.textAlign;
    if(this.text!='')ctx.textAlign="center" //文字居中
    ctx.fillStyle = this.color;
    ctx.fillText(this.text, this.x+this.width/2, this.y+this.height/2+2)
    ctx.textAlign=tmpsta;
    // ctx.draw();
  }

  isTapped(x, y) { //检测是否触发
    if (x > this.x && x < (this.x + this.width) && y > this.y && y < (this.y + this.height)) {
      return true
    }
    return false
  }
}