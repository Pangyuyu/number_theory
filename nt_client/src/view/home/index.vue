<template>
  <div class="page">
    <div class="query">
      <el-select v-model="optionValue" placeholder="请选择">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>
    <div class="echarts" id="echarts"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import * as echarts from 'echarts';
import demoData from './demodata.json';
onMounted(() => {
  displayData()
})
const optionValue = ref(0)
const options = ref([
  {
    value: 0,
    label: "质数序列",
    seriestype:'line',
    dataSource: demoData.primeList
  },
  {
    value: 1,
    label: "质数间隔",
    seriestype:'scatter',
    dataSource: demoData.primeInterList
  }
])
watch(() => optionValue.value, (value, oldValue) => {
  displayData()
})
function displayData() {
  const optionItem = options.value.find(item => { return item.value == optionValue.value })
  if (optionItem) {
    initEcharts(optionItem)
  }
}
function initEcharts(optionItem) {
  var myChart = echarts.init(document.getElementById('echarts'));
  let xList = []
  let yList = []
  optionItem.dataSource.forEach(item => {
    xList.push(item.no)
    yList.push(item.value)
  })
  myChart.setOption({
    title: {
      text: optionItem.label
    },
    tooltip: {},
    xAxis: {
      data: xList
    },
    yAxis: {},
    series: [
      {
        name: '值',
        type: optionItem.seriestype,//bar,line,scatter
        smooth: true,
        data: yList,
        symbolSize:[5,5]
      }
    ]
  });
}
</script>

<style lang="scss" scoped>
.page {
  display: flex;
  flex-direction: column;
  background-color: #FFFFFF;

  .query {
    background-color: #7eb6f6;
    height: 65px;
    display: flex;
    align-items: center;
    padding-left: 10px;
  }

  .echarts {
    flex-grow: 1
  }
}
</style>