<template>
  <div class="video_wrapper">
    <div class="work_area">
      <video ref="video" loop :src="videoDatas.url" @canplay="setVideoDatas">
        Your browser can't support HTML5 Video
      </video>
      <slot></slot>
    </div>
    <div class="delete" @click="toUploadPage"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState(['videoDatas'])
  },
  methods: {
    toUploadPage() {
      this.$router.push('/upload')
    },
    setVideoDatas() {
      if (!this.videoDatas.duration) {
        this.$store.commit('setVideoDatas', this.$refs.video)
      }
    }
  },
  created() {
    if (!this.videoDatas.url) {
      alert('Failed to upload video')
      this.toUploadPage()
    }
  }
}
</script>

<style scoped>
.video_wrapper {
  font-size: 0;
  width: 70%;
}
.cover {
  position: absolute;
  background-color: rgba(44, 44, 44, 0.8);
}
.cover.top {
  height: var(--maskTop);
  top: 0;
  left: var(--maskLeft);
  right: 0;
}
.cover.bottom {
  height: var(--maskBottom);
  bottom: 0;
  right: var(--maskRight);
  left: 0;
}
.cover.left {
  width: var(--maskLeft);
  left: 0;
  top: 0;
  bottom: var(--maskBottom);
}
.cover.right {
  width: var(--maskRight);
  right: 0;
  top: var(--maskTop);
  bottom: 0;
}
.delete {
  position: absolute;
  right: 12px;
  top: -10px;
  cursor: pointer;
  z-index: 999;
}
.delete::after {
  content: '';
  position: absolute;
  background-image: url('../assets/delete.svg');
  width: 30px;
  height: 30px;
  background-size: cover;
}

video {
  width: 100%;
}
.work_area {
  position: relative;
}

.cropRect {
  width: 100%;
  height: 100%;
}

.selection {
  inset: 0;
  top: var(--maskTop);
  left: var(--maskLeft);
  right: var(--maskRight);
  bottom: var(--maskBottom);
}

.cropRect {
  position: absolute;
  top: 0;
}

.selection {
  position: absolute;
  box-sizing: border-box;
  background-size: 33.3% 33.3%;
  background-image: linear-gradient(
      90deg,
      rgba(0, 224, 255, 0.5) 1px,
      transparent 0
    ),
    linear-gradient(180deg, rgba(0, 224, 255, 0.5) 1px, transparent 0);
  border: 1px solid #00e0ff;
}

.crop_control {
  position: absolute;
  transform: translate(-50%, -50%);
  width: 16px;
  height: 16px;
  background-color: transparent;
}

.crop_control:after {
  position: absolute;
  top: 50%;
  content: '';
  box-sizing: border-box;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  border: 1px solid #00e0ff;
  border-radius: 2px;
  background-color: #fff;
}

.crop_control:hover:after {
  background-color: #00e0ff;
  width: 10px;
  height: 10px;
}

.crop_control[data-index='1'] {
  left: 0;
  top: 0;
  cursor: nwse-resize;
}
.crop_control[data-index='1'] {
  left: 0;
  top: 0;
  cursor: nwse-resize;
}
.crop_control[data-index='2'] {
  left: 50%;
  top: 0;
  cursor: ns-resize;
}
.crop_control[data-index='3'] {
  left: 100%;
  top: 0;
  cursor: nesw-resize;
}
.crop_control[data-index='4'] {
  left: 100%;
  top: 50%;
  cursor: ew-resize;
}
.crop_control[data-index='5'] {
  left: 100%;
  top: 100%;
  cursor: nwse-resize;
}
.crop_control[data-index='6'] {
  left: 50%;
  top: 100%;
  cursor: ns-resize;
}
.crop_control[data-index='7'] {
  left: 0;
  top: 100%;
  cursor: nesw-resize;
}
.crop_control[data-index='8'] {
  left: 0;
  top: 50%;
  cursor: ew-resize;
}
</style>
