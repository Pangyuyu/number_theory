const asarmor = require('asarmor');
const { join } = require("path");

exports.default = async ({ appOutDir, packager }) => {
  try {    
    const asarPath = join(packager.getResourcesDir(appOutDir), 'app.asar');
    const archive = await asarmor.open(asarPath);
    archive.patch();//保证不能使用asar命令解压
    archive.patch(asarmor.createBloatPatch(1024)); // 送1T膨胀包
    await archive.write(asarPath);
  } catch (err) {
    
  }
};