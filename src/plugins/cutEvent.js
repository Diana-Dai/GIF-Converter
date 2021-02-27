
const CutEvent = function (e, sliderDatas, vm) {
  this.e = e
  this.vm = vm
  this.totalWidth = vm.totalWidth
  this.sliderDatas = sliderDatas
  this.startX = e.clientX
  this.startY = e.clientY

  this.init()
}

CutEvent.prototype = {
  constructor: CutEvent,
  init: function () {
    this.getEventTarget()
    const that = this
    let mouseMove
    if (this.targetName === 'slider_button_left') {
      mouseMove = this.moveLeftSlider(that)
    } else if (this.targetName === 'slider_button_right') {
      mouseMove = this.moveRightSlider(that)
    }
    this.setEventHandler(mouseMove)
  },
  moveRightSlider: function (that) {
    return function (e) {
      const moveX = that.startX - e.clientX
      //   debugger
      // Update mask datas
      let rightMoveDistance = that.sliderDatas.rightMoveDistance + moveX
      const result = that.checkSliderPosX(rightMoveDistance)

      // if the slider is out of the control area, stop the mouse move event
      if (!result) {
        return
      }
      that.vm.sliderDatas = { rightMoveDistance }
    }
  },
  moveLeftSlider: function (that) {
    return function (e) {
      const moveX = that.startX - e.clientX

      // Update mask datas
      let leftMoveDistance = that.sliderDatas.leftMoveDistance - moveX
      const result = that.checkSliderPosX(leftMoveDistance)

      // if the slider is out of the control area, stop the mouse move event
      if (!result) {
        return
      }
      that.vm.sliderDatas = { leftMoveDistance }
    }
  },
  checkSliderPosX (data) {
    if (data < 0 || data > this.totalWidth) {
      return false
    }
    if (this.targetName === 'slider_button_right') {
      if (data + this.sliderDatas.leftMoveDistance >= this.totalWidth) {
        return false
      }
    } else {
      if (data + this.sliderDatas.rightMoveDistance >= this.totalWidth) {
        return false
      }
    }
    return true
  },

  getEventTarget: function () {
    const classNameList = this.e.target.className.split(' ')

    this.targetName = classNameList[0]
  },
  setEventHandler(mouseMove) {
    document.addEventListener('mousemove', mouseMove)
    document.addEventListener('mouseup', function () {
      document.removeEventListener('mousemove', mouseMove)
      document.onmouseup = null
    })
  }
}
function cutEvent(e, datas, func) {
  return new CutEvent(e, datas, func)
}
export {
  cutEvent
}
