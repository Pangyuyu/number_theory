
<template>
    <div class="pane-page">
        <div class="query">
            <div class="title">操作类型：</div>
            <el-select v-model="optionValue" placeholder="请选择" :disabled="loading">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
        </div>
        <div class="echarts" id="echarts"></div>
        <div class="status-bar">

        </div>
    </div>

</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'
import * as echarts from 'echarts';
let xList = []
let yList = []
let myChart = null
const optionValue = ref(0)
const loadingCount = ref(0)
const loading = ref(false)
const options = ref([
    {
        value: 0,
        label: ".....",
        displayMode: 'echart',
        seriestype: 'line',
        hasCycle: true,
    }
])
onMounted(() => {
    window.onresize = function () {
        if (myChart) {
            myChart.resize();
        }
    };
})
function initEcharts() {
    if (myChart == null) {
        myChart = echarts.init(document.getElementById('echarts'));
    }
    const optionItem = options.value.find(item => { return item.value == optionValue.value })
    myChart.setOption({
        title: {
            show: false
        },
        legend: {
            show: false,
        },
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
</script>