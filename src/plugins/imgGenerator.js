const ImgGenerator = function (vm) {
  this.vm = vm
  this.canvas = vm.$refs.canvas
  this.ctx = this.canvas.getContext('2d')
  this.video = vm.$refs.video_wrapper.$refs.video
  this.time = vm.GIFQuality
  this.videoDatas = vm.actualVideoPosition
  this.selectionDatas = vm.selectionDatas

  this.setCanvas()
  this.checkBrowser()
  this.init()
}

ImgGenerator.prototype = {
  setCanvas: function () {
    this.canvas.width = this.selectionDatas.width
    this.canvas.height = this.selectionDatas.height
  },
  init: function () {
    if (this.video.currentTime > 0) {
      this.drawImg()

      this.generateFPS()

      if (!this.video.ended && !this.video.paused) {
        // Set time out to generate images
        setTimeout(() => {
          this.init()
        }, this.time)
      }
    } else {
      // If the video is not playing, waiting 10ms and try again
      setTimeout(() => {
        this.init()
      }, 10)
    }
  },
  drawImg: function () {
    if (this.video.ended) return false
    this.ctx.drawImage(
      this.video,
      this.videoDatas.x,
      this.videoDatas.y,
      this.videoDatas.width,
      this.videoDatas.height,
      0,
      0,
      this.selectionDatas.width,
      this.selectionDatas.height
    )
  },
  generateFPS: function () {
    const timeStamp = Math.floor(this.video.currentTime)
    const img = document.createElement('img')
    img.src = this.canvas.toDataURL()
    img.time = timeStamp
    img.width = this.selectionDatas.width
    img.height = this.selectionDatas.height

    this.vm.$store.commit('setFPSList', img)
  },
  checkBrowser: function () {
    var isFirefox = typeof InstallTrigger !== 'undefined'
    if (isFirefox) {
      this.ctx.translate(this.selectionDatas.width, this.selectionDatas.height)
      this.ctx.scale(-1, -1)
    }
  }
}

function imgGenerator (vm) {
  return new ImgGenerator(vm)
}
export {
  imgGenerator
}
