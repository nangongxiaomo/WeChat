const startArray = (stars) => {
    var num = stars.toString().substring(0, 1);
    const array = [];
    for (var i = 0; i < 5; i++) {
        if (i < num) {
            array.push(1);
        } else {
            array.push(0);
        }
    }
    return array;
}

const http = (url,callBack) => {
    wx.request({
        url: url,
        method: 'GET',
        success: function (data) {
            callBack(data.data)
        }
    })
}

module.exports = {
    startArray: startArray,
    http: http
}