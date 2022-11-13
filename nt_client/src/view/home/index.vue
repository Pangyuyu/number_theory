<template>
  <div class="page">
    <div class="query">
      <div class="title">数据类型：</div>
      <el-select v-model="optionValue" placeholder="请选择" :disabled="loading">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <div class="title">起始位置:</div>
      <el-input-number v-model="startIndex" :min="1" :max="50847534" :disabled="loading" />
      <div class="title">结束位置:</div>
      <el-input-number v-model="endIndex" :min="1" :max="50847534" :disabled="loading" />
      <div class="title">分批数量:</div>
      <el-input-number v-model="groupCount" :min="1" :max="10000" :disabled="loading||!hasCycle" />
      <el-button type="primary" style="margin-left:10px" @Click="onClickStartLoading()" :loading="loading">开始加载
      </el-button>
      <el-button type="success" @Click="onClickEndLoading()" :disabled="!loading">停止加载</el-button>
    </div>
    <div class="echarts" id="echarts"></div>
    <!-- <el-table :data="tableData" border style="width: 100%" v-if="optionValue == 2">
      <el-table-column prop="no" label="no" width="180" />
      <el-table-column prop="before" label="before" width="180" />
      <el-table-column prop="after" label="after" width="180" />
      <el-table-column prop="diff" label="间隔" width="180" />
      <el-table-column/>
    </el-table> -->
    <div class="status-bar">
      <div class="status-item">
        开始时间:{{ startTime }}
      </div>
      <div class="status-item">
        停止时间:{{ endTime }}
      </div>
      <div class="status-item">
        已加载总数:{{ loadingCount }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import * as echarts from 'echarts';
import time from '@/common/utils/time'
onMounted(() => {

})
const optionValue = ref(0)
const options = ref([
  {
    value: 0,
    label: "质数序列",
    displayMode: 'echart',
    seriestype: 'line',
    hasCycle: true,
  },
  {
    value: 1,
    label: "质数间隔",
    displayMode: 'echart',
    seriestype: 'scatter',
    hasCycle: true,
  },
  {
    value: 2,
    label: "首次邻质差值出现的位置",
    displayMode: 'echart',
    seriestype: 'line',
    hasCycle: false,//此项不需要循环
  },
  {
    value: 3,
    label: "邻质数差统计",
    displayMode: 'echart',
    seriestype: 'line',
    hasCycle: false,//此项不需要循环
  }
])
const hasCycle = ref(true)
watch(() => optionValue.value, (value, oldValue) => {
  const optionItem = options.value.find(item => { return item.value == optionValue.value })
  hasCycle.value = optionItem.hasCycle
})
const startIndex = ref(0)
const endIndex = ref(10000)
const groupCount = ref(1000)
const loading = ref(false)
const startTime = ref("-")
const endTime = ref("-")
const loadingCount = ref(0)
let xList = []
let yList = []
let myChart = null
function initEcharts() {
  if (myChart == null) {
    myChart = echarts.init(document.getElementById('echarts'));
  }
  const optionItem = options.value.find(item => { return item.value == optionValue.value })
  myChart.setOption({
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
        symbolSize: [2, 2]
      }
    ]
  });
}
function updateEcharts() {
  myChart.setOption({
    xAxis: {
      data: xList
    },
    series: [
      {
        name: '值',
        data: yList,
      }
    ]
  });
}
async function onClickStartLoading() {
  startTime.value = time.timestamp2Str(time.unixNow(), "hh:mm:ss")
  xList = []
  yList = []
  initEcharts()
  let queryFunc = null
  if (optionValue.value == 0) {
    queryFunc = window.EPre.dbQueryPrimeByIndex
  } else if (optionValue.value == 1) {
    queryFunc = window.EPre.dbQueryPrimeInterval
  } else if (optionValue.value == 2) {
    queryFunc = window.EPre.dbQueryPrimeFirstSpacing
  }else if (optionValue.value == 3) {
    queryFunc = window.EPre.dbQueryPrimeSpacingStat
  }
  if (queryFunc == null) {
    return
  }
  loading.value = true
  startRefreshEcharts()
  if (hasCycle.value) {
    for (let i = startIndex.value; i < endIndex.value; i = i + groupCount.value) {
      if (!loading.value) {
        break
      }
      const queryRes = await queryFunc(i, i + groupCount.value)
      console.log("查询结果", queryRes)
      if (queryRes.isFail) {
        console.error("查询失败", queryRes)
        break;
      }
      if (queryRes.data.length == 0) {
        break
      }
      queryRes.data.forEach(item => {
        xList.push(item.no)
        yList.push(item.value)
      })
      loadingCount.value = xList.length
      if (!loading.value) {
        break
      }
    }
  } else {
    const queryRes = await queryFunc(startIndex.value,endIndex.value)
    if (queryRes.isFail) {
      console.error("查询失败", queryRes)
      return;
    }
    if (queryRes.data.length == 0) {
      return
    }
    queryRes.data.forEach(item => {
      xList.push(item.no)
      yList.push(item.value)
    })
    loadingCount.value = xList.length
  }

  loading.value = false
  endTime.value = time.timestamp2Str(time.unixNow(), "hh:mm:ss")
  updateEcharts()
  stopRefreshEcharts()
}
function onClickEndLoading() {
  loading.value = false
}
let startFlag = null
function startRefreshEcharts() {
  startFlag = setInterval(() => {
    updateEcharts()
  }, 2000)
}
function stopRefreshEcharts() {
  if (startFlag) {
    clearInterval(startFlag)
    startFlag = null
  }
}
</script>

<style lang="scss" scoped>
.page {
  display: flex;
  flex-direction: column;
  background-color: #FFFFFF;

  .query {
    background-color: #282a28;
    height: 65px;
    display: flex;
    align-items: center;
    padding-left: 10px;
  }

  .echarts {
    flex-grow: 1
  }
}

.title {
  font-size: 14px;
  margin-left: 10px;
  margin-right: 5px;
  color: white;
}
</style>