import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const getDefaultState = () => {
  return {
    videoDatas: {
      url: '',
      duration: 0,
      startTime: 0,
      endTime: 0,
      atualVideoWidth: 0,
      atualVideoHeight: 0,
      videoHtmlWidth: 0,
      videoHtmlHeight: 0
    },
    selectionDatas: {
      posX: 0,
      posY: 0,
      width: 0,
      height: 0
    },
    fps_list: []
  }
}

const store = new Vuex.Store({
  state: getDefaultState(),
  mutations: {
    resetState (state) {
      Object.assign(state, getDefaultState())
    },
    insertVideo (state, file) {
      const url = URL.createObjectURL(file)
      state.videoDatas.url = url
    },
    setVideoDatas (state, videoElmt) {
      state.videoDatas.duration = videoElmt.duration
      state.videoDatas.atualVideoWidth = videoElmt.videoWidth
      state.videoDatas.atualVideoHeight = videoElmt.videoHeight
      state.videoDatas.videoHtmlWidth = videoElmt.offsetWidth
      state.videoDatas.videoHtmlHeight = videoElmt.offsetHeight
    },
    setSelectedRange (state, datas) {
      state.videoDatas.startTime = datas.startTime
      state.videoDatas.endTime = datas.endTime
    },
    getSelectionDatas (state, datas) {
      state.selectionDatas = datas
    },
    setFPSList (state, img) {
      state.fps_list.push(img)
    },
    clearFPSList (state) {
      state.fps_list = []
    }
  },
  getters: {
    actualVideoPosition: state => {
      // Get the ratio of video's atual width/height and video's CSS width/height
      const widthRatio = state.videoDatas.atualVideoWidth / state.videoDatas.videoHtmlWidth
      const heightRatio = state.videoDatas.atualVideoHeight / state.videoDatas.videoHtmlHeight
      const x = state.selectionDatas.posX * widthRatio
      const y = state.selectionDatas.posY * heightRatio
      const width = state.selectionDatas.width * widthRatio
      const height = state.selectionDatas.height * heightRatio
      return { x, y, width, height }
    }
  }
})
export default store
