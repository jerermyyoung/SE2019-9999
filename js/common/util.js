
export default class Util {
  
  //point: {x, y},  area: {startX, startY, endX, endY}
  static inArea(point, area){
    return (point.x >= area.startX
      && point.x <= area.endX
      && point.y >= area.startY
      && point.y <= area.endY)
  }

  static findNext(arr, value){
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === value) {
        if(i<arr.length-1) {
          return arr[(i + 1) % arr.length]
        }
        else {
          return arr[i]
        }
      }
    }
    return undefined
  }

  //添加了findLast方法，返回值与findNext刚好相反，且同样【有循环】(即若value已经是第一个，则返回最后一个值)
  static findLast(arr,value){
    for(let i=0;i<arr.length;i++){
      if(arr[i] == value){
        if(i>0) return arr[i-1]
        else return arr[arr.length-1]
      }
    }
    return undefined
  }
  
  static promiseImageLoad(imagePath) {
    let promise = new Promise((resolve, reject) => {
      let img = new Image()
      //setTimeout(()=>{}, 2000) //TEST
      img.onload = () => resolve(img)
      img.onerror = (e) => reject(e)
      img.src = imagePath
    })
    return promise
  }
}