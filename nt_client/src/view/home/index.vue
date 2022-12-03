<template>
  <div class="home">
    <el-tabs v-model="activeName" class="demo-tabs" tab-position="left" type="border-card">
      <el-tab-pane label="质数" name="tabPanePrime">
        <tabPanePrimeVue />
      </el-tab-pane>
      <el-tab-pane label="圆周率" name="tabPanePi">
        <tabPanePaiVue />
      </el-tab-pane>
      <el-tab-pane label="考拉兹猜想" name="tabPaneCollatz">
        <tabPaneCollatzVue />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import tabPanePrimeVue from './children/tabPanePrime.vue';
import tabPanePaiVue from './children/tabPanePai.vue';
import tabPaneCollatzVue from './children/tabPaneCollatz.vue';
const activeName = ref("tabPanePrime")

</script>

<style>
.home {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
}

.demo-tabs {
  flex-grow: 1;
  padding: 0;
  margin: 0;
}

.demo-tabs>.el-tabs__content {
  color: #6b778c;
  padding: 0;
  margin: 0 5px 0 0;
}
</style>
