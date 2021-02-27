<template>
  <div
    class="video_edit_zone"
    @drop="dragToUpload"
    @dragenter.prevent
    @dragleave.prevent
  >
    <div class="file_wrapper">
      <label for="uploadFile">
        <span class="upload"></span>
        <p>Click or drag your video/photo here</p>
      </label>
      <input type="file" id="uploadFile" class="hide" @change="clickToUpload" />
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  name: 'Upload',
  computed: {
    ...mapState(['videoDatas', 'gifDatas'])
  },
  methods: {
    clickToUpload(e) {
      const file = e.target.files[0]
      this.$store.commit('insertVideo', file)
      this.changeRoute()
    },
    dragToUpload(e) {
      const file = e.files || e.dataTransfer.files
      this.fileType = file[0].type

      this.$store.commit('insertVideo', file[0])
      this.changeRoute()
    },
    changeRoute() {
      if (this.videoDatas.url) {
        this.$router.push('/cut')
      }
    }
  },
  created() {
    if (this.videoDatas.url) {
      this.$store.commit('resetState')
    }
  }
}
</script>
<style scoped>
.filter_wrapper {
  position: relative;
  top: 20px;
}
.edit_canvas {
  position: absolute;
  z-index: 998;
}
.upload {
  display: inline-block;
  background-image: url('../assets/add.svg');
  width: 40px;
  height: 40px;
  background-size: cover;
}
</style>
