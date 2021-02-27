<template>
  <div class="video_edit_zone">
    <videowrapper ref="video_wrapper"> </videowrapper>
    <div class="control_video" ref="container">
      <div
        class="process_line"
        :style="{
          left: `${leftMoveDistanceRate * 100}%`,
          width: `${processLineWidth}px`
        }"
      ></div>
      <div class="play_circle" :style="{ left: `${circlePos}%` }"></div>
      <div
        class="slider_button_left"
        @dragstart="false"
        @mousedown.stop="cutEvent"
        :style="{ left: `${leftMoveDistanceRate * 100}%` }"
        :data-time="startTagString"
      ></div>
      <div
        class="slider_button_right"
        @dragstart="false"
        @mousedown.stop="cutEvent"
        :style="{ right: `${rightMoveDistanceRate * 100}%` }"
        :data-time="endTagString"
      ></div>
    </div>
    <div class="play_container">
      <div class="play">
        <div class="logo" @click.prevent="playVideoEvent"></div>
      </div>
      <div
        class="selected_range"
        :data-start="startTagString"
        :data-end="endTagString"
      >
        -
      </div>
    </div>
    <Controler :toNext="toNext" :toPrev="toPrev" />
  </div>
</template>

<script>
import Videowrapper from '../components/Videowrapper'
import { mapState } from 'vuex'
import Controler from '../components/Controler'
import { cutEvent } from '../plugins/cutEvent'

export default {
  data() {
    return {
      leftMoveDistance: 0,
      rightMoveDistance: 0,
      currentTime: 0,
      totalWidth: 0
    }
  },
  components: {
    Videowrapper,
    Controler
  },
  computed: {
    ...mapState(['sliderDatas', 'videoDatas']),
    circlePos: function () {
      return (this.currentTime / this.videoDatas.duration) * 100
    },
    startTime: function () {
      const startTime =
        this.leftMoveDistanceRate * this.videoDatas.duration
          ? this.leftMoveDistanceRate * this.videoDatas.duration
          : 0

      return startTime
    },
    endTime: function () {
      const endTime =
        (1 - this.rightMoveDistanceRate) * this.videoDatas.duration
      return endTime
    },
    currentTimeString: function () {
      return this.transformSecondsToString(this.currentTime)
    },
    startTagString: function () {
      return this.transformSecondsToString(this.startTime)
    },
    endTagString: function () {
      return this.transformSecondsToString(this.endTime)
    },
    processLineWidth: function () {
      return this.totalWidth - this.leftMoveDistance - this.rightMoveDistance
    },
    leftMoveDistanceRate: function () {
      return this.leftMoveDistance / this.totalWidth
    },
    rightMoveDistanceRate: function () {
      if (this.rightMoveDistance) {
        return this.rightMoveDistance / this.totalWidth
      }
      return 0
    },
    sliderDatas: {
      get: function () {
        return {
          leftMoveDistance: this.leftMoveDistance,
          rightMoveDistance: this.rightMoveDistance
        }
      },
      set: function (datas) {
        this.leftMoveDistance = isNaN(datas.leftMoveDistance)
          ? this.leftMoveDistance
          : datas.leftMoveDistance
        this.rightMoveDistance = isNaN(datas.rightMoveDistance)
          ? this.rightMoveDistance
          : datas.rightMoveDistance
      }
    }
  },
  methods: {
    cutEvent(e) {
      const that = this
      cutEvent(e, this.sliderDatas, that)
    },
    playVideoEvent: function (e) {
      const videoElmt = this.$refs.video_wrapper.$refs.video
      e.target.classList.toggle('pause')
      if (videoElmt.paused || videoElmt.ended) {
        this.playVideo()
      } else {
        videoElmt.pause()
      }
    },
    playVideo: function () {
      const videoElmt = this.$refs.video_wrapper.$refs.video
      videoElmt.currentTime = this.startTime
      videoElmt.play()
      const that = this
      const interval = setInterval(() => {
        // Save the current time of video
        that.currentTime = videoElmt.currentTime

        // Stop the video when it's passed the end time
        if (Math.floor(that.currentTime) >= Math.floor(that.endTime)) {
          videoElmt.pause()
          clearInterval(interval)
          document.querySelector('.logo').classList.remove('pause')
          that.currentTime = that.startTime
        }

        // Stop the interval when video is stopped
        if (videoElmt.paused || videoElmt.ended) {
          clearInterval(interval)
        }
      }, 500)
    },
    addSliderPadding: function () {
      if (document.querySelector('.slider_button_right')) {
        const rightSlider = document.querySelector('.slider_button_right')
        const leftSlider = document.querySelector('.slider_button_left')
        if (
          this.rightMoveDistance + this.leftMoveDistance >
          this.totalWidth - 50
        ) {
          rightSlider.classList.add('padding_left')
          leftSlider.classList.add('padding_right')
        } else {
          rightSlider.classList.remove('padding_left')
          leftSlider.classList.remove('padding_right')
        }
      }
    },
    transformSecondsToString: function (time) {
      const startHour = parseInt(time / 3600, 10) + ''
      const startMinute = parseInt((time % 3600) / 60) + ''
      const startSecond = parseInt((time % 3600) % 60) + ''

      const startTimeString =
        startHour.padStart(2, '0') +
        ':' +
        startMinute.padStart(2, '0') +
        ':' +
        startSecond.padStart(2, '0')
      return startTimeString
    },
    setTotalWidth: function () {
      this.totalWidth = this.$refs.container.clientWidth
    },
    toNext: function () {
      // Save the selected range datas
      const startTime = this.startTime
      const endTime = this.endTime
      this.$store.commit('setSelectedRange', { startTime, endTime })

      this.$router.push('/crop')
    },
    toPrev: function () {
      // Clear datas
      Object.assign(this.$data, this.$options.data())

      this.$router.push('/upload')
    }
  },
  watch: {
    startTime: function () {
      this.currentTime = this.startTime
      this.$refs.video_wrapper.$refs.video.currentTime = this.startTime
    },
    leftMoveDistance: function () {
      this.addSliderPadding()
    },
    rightMoveDistance: function () {
      this.addSliderPadding()
    }
  },
  mounted() {
    const that = this
    window.onresize = that.setTotalWidth
    this.setTotalWidth()
    this.videoDuration = this.$refs.video_wrapper.$refs.video.duration
  },
  activated() {
    this.setTotalWidth()
  }
}
</script>

