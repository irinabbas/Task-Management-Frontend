<template>
  <div id="app">
    <router-view></router-view> <!-- This is where the routed components will appear -->
  </div>
</template>

<script>
import 'font-awesome/css/font-awesome.css';
export default {
  name: 'App',
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
