const dataSource=require("../data/theory-first-interval.json")
const fs = require('fs');
(async () => {
    const opt = {
        flag: 'a', // a：追加写入；w：覆盖写入
    }
    const filePath=`${__dirname}/../data/theory-first-interval.csv`
    fs.writeFileSync(filePath,"no,before,after,diff,count\n",opt)
    dataSource.forEach(item=>{
        fs.writeFileSync(filePath,`${item.no},${item.after},${item.before},${item.diff},${item.count}\n`,opt)
    })
})();
