let instance

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
    this.bgmAudio.src  = 'audio/bgm.mp3'

    this.shootAudio     = new Audio()
    this.shootAudio.src = 'audio/bullet.mp3'

    this.boomAudio     = new Audio()
    this.boomAudio.src = 'audio/boom.mp3'

    // this.playBgm()
  }

  playBgm() {
    if(this.bgm==true)this.bgmAudio.play()
  }

  playShoot() {
    this.shootAudio.currentTime = 0
    if(this.sound==true)this.shootAudio.play()
  }

  playExplosion() {
    this.boomAudio.currentTime = 0
    if (this.sound == true)this.boomAudio.play()
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
