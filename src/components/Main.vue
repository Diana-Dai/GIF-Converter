<template>
  <div class="video_edit_zone_container">
    <slot></slot>
  </div>
</template>

<script>
export default {}
</script>
<style>
.video_edit_zone_container {
  height: 460px;
  padding: 20px;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  box-shadow: 0 0 10px 0 rgba(82, 129, 129, 0.363);
}

.video_edit_zone {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  border: 1px dashed var(--border-color);
  border-radius: 4px;
  height: 100%;
}
</style>
