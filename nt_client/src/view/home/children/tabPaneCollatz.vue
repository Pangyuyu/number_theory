
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
            <el-button type="danger" style="margin-left:10px" size="small"
                @Click="onClickStartCalcAutoStop()">停止计算</el-button>
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
const curCalc = ref(0)
let calcRunning = false
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
        hasCycle: false,
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
        tooltip: {
            trigger: 'item',                            //触发类型,'item'数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用。 'axis'坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用。
            triggerOn: "mousemove|click",                      //提示框触发的条件,'mousemove'鼠标移动时触发。'click'鼠标点击时触发。'mousemove|click'同时鼠标移动和点击时触发。'none'不在 'mousemove' 或 'click' 时触发
            showContent: true,                           //是否显示提示框浮层
            alwaysShowContent: true,                     //是否永远显示提示框内容
            showDelay: 0,                                  //浮层显示的延迟，单位为 ms
            hideDelay: 100,                                //浮层隐藏的延迟，单位为 ms
            enterable: false,                             //鼠标是否可进入提示框浮层中
            confine: false,                               //是否将 tooltip 框限制在图表的区域内
            transitionDuration: 0.4,                      //提示框浮层的移动动画过渡时间，单位是 s,设置为 0 的时候会紧跟着鼠标移动
            backgroundColor: "rgba(50,50,50,0.7)",            //标题背景色
            borderColor: "#ccc",                        //边框颜色
            borderWidth: 0,                              //边框线宽
            padding: 5,
            textStyle: {
                color: '#FFF',     // 文字的颜色
                fontStyle: 'normal',    // 文字字体的风格（'normal'，无样式；'italic'，斜体；'oblique'，倾斜字体） 
                fontWeight: 'normal',    // 文字字体的粗细（'normal'，无样式；'bold'，加粗；'bolder'，加粗的基础上再加粗；'lighter'，变细；数字定义粗细也可以，取值范围100至700）
                fontSize: '12',    // 文字字体大小
                lineHeight: '50',    // 行高 
            }
        },
        yAxis: {},
        series: [
            {
                name: '值',
                type: optionItem.seriestype,//bar,line,scatter
                smooth: true,
                data: yList,
                symbolSize: [2, 2],
            }
        ],
        dataZoom: {
            show: true, // 为true 滚动条出现
            realtime: true,
            type: 'slider', // 有type这个属性，滚动条在最下面，也可以不行，写y：36，这表示距离顶端36px，一般就是在图上面。
            height: 20, // 表示滚动条的高度，也就是粗细
            // start: 0, // 表示默认展示20%～80%这一段。
            // end: 50
            startValue: 0,//数据窗口范围的起始数值(绝对数值)。如果设置了dataZoom-inside.start 则startValue失效。
            endValue: 100,
        }
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
    calcRunning = true
    initEcharts()
    if (optionValue.value == 0) {
        for (let i = startIndex.value; i <= endIndex.value; i++) {
            await RunCalcCollazSeq(i)
            curCalc.value = i
            await RunSleep(0.2)
            if (!calcRunning) {
                break
            }
        }
    } else if (optionValue.value == 1) {
        xList = []
        yList = []
        const calcRes = await window.EPre.collatzStepsStat(startIndex.value, endIndex.value)
        calcRes.data.forEach(item => {
            xList.push(item.no)
            yList.push(item.value)
        })
        updateEcharts()
        loadingCount.value = xList.length
    }

    loading.value = false
}
function onClickStartCalcAutoStop() {
    calcRunning = false
    loading.value = false
}
async function onClickGetMaxNo() {
    const queryRes = await window.EPre.collatzCurCalcMaxNo()
    console.log("queryRes", queryRes)
    if (queryRes.isFail) {
        ModalTool.ShowDialogWarn("提醒", queryRes.message)
        return
    }
    ModalTool.ShowDialogSuccess("最大计算数", queryRes.data.maxNo)
}
</script>