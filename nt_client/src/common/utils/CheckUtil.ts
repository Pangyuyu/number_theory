import utils from "@/common/utils/utils";
import Errors from "@/common/errors/Errors";
import Logger from "@/common/logger/logger";
import time from "@/common/utils/time";
const log = new Logger("CheckUtil");
export default class CheckUtil {
  /**
   * 是否是身份证号
   */
  static IdNumber(idNumber: string | null) {
    if (idNumber == null || idNumber.trim() == "") {
      return Errors.newNormalError("身份证号码不可为空!");
    }
    if (idNumber.length < 18) {
      //位数判断
      return Errors.newNormalError("身份证号码格式不正确");
    }
    let IDNO_REG = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (!IDNO_REG.test(idNumber)) {
      //基本格式判断
      return Errors.newNormalError("身份证号码格式不正确");
    }
    //校验码判断
    var x = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]; //系数
    var sum = 0;
    for (var i = 0; i < 17; i++) {
      const idNum = parseInt(idNumber.substr(i, 1));
      sum += idNum * x[i];
    }
    var mod = sum % 11;
    var mx = [1, 0, "X", 9, 8, 7, 6, 5, 4, 3, 2];
    let checkCode = mx[mod];
    if (checkCode != idNumber[17]) {
      return Errors.newNormalError("身份证号不正确!");
    }
    return Errors.newOk();
  }
  static phone(str: string | null) {
    if (str == null || str.trim() == "") {
      return Errors.newNormalError("手机不可为空!");
    }
    const PHONE_REG = /^1[0-9]{10,10}$/;
    if (!PHONE_REG.test(str)) {
      return Errors.newNormalError("手机号码格式不正确!");
    }
    return Errors.newOk();
  }
  
}
