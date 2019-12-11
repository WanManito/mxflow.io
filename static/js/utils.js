export default {
  install(Vue, options) {
    Vue.prototype.formatDuring = function (mss) {
      var days = parseInt(mss / (1000 * 60 * 60 * 24));
      var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = (mss % (1000 * 60)) / 1000;
      return days + " 天 " + hours + " 小时 " + minutes + " 分 " + Math.round(seconds) + " 秒 ";
    };
    Vue.prototype.formaDate = function (time) {
      var date = new Date(time);
      var year = date.getFullYear();
      var month = date.getMonth() + 1;//月份是从0开始的
      var day = date.getDate();
      var hour = date.getHours();
      var min = date.getMinutes();
      if (min < 10) {
        min = "0" + date.getMinutes();
      }
      var sec = date.getSeconds();
      if (sec < 10) {
        sec = "0" + date.getSeconds();
      }
      var newTime = year + '-' +
        month + '-' +
        day + ' ' +
        hour + ':' +
        min + ':' +
        sec;
      return newTime;
    };//格式化时间
    Vue.prototype.queryGroup=function(val, opt) {
      return val.map(function (value, index, array) {
        for (var itm of opt) {
          if (itm.value == value) {
            opt = itm.children;
            return itm;
          }
        }
        return null;
      });
    };//遍历区域数据  val=》接收的空数组  opt=》数据源
  }
}
