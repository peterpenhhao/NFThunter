export default {
    computedTime(old) {
        //传入之前的时间  时间格式为(YY-MM-DD HH:MM:SS)
        var returnText = "";
        var nowDate = new Date().getTime(); //当前时间
        var setDate = new Date(old).getTime();
        var times = Math.floor((nowDate - setDate) / 1000);
        if (times > 60 * 60 * 24 * 365) {
            returnText = Math.floor(times / (60 * 60 * 24 * 365)) + "年前";
        } else if (times > 60 * 60 * 24 * 30) {
            returnText = Math.floor(times / (60 * 60 * 24 * 30)) + "个月前";
        } else if (times > 60 * 60 * 24) {
            returnText = Math.floor(times / (60 * 60 * 24)) + "天前";
        } else if (times > 60 * 60) {
            returnText = Math.floor(times / (60 * 60)) + "小时前";
        } else if (times > 60) {
            returnText = Math.floor(times / 60) + "分钟前";
        } else if (times > 0) {
            returnText = Math.floor(times / 1) + "秒前";
        } else {
            returnText = "0秒前";
        }
        return returnText;
    },
    computeTimespan(from,to){
        var returnText = "";
        var nowDate = new Date(to).getTime(); 
        var setDate = new Date(from).getTime();
        var times = Math.floor((nowDate - setDate) / 1000);
        if (times > 60 * 60 * 24 * 365) {
            returnText = Math.floor(times / (60 * 60 * 24 * 365)) + "年";
        } else if (times > 60 * 60 * 24 * 30) {
            returnText = Math.floor(times / (60 * 60 * 24 * 30)) + "个月";
        } else if (times > 60 * 60 * 24) {
            returnText = Math.floor(times / (60 * 60 * 24)) + "天";
        } else if (times > 60 * 60) {
            returnText = Math.floor(times / (60 * 60)) + "小时";
        } else if (times > 60) {
            returnText = Math.floor(times / 60) + "分钟";
        } else if (times > 0) {
            returnText = Math.floor(times / 1) + "秒";
        } else {
            returnText = "0秒";
        }
        return returnText;
    }
};