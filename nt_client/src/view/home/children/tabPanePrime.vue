<template>
    <div class="pane-page">
        <div class="query">
            <div class="title">操作类型：</div>
            <el-select v-model="optionValue" placeholder="请选择" :disabled="loading">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <div class="title">起始位置:</div>
            <el-input-number v-model="startIndex" :min="1" :max="50847534" :disabled="loading" />
            <div class="title">结束位置:</div>
            <el-input-number v-model="endIndex" :min="1" :max="50847534" :disabled="loading" />
            <div class="title">分批数量:</div>
            <el-input-number v-model="groupCount" :min="1" :max="10000" :disabled="loading || !hasCycle" />
            <el-button type="primary"  size="small" style="margin-left:10px" @Click="onClickStartLoading()" :loading="loading">开始加载
            </el-button>
            <el-button type="success"  size="small" @Click="onClickEndLoading()" :disabled="!loading">停止加载</el-button>
        </div>
        <div class="echarts" id="echarts_prime"></div>
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
        myChart = echarts.init(document.getElementById('echarts_prime'));
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
                symbolSize: [2, 2]
            }
        ],
        dataZoom: {
            show: true, // 为true 滚动条出现
            realtime: true,
            type: 'slider', // 有type这个属性，滚动条在最下面，也可以不行，写y：36，这表示距离顶端36px，一般就是在图上面。
            height: 20, // 表示滚动条的高度，也就是粗细
            start: 0, // 表示默认展示0%～50%这一段。
            end: 50
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
            // console.log("查询结果", queryRes)
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