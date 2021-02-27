<template>
  <div class="container" id="app">
    <Progress />
    <Main>
      <keep-alive exclude="Upload">
        <router-view></router-view>
      </keep-alive>
    </Main>
  </div>
</template>

<script>
import Progress from './components/Progress.vue'
import Main from './components/Main.vue'

export default {
  name: 'App',
  components: {
    Progress,
    Main
  }
}
</script>
<style>
#app {
  margin: 0 15%;
  height: 100%;
}
@media (max-width: 768px) {
  #app {
    margin: 0 5%;
  }
}
</style>
