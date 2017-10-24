<template>
  <petty-scroll>
    <div style="height: 300px" id="dadada">
      <div style="height: 500px;background-color: greenyellow;text-align: center;">

      </div>
    </div>
  </petty-scroll>
</template>

<script>
import PettyScroll from '../../petty-scrollbar/src/main.vue'

export default {
  components: {PettyScroll},
  name: 'hello',
  mounted () {
    document.getElementById('dadada').scrollTop = 50
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  *{
    padding: 0px;
    margin: 0px;
  }
  .code-back{
    background-color: #e4e4e4;
  }
</style>
