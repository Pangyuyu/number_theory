<template>
    <div class="pane-page">
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
            <el-input-number v-model="groupCount" :min="1" :max="10000" :disabled="loading || !hasCycle" />
            <el-button type="primary" style="margin-left:10px" @Click="onClickStartLoading()" :loading="loading">开始加载
            </el-button>
            <el-button type="success" @Click="onClickEndLoading()" :disabled="!loading">停止加载</el-button>
        </div>
        <div class="echarts" id="echarts"></div>
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
import { ref, watch, onMounted } from 'vue'
import * as echarts from 'echarts';
import time from '@/common/utils/time'
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
onMounted(() => {
    window.onresize = function () {
        if (myChart) {
            myChart.resize();
        }
    };
})
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
    } else if (optionValue.value == 3) {
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
        const queryRes = await queryFunc(startIndex.value, endIndex.value)
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
.pane-page {
    display: flex;
    flex-direction: column;
    background-color: #FFFFFF;
    height: calc(100vh - 10px);

    .query {
        height: 46px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #8b8a8a;
    }

    .echarts {
        width: 99%;
        height: 100%;
        margin: 10px;
        border-radius: 10px;
        border: 1px solid #3c3c3c;
    }
}

.title {
    font-size: 14px;
    margin-left: 10px;
    margin-right: 5px;
    color: #3c3c3c;
}
</style>