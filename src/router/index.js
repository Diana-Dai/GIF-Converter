import Vue from 'vue'
import VueRouter from 'vue-router'

import Upload from '../pages/Upload.vue'
import Cut from '../pages/Cut.vue'
import Crop from '../pages/Crop.vue'
import GIFSet from '../pages/GIFSet.vue'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [{
    path: '/',
    redirect: '/upload'
  },
  {
    path: '/upload',
    component: Upload
  },
  {
    path: '/cut',
    component: Cut
  },
  {
    path: '/Crop',
    component: Crop
  },
  {
    path: '/gifset',
    component: GIFSet
  }

  ]
})
