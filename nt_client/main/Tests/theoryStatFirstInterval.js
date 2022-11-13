const toolDbTheory = require("../IPCTools/tool-sqlite");
const fs = require('fs');
(async () => {
    console.log("正在统计中...",__dirname)
    let filterMap = new Map()
    let allCount = 50847534
    let groupCount = 10000

    // let allCount = 10000
    // let groupCount = 100
    for (let i = 0; i < allCount; i = i + groupCount) {
        let start = i
        let end = i + groupCount
        const sql = `SELECT tp1.n1 as 'no',tp1.v1 as "before",tp2.v2 as "after", (tp2.v2-tp1.v1) as diff from (select "number" AS n1, value as v1 from tb_prime where "number">=${start} and "number" <=${end}) as tp1
        LEFT JOIN (select "number" AS n2, value as v2 from tb_prime  where "number">=${start} and "number" <=${end + 1}) as tp2 on tp2.n2=tp1.n1+1`
        const filterRes = await toolDbTheory.queryQll(sql)
        if (filterRes.isFail) {
            console.log("查询失败", filterRes)
            break
        }
        if (filterRes.data.length == 0) {
            console.log("查询结束")
            break;
        }
        filterRes.data.forEach(item => {
            if (!filterMap.has(item.diff)) {
                filterMap.set(item.diff, {
                    ...item,
                    count:1
                })
            }else{
                filterMap.get(item.diff).count++
            }
        })
    }
    console.log("统计结束")
    let resultList = []
    for (let item of filterMap.values()) {
        resultList.push(item)
    }
    const content = JSON.stringify(resultList, null, 2)
    const opt = {
        flag: 'w', // a：追加写入；w：覆盖写入
    }
    const filePath=`${__dirname}/../data/theory-first-interval.json`
    fs.writeFile(filePath, content, opt, (err) => {
        if (err) {
            console.error(err)
        }
        console.log("写入文件结束")
    })

})();
