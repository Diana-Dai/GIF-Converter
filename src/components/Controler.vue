<template>
  <div class="buttons_container">
    <div class="buttons">
      <button @click="toPrev">Prev</button>
      <button @click="toNext">Next</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    toPrev: {
      type: Function
    },
    toNext: {
      type: Function
    }
  }
}
</script>
<style>
.buttons_container {
  position: absolute;
  bottom: -80px;
  margin-top: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
}

.buttons {
  width: 300px;
  display: flex;
  justify-content: space-around;
}
button {
  padding: 10px;
  width: 120px;
  color: #fff;
  background-color: var(--border-color);
  font-size: 14px;
  font-family: 'Poppins', sans-serif;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: 0.5s linear;
}

button:hover {
  background-color: var(--hover-color);
}

.waiting {
  animation: waiting 1s linear infinite;
}

@keyframes waiting {
  0% {
    background-color: var(--border-color);
  }
  100% {
    background-color: var(--hover-color);
  }
}
</style>
