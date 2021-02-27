<template>
  <div class="progress_wrapper">
    <div class="progress_container">
      <div class="progress_line" :style="{ width: lineWidth }"></div>
      <div class="progress_steps">
        <div class="progress_step active">
          1<span class="tip">Upload video</span>
        </div>
        <div class="progress_step" :class="{ active: index >= 1 }">
          2 <span class="tip">Cut video </span>
        </div>
        <div class="progress_step" :class="{ active: index >= 2 }">
          3
          <span class="tip">Crop video</span>
        </div>
        <div class="progress_step" :class="{ active: index >= 3 }">
          4
          <span class="tip">Set GIF</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      index: 0
    }
  },
  computed: {
    lineWidth: function () {
      return this.index * 33.3 + '%'
    }
  },
  watch: {
    // When the route path changes, the process line also changes
    $route: 'handler'
  },
  methods: {
    handler() {
      const routes = ['/upload', '/cut', '/crop', '/gifset']
      const path = this.$route.path
      this.index = routes.indexOf(path)
    }
  }
}
</script>
<style>
.progress_wrapper {
  margin: 40px 0;
  padding: 0 60px;
}
.progress_container {
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.progress_steps {
  display: flex;
  justify-content: space-between;
  width: 100%;
  flex-direction: row;
}

.progress_steps::before {
  content: '';
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  height: 3px;
  background-color: var(--border-empty);
  z-index: -1;
}

.progress_line {
  position: absolute;
  left: 0;
  width: 0;
  height: 3px;
  transition: width 0.5s ease-in-out;
  background-color: var(--border-color);
}

.progress_step {
  position: relative;
  width: 30px;
  height: 30px;
  color: var(--border-color);
  background-color: #fff;
  box-sizing: border-box;
  border: 3px solid var(--border-empty);
  border-radius: 50%;
  transition: 0.5s ease-in-out;
  z-index: 999;
}
.progress_step .tip {
  opacity: 0;
}
.progress_step.active {
  border-color: var(--border-color);
}

.progress_step.active .tip {
  opacity: 1;
  font-size: 14px;
  white-space: nowrap;
  position: absolute;
  margin-left: -40px;
  margin-top: 30px;
}
</style>
