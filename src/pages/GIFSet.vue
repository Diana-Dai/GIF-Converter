<template>
  <div class="video_edit_zone">
    <div id="loader" v-if="isLoading">
      <div id="status"></div>
    </div>
    <!-- <div class="gif_generator"> -->
    <div class="gif_generator" :class="{ hide: hideGenerator }">
      <div class="wrapper">
        <canvas ref="canvas" class="hide"></canvas>
        <!-- <canvas ref="canvas"></canvas> -->
        <div>
          <!-- <Videowrapper ref="video_wrapper"></Videowrapper> -->
          <Videowrapper ref="video_wrapper" class="hide"></Videowrapper>
        </div>
        <div class="form_wrapper">
          <div class="form_lists">
            <div class="form_list">
              <label class="name">Quality:</label>
              <div class="items">
                <input
                  type="radio"
                  id="option1"
                  name="size_option"
                  value="high"
                  v-model="quality"
                />
                <label for="option1">High</label>
                <input
                  type="radio"
                  id="option2"
                  name="size_option"
                  value="medium"
                  v-model="quality"
                />
                <label for="option2">Medium</label>
                <input
                  type="radio"
                  id="option3"
                  name="size_option"
                  value="low"
                  v-model="quality"
                />
                <label for="option3">Low</label>
              </div>
            </div>
            <div class="form_list">
              <label for="text" class="name"> Text: </label>
              <input
                id="text"
                type="text"
                name="text"
                v-model="text"
                class="input"
              />
            </div>
            <div class="form_list">
              <label for="font_size" class="name"> Font size: </label>
              <input
                id="font_size"
                type="number"
                min="14"
                max="30"
                v-model="fontSize"
                class="input"
              />
            </div>
          </div>
        </div>
      </div>
      <Controler :toNext="playvideo" :toPrev="toPrev" />
    </div>
    <div class="gif_container" v-show="GIFisReady"></div>
    <div class="buttons_container" v-show="hideGenerator">
      <div class="buttons">
        <button @click="back">Back</button>
        <button v-show="this.GIF">
          <a
            download
            :href="this.GIF"
            style="color: #fff; margin-left: 15px"
            class="save_gif"
            >Save</a
          >
        </button>
        <!-- <p class="file_size" style="font-size: 12px"></p> -->
      </div>
    </div>
  </div>
</template>

<script>
import Videowrapper from '../components/Videowrapper'
import { mapState, mapGetters } from 'vuex'
import Controler from '../components/Controler'
import { imgGenerator } from '../plugins/imgGenerator'
/* eslint-disable */

export default {
  data() {
    return {
      quality: 'medium',
      className: '',
      text: '',
      fontSize: '25',
      GIF: '',
      isLoading: false,
      hideGenerator: false,
      GIFisReady: false
    }
  },
  components: {
    Videowrapper,
    Controler
  },
  computed: {
    ...mapState(['selectionDatas', 'videoDatas', 'fps_list']),
    ...mapGetters(['actualVideoPosition']),
    GIFQuality: function () {
      if (this.quality === 'low') {
        return 400
      } else if (this.quality === 'medium') {
        return 250
      } else {
        return 100
      }
    }
  },
  methods: {
    playvideo: function () {
      this.isLoading = true
      this.hideGenerator = true

      const videoElmt = this.$refs.video_wrapper.$refs.video
      const [startTime, endTime] = [
        this.videoDatas.startTime,
        this.videoDatas.endTime
      ]

      videoElmt.currentTime = startTime
      videoElmt.play()

      this.$store.commit('clearFPSList')

      // Start to draw the img of the video
      imgGenerator(this)

      const videoControler = setInterval(() => {
        if (Math.floor(videoElmt.currentTime) >= Math.floor(endTime)) {
          videoElmt.pause()

          this.generateGIF()

          clearInterval(videoControler)
        }
      }, 500)
    },
    generateGIF: function () {
      const existedImage = document.querySelector('.animated_image')

      const that = this

      if (this.fps_list.length <= 0) {
        alert("There's no video duration selected")
      }

      gifshot.createGIF(
        {
          images: this.fps_list.slice(1),
          text: this.text,
          textAlign: 'center',
          textBaseline: 'bottom',
          fontSize: `${this.fontSize}px`
        },
        function (obj) {
          if (!obj.error) {
            const animatedImage = document.createElement('img')
            const image = obj.image
            that.GIF = image
            animatedImage.className = 'animated_image'
            animatedImage.src = image

            // Check if there's an existed GIF
            if (existedImage) {
              existedImage.parentNode.removeChild(existedImage)
            }

            that.isLoading = false
            that.GIFisReady = true

            const container = document.querySelector('.gif_container')
            container.appendChild(animatedImage)

            // Set file size
            that.setGIFSize(image, container)
          }
        }
      )
    },
    setGIFSize: function (image, node) {
      fetch(image)
        .then(function (res) {
          return res.blob()
        })
        .then(function (data) {
          // Delete the file size node existed
          const existedNode = document.querySelector('.file_size')
          if (existedNode) {
            existedNode.parentNode.removeChild(existedNode)
          }

          node.insertAdjacentHTML(
            'beforeEnd',
            `<p class="file_size" style="font-size: 12px">File size: ${parseInt(
              data.size / 1000
            )} KB</p>`
          )
        })
    },
    back: function () {
      this.hideGenerator = false
      this.GIFisReady = false
      this.isLoading = false
    },
    toPrev: function () {
      // Clear datas
      Object.assign(this.$data, this.$options.data())

      this.$router.push('/crop')
    }
  }
}
</script>

<style scoped>
.gif_generator {
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}
.hide {
  opacity: 0;
  position: absolute;
  z-index: -1;
}
canvas {
  position: absolute;
  z-index: 999;
}
.form_wrapper {
  width: 600px;
}
.form_lists {
  margin: 0 24%;
}

.form_list {
  margin-top: 20px;
  text-align: start;
}
.form_list .name {
  float: left;
  width: 80px;
}
.text,
.items {
  display: table-cell;
  white-space: nowrap;
}

#status {
  width: 100px;
  height: 100px;
  background-image: url(https://raw.githubusercontent.com/niklausgerber/PreLoadMe/master/img/status.gif);
  background-repeat: no-repeat;
  background-position: center;
}
.save_gif::before {
  content: '';
  background-image: url('../assets/save.svg');
  width: 30px;
  height: 30px;
  background-size: cover;
  position: absolute;
  margin-left: -28px;
  margin-top: -5px;
}
</style>
