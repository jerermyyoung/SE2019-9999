export default class Timer{
  constructor(tot,text,show,x,y,width,height,color)
  {
    this.delay=100;
    this.freq=1000/this.delay; //每s计数freq次
    this.tot=tot*this.freq;//单位s，表示计数多少次
    this.text=text;
    this.show=show;//表示显示进度条与否
    //进度条显示位置
    this.x=x;
    this.y=y;
    this.width=width;
    this.height=height;
    this.color=color;//进度条显示颜色
    this.cnt=0;//计数器
    this.islive=true;//是否存活
    this.start();//开始计数
  }
  render(ctx)
  {
    if(!this.show)return ;
    var tmp=ctx.fillStyle;
    let tmpsta = ctx.textAlign;
    ctx.fillStyle=this.color;
    ctx.textAlign = "center" //文字居中
    ctx.fillText(this.text,this.x+this.width/2,this.y-10);
    ctx.textAlign = tmpsta;
    ctx.strokeRect(this.x,this.y,this.width,this.height);
    ctx.fillRect(this.x,this.y,this.width*this.cnt/this.tot,this.height);
    ctx.fillStyle=tmp;
  }
  start()
  {
    this.number=setInterval(()=>{
      this.cnt++;
      if(this.cnt==this.tot)
      {
        clearInterval(this.number);
        this.islive=false;//寿命终止
      }
      //console.log(this.cnt);
    },this.delay)
  }
} 