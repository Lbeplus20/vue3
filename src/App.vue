<template>
  <div id="app">
    <Manage />
  </div>
</template>

<script>
import Manage from './views/Manage';

export default {
  name: 'App',
  components: {
    Manage
  }
}
</script>

<style>
  #app{
    min-height: 100vh;
  }

</style>
