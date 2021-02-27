<template>
  <div class="video_edit_zone">
    <Videowrapper ref="videowrapper">
      <div
        class="cropRect"
        ref="cropRect"
        :style="[
          { '--maskLeft': maskDatas.maskLeft + 'px' },
          { '--maskRight': maskDatas.maskRight + 'px' },
          { '--maskTop': maskDatas.maskTop + 'px' },
          { '--maskBottom': maskDatas.maskBottom + 'px' }
        ]"
      >
        <div class="cover top"></div>
        <div class="cover bottom"></div>
        <div class="cover left"></div>
        <div class="cover right"></div>
        <div
          class="selection"
          ref="selection"
          @mousedown="cropEvent"
          @dragstart="false"
        >
          <div class="crop_control" data-index="1"></div>
          <div class="crop_control" data-index="2"></div>
          <div class="crop_control" data-index="3"></div>
          <div class="crop_control" data-index="4"></div>
          <div class="crop_control" data-index="5"></div>
          <div class="crop_control" data-index="6"></div>
          <div class="crop_control" data-index="7"></div>
          <div class="crop_control" data-index="8"></div>
        </div>
      </div>
    </Videowrapper>
    <Controler :toNext="toNext" :toPrev="toPrev" />
  </div>
</template>
<script>
import { mapState } from 'vuex'
import Videowrapper from '../components/Videowrapper'
import { cropEvent } from '../plugins/cropEvent'
import Controler from '../components/Controler'

export default {
  data() {
    return {
      maskLeft: 0,
      maskRight: 0,
      maskTop: 0,
      maskBottom: 0
    }
  },
  components: {
    Videowrapper,
    Controler
  },
  computed: {
    ...mapState(['videoDatas']),
    maskDatas: {
      get: function () {
        return {
          maskLeft: this.maskLeft,
          maskRight: this.maskRight,
          maskTop: this.maskTop,
          maskBottom: this.maskBottom
        }
      },
      set: function (datas) {
        this.maskLeft = isNaN(datas.maskLeft) ? this.maskLeft : datas.maskLeft
        this.maskRight = isNaN(datas.maskRight)
          ? this.maskRight
          : datas.maskRight
        this.maskTop = isNaN(datas.maskTop) ? this.maskTop : datas.maskTop
        this.maskBottom = isNaN(datas.maskBottom)
          ? this.maskBottom
          : datas.maskBottom
      }
    }
  },
  methods: {
    cropEvent(e) {
      const that = this
      cropEvent(e, this.maskDatas, that)
    },
    toNext: function () {
      // Save mask datas
      this.$store.commit('getSelectionDatas', this.getSelectionDatas())

      this.$router.push('/gifset')
    },
    toPrev: function () {
      // Clear datas
      Object.assign(this.$data, this.$options.data())

      this.$router.push('/cut')
    },
    getSelectionDatas: function () {
      const posX = this.maskLeft
      const posY = this.maskTop
      const width = this.$refs.selection.clientWidth
      const height = this.$refs.selection.clientHeight
      return { posX, posY, width, height }
    }
  }
}
</script>
<style scoped>
.filter_wrapper {
  position: relative;
  top: 20px;
}
</style>
