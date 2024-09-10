<template>
  <div class="parent">
    <div class="div1"> test</div>
    <div class="div2">tes2 </div>
    <div class="div3"> test3</div>
    <div class="div4"> test4</div>
  </div>
</template>

<script lang="ts">

</script>

<style scoped>
.parent {
  display: grid;
  grid-template-columns: 0.2fr 1fr 0.5fr 1fr 0.2fr;
  grid-template-rows: 0.2fr 3fr 0.2fr 0.5fr 0.2fr;
  grid-column-gap: 0px;
  grid-row-gap: 0px;
}

.div1 { grid-area: 2 / 2 / 3 / 3; }
.div2 { grid-area: 2 / 4 / 3 / 5; }
.div3 { grid-area: 4 / 2 / 5 / 3; }
.div4 { grid-area: 4 / 4 / 5 / 5; }

</style>