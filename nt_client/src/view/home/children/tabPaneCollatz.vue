
<template>
    <div class="pane-page">
        <div class="query">
            <div class="title">操作类型：</div>
            <el-select v-model="optionValue" placeholder="请选择" :disabled="loading">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <div class="title">起始位置:</div>
            <el-input-number v-model="startIndex" :min="5" :max="50847534" :disabled="loading" />
            <div class="title">结束位置:</div>
            <el-input-number v-model="endIndex" :min="5" :max="50847534" :disabled="loading" />
            <el-button type="primary" style="margin-left:10px" size="small" @Click="onClickStartCalcAuto()"
                :loading="loading">开始计算</el-button>
                <el-button type="danger" style="margin-left:10px"  size="small" @Click="onClickStartCalcAutoStop()">停止计算</el-button>
            <div class="line-v"></div>
            <el-button type="success" size="small" @click="onClickGetMaxNo()">MAX NO</el-button>
        </div>
        <div class="echarts" id="echarts_Collatz"></div>
        <div class="status-bar">
            <div class="status-item">
                计算目标:{{ curCalc }}
            </div>
            <div class="status-item">
                序列总数:{{ loadingCount }}
            </div>
        </div>
    </div>

</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'
import * as echarts from 'echarts';
import ModalTool from '@/common/ui/ModalTool';
let xList = []
let yList = []
let myChart = null
const optionValue = ref(0)
const loadingCount = ref(0)
const loading = ref(false)
const curCalc=ref(0)
let calcRunning=false
const options = ref([
    {
        value: 0,
        label: "冰雹序列",
        displayMode: 'echart',
        seriestype: 'line',
        hasCycle: true,
    },
    {
        value: 1,
        label: "冰雹步长",
        displayMode: 'echart',
        seriestype: 'line',
        hasCycle: true,
    }
])
const startIndex = ref(5)
const endIndex = ref(100)
onMounted(() => {
    window.onresize = function () {
        if (myChart) {
            myChart.resize();
        }
    };
})
function initEcharts() {
    if (myChart == null) {
        myChart = echarts.init(document.getElementById('echarts_Collatz'));
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
                symbolSize: [2, 2],
                label: {
                    show: true,
                    position: 'bottom',
                    textStyle: {
                        fontSize: 12
                    }
                }
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
function RunCalcCollazSeq(num: number) {
    return new Promise(async (resolve, __) => {
        xList = []
        yList = []
        const calcRes = await window.EPre.collatzGetSequence(num)
        await window.EPre.collatzGetSequence(num)
        calcRes.data.forEach(item => {
            xList.push(xList.length + 1)
            yList.push(item)
        })
        updateEcharts()
        loadingCount.value = xList.length
        resolve({})
    })
}
function RunSleep(sec: number) {
    return new Promise((resolve, __) => {
        setTimeout(() => {
            resolve({})
        }, sec * 1000)
    })
}
async function onClickStartCalc() {
    loading.value = true
    initEcharts()
    await RunCalcCollazSeq(startIndex.value)
    loading.value = false
}
async function onClickStartCalcAuto() {
    loading.value = true
    calcRunning=true
    initEcharts()
    for (let i = startIndex.value; i <= endIndex.value; i++) {
        await RunCalcCollazSeq(i)
        curCalc.value=i
        await RunSleep(0.2)
        if(!calcRunning){
            break
        }
    }
    loading.value = false
}
function onClickStartCalcAutoStop(){
    calcRunning=false
    loading.value = false
}
async function onClickGetMaxNo(){
    const queryRes=await window.EPre.collatzCurCalcMaxNo()
    console.log("queryRes",queryRes)
    if(queryRes.isFail){
        ModalTool.ShowDialogWarn("提醒",queryRes.message)
        return
    }
    ModalTool.ShowDialogSuccess("最大计算数",queryRes.data.maxNo)
}
</script>