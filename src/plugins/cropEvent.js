const CropEvent = function (e, maskDatas, vm) {
  this.e = e
  this.vm = vm
  this.startMask = maskDatas
  this.startX = e.clientX
  this.startY = e.clientY

  this.init()
}

CropEvent.prototype = {
  constructor: CropEvent,
  init: function () {
    // debugger
    this.getSelectionRatio()
    this.getEventTarget()
    let mouseMove

    const that = this
    if (this.targetName === 'crop_control1' ||
      this.targetName === 'crop_control3' ||
      this.targetName === 'crop_control5' ||
      this.targetName === 'crop_control7') {
      mouseMove = this.mouseMoveXY(that)
    } else if (this.targetName === 'crop_control2' ||
      this.targetName === 'crop_control6') {
      mouseMove = this.mouseMoveY(that)
    } else if (this.targetName === 'crop_control4' ||
    this.targetName === 'crop_control8') {
      mouseMove = this.mouseMoveX(that)
    } else {
      mouseMove = this.mouseMove(that)
    }

    this.setEventHandler(mouseMove)
  },
  mouseMove: function (that) {
    return function (e) {
      const moveX = e.clientX - that.startX
      const moveY = e.clientY - that.startY

      // Update mask datas
      const res = mouseMoveUtils[that.targetName](that, moveX, moveY)
      that.vm.maskDatas = res
    }
  },
  mouseMoveXY: function (that) {
    return function (e) {
      const moveX = that.startX - e.clientX
      const moveY = (that.width + moveX) * that.height / that.width - that.height

      // Update mask datas
      const res = mouseMoveUtils[that.targetName](that, moveX, moveY)
      that.vm.maskDatas = res
    }
  },
  mouseMoveY: function (that) {
    return function (e) {
      const moveY = that.startY - e.clientY

      // Update mask datas
      const res = mouseMoveUtils[that.targetName](that, moveY)
      that.vm.maskDatas = res
    }
  },
  mouseMoveX: function (that) {
    return function (e) {
      const moveX = that.startX - e.clientX

      // Update mask datas
      const res = mouseMoveUtils[that.targetName](that, moveX)
      that.vm.maskDatas = res
    }
  },
  setEventHandler(mouseMove) {
    document.addEventListener('mousemove', mouseMove)
    document.addEventListener('mouseup', function () {
      document.removeEventListener('mousemove', mouseMove)
      document.onmouseup = null
    })
  },
  getSelectionRatio: function () {
    const width = this.vm.$refs.selection.offsetWidth
    const height = this.vm.$refs.selection.offsetHeight
    if (width && height) {
      this.width = width
      this.height = height
    }
  },
  getEventTarget: function () {
    const className = this.e.target.className
    const index = this.e.target.getAttribute('data-index') === null ? '' : this.e.target.getAttribute('data-index')
    this.targetName = className + index
  }
}

function cropEvent(e, mask, func) {
  return new CropEvent(e, mask, func)
}

const mouseMoveUtils = {
  selection: function (that, moveX, moveY) {
    const totalXDistance = that.startMask.maskLeft + that.startMask.maskRight
    const totalYDistance = that.startMask.maskTop + that.startMask.maskBottom

    // maskLeft = that.startMask.maskLeft + moveX
    const [maskLeft, maskRight] = this.getDatas(that.startMask.maskLeft + moveX, totalXDistance)

    // maskTop = that.startMask.maskTop + moveY
    const [maskTop, maskBottom] = this.getDatas(that.startMask.maskTop + moveY, totalYDistance)

    let res = this.checkNum({ maskLeft, maskRight, maskTop, maskBottom })
    return res
  },
  crop_control1: function (that, moveX, moveY) {
    let maskLeft = that.startMask.maskLeft - moveX
    let maskTop = that.startMask.maskTop - moveY
    let res = this.checkNum({ maskLeft, maskTop })
    return res
  },
  crop_control3: function (that, moveX, moveY) {
    let maskRight = moveX + that.startMask.maskRight
    let maskTop = moveY + that.startMask.maskTop
    let res = this.checkNum({ maskRight, maskTop })
    return res
  },
  crop_control5: function (that, moveX, moveY) {
    let maskRight = moveX + that.startMask.maskRight
    let maskBottom = moveY + that.startMask.maskBottom
    let res = this.checkNum({ maskRight, maskBottom })
    return res
  },
  crop_control7: function (that, moveX, moveY) {
    let maskLeft = that.startMask.maskLeft - moveX
    let maskBottom = that.startMask.maskBottom - moveY
    let res = this.checkNum({ maskLeft, maskBottom })
    return res
  },
  crop_control2: function (that, moveY) {
    let maskTop = that.startMask.maskTop - moveY
    let res = this.checkNum({ maskTop })
    return res
  },
  crop_control6: function (that, moveY) {
    let maskBottom = moveY + that.startMask.maskBottom
    let res = this.checkNum({ maskBottom })
    return res
  },
  crop_control4: function (that, moveX) {
    let maskRight = moveX + that.startMask.maskRight
    let res = this.checkNum({ maskRight })
    return res
  },
  crop_control8: function (that, moveX) {
    let maskLeft = that.startMask.maskLeft - moveX
    let res = this.checkNum({ maskLeft })
    return res
  },
  getDatas(x, max) {
    if (x < 0) {
      return [0, max]
    } else if (x > max) {
      return [max, 0]
    } else {
      return [x, max - x]
    }
  },
  checkNum (res) {
    for (const item in res) {
      if (item === 'maskLeft' || item === 'maskRight') {
        res[item] = this._checkMaxAndMin(res[item], this.width)
      } else {
        res[item] = this._checkMaxAndMin(res[item], this.height)
      }
    }
    return res
  },
  _checkMaxAndMin (x, max) {
    if (x < 1 || x > max) {
      if (x < 1) {
        x = 0
      } else {
        x = max
      }
    }
    return x
  }
}

export {
  cropEvent
}