<style scoped>
.control_video {
  position: relative;
  margin: 28px 0 35px 0;
  width: 90%;
  height: 2px;
  background-color: rgb(156, 153, 153);
}

.control_video .process_line {
  position: absolute;
  width: 100%;
  height: 2px;
  background-color: var(--cut-color);
}

.slider_button_left,
.slider_button_right {
  user-select: none;
  position: absolute;
  top: 2px;
  cursor: pointer;
}

.slider_button_right {
  transform: translateX(-50%);
}

.slider_button_left::before,
.slider_button_right::before {
  content: '';
  background-image: url('../assets/Arrow.svg');
  position: absolute;
  top: 5px;
  width: 25px;
  height: 25px;
  transform: translateX(-50%);
  background-repeat: no-repeat;
  background-size: cover;
}
.slider_button_left::after,
.slider_button_right::after {
  content: attr(data-time);
  position: absolute;
  bottom: 5px;
  transform: translate(-50%);
  color: var(--cut-color);
  font-size: 12px;
  transition: 0.3s linear;
}
.padding_left::after {
  padding-left: 40px;
}
.padding_right::after {
  padding-right: 20px;
}
.time {
  position: absolute;
  margin-top: 30px;
  margin-left: -30px;
  font-size: 12px;
}
.play_circle {
  position: absolute;
}
.play_circle::before {
  content: '';
  position: absolute;
  top: -5px;
  transform: translateX(-50%);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid var(--cut-color);
  cursor: pointer;
  background: white;
}

.play_container {
  left: 30px;
  top: 5px;
  position: relative;
}

.play {
  position: absolute;
  display: table-cell;
  margin-left: -150px;
  margin-top: -4px;
  padding: 10px;
  border: 1px solid;
  border-radius: 50%;
  background-color: white;
}
.play .logo {
  box-sizing: border-box;
  height: 16px;
  border-style: solid;
  border-width: 8px 0 8px 16px;
  border-color: transparent transparent transparent black;
  transition: all 0.5s ease;
  transform-origin: center;
}

.play .pause {
  border-style: double;
  border-width: 0px 0px 0px 16px;
}

.selected_range {
  display: table-cell;
  position: relative;
}

.selected_range::before {
  content: attr(data-start);
  position: absolute;
  position: absolute;
  right: 20px;
  border: 1px solid;
  padding: 3px 8px;
  border-radius: 15px;
}
.selected_range::after {
  content: attr(data-end);
  position: absolute;
  position: absolute;
  left: 20px;
  border: 1px solid;
  padding: 3px 8px;
  border-radius: 15px;
}
</style>
