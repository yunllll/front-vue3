var now = new Date();
var year = now.getFullYear();
var month = now.getMonth() + 1; // 月份从 0 开始，所以要加 1
var day = now.getDate();
var hours = now.getHours();
var minutes = now.getMinutes();
var seconds = now.getSeconds();


var monthStandard = padZero(month);
var dayStandard = padZero(day);
var hoursStandard = padZero(hours);
var minutesStandard = padZero(minutes);
var secondsStandard = padZero(seconds);
//获取时间数据
function getNowTime() {
    now = new Date();
    year = now.getFullYear();
    month = now.getMonth() + 1; // 月份从 0 开始，所以要加 1
    day = now.getDate();
    hours = now.getHours();
    minutes = now.getMinutes();
    seconds = now.getSeconds();


    monthStandard = padZero(month);
    dayStandard = padZero(day);
    hoursStandard = padZero(hours);
    minutesStandard = padZero(minutes);
    secondsStandard = padZero(seconds);
}

function padZero(num) {//如果不满10前置添加0
    return (num < 10 ? "0" : "") + num;
}
//获取今天是星期几
export function getDayOfWeek() {
    getNowTime()
    var days = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    var now = new Date();
    var dayOfWeek = now.getDay(); // 返回值是 0（表示星期天）到 6（表示星期六）之间的一个整数
    return days[dayOfWeek];
}

//获取当前基础时间年月日时分秒
export function getTime(zero = true) {
    getNowTime()
    return {
        year: year,
        month: zero ? monthStandard : month,
        day: zero ? dayStandard : day,
        hours: zero ? hoursStandard : hours,
        minutes: zero ? minutesStandard : minutes,
        seconds: zero ? secondsStandard : seconds
    };
}

//获取当前时间格式yyyy-MM-dd
export function getTimeYMD(type) {
    getNowTime()
    var timeType = type ?? '-'//获取所需要生成的类型，默认为-拼接
    // 添加前导零，确保格式为两位数

    return {
        basicsTime: year + timeType + monthStandard + timeType + dayStandard,//基础时间
        fullTime: year + timeType + monthStandard + timeType + dayStandard + ' ' + hoursStandard + ":" + minutesStandard + ":" + secondsStandard//完整时间
    }
}

//获取当前时间格式年月日
export function getTimeChinese() {
    getNowTime()
    return {
        basicsTime: year + "年" + monthStandard + "月" + dayStandard + "日",//基础时间
        fullTime: year + "年" + monthStandard + "月" + dayStandard + "日" + " " + hoursStandard + "时" + minutesStandard + "分" + secondsStandard + "秒",//完整时间
    }
}

//按照时间推算
export function getCalculateTime(num) {
    getNowTime()
    let timeNum = num ?? 0 //计算时间参数如果不传则为0
    var CalculateTime = new Date(); // 获取当前时间
    CalculateTime.setDate(CalculateTime.getDate() + timeNum); // 获取指定天数之后的日期


    var yearCalculate = CalculateTime.getFullYear();
    var monthCalculate = CalculateTime.getMonth() + 1; // 月份从 0 开始，所以要加 1
    var dayCalculate = CalculateTime.getDate();
    var hoursCalculate = CalculateTime.getHours();
    var minutesCalculate = CalculateTime.getMinutes();
    var secondsCalculate = CalculateTime.getSeconds();

    var monthCalculateStandard = padZero(monthCalculate);
    var dayCalculateStandard = padZero(dayCalculate);
    var hoursCalculateStandard = padZero(hoursCalculate);
    var minutesCalculateStandard = padZero(minutesCalculate);
    var secondsCalculateStandard = padZero(secondsCalculate);

    return {
        basicsTime: yearCalculate + "-" + monthCalculateStandard + "-" + dayCalculateStandard,//基础时间
        fullTime: yearCalculate + "-" + monthCalculateStandard + "-" + dayCalculateStandard + ' ' + hoursCalculateStandard + ":" + minutesCalculateStandard + ":" + secondsCalculateStandard//完整时间
    }
}