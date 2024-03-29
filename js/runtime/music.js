import PageBus from '../page/bus'
let pagebus = new PageBus()
let instance
var bgm_dir = ['audio/bgm1.mp3', 'audio/bgm2.mp3', 'audio/bgm3.mp3', 'audio/bgm4.mp3']
/**
 * 统一的音效管理器
 */
export default class Music {
  constructor() {
    if ( instance )
      return instance
    instance = this
    try
    {
      this.bgm = wx.getStorageSync('bgm');//bgm
      this.sound = wx.getStorageSync('sound');//sound
    }catch(e)
    {
      console.log(e);
    }
    this.bgmAudio = new Audio()
    this.bgmAudio.loop = true
    this.bgmAudio.src = bgm_dir[pagebus.world]

    this.shootAudio     = new Audio()
    this.shootAudio.src = 'audio/bullet.mp3'

    this.boomAudio     = new Audio()
    this.boomAudio.src = 'audio/boom.mp3'

    // this.playBgm()
    this.hongzha = new Audio
    this.hongzha.src = 'audio/hongzha.mp3'
  }

  playBgm() {
    if(this.bgm==true)this.bgmAudio.play()
  }
  stopBgm(){
    this.bgmAudio.pause();
  }
  updateBgm() {
    this.bgmAudio.src = bgm_dir[pagebus.world]
    //console.log("change bgm to " + this.bgmAudio.src)
  }

  playShoot() {
    this.shootAudio.currentTime = 0
    if(this.sound==true)this.shootAudio.play()
  }

  playExplosion() {
    this.boomAudio.currentTime = 0
    if (this.sound == true)this.boomAudio.play()
  }
  playhongzha()
  {
    this.hongzha.currentTime = 0
    if (this.sound == true)this.hongzha.play()
  }
  setBgmState(state)//设置bgm
  {
    this.bgm=state;
    if(this.bgm==false)this.bgmAudio.pause();
    console.log(this.bgm)
  }
  setSoundState(state)//设置sound
  {
    this.sound = state;
  }

}
