Page({

    /**
     * 页面的初始数据
     */
    data: {

    },
    onLoad() {
        wx.getUserInfo({
            success: data => {
                console.log(data);
                this.setData({
                    userHead: data.userInfo.avatarUrl,
                    userNickName: data.userInfo.nickName
                })
            },
            fail: error => {
                console.log(error);
                wx.showToast({
                    title: '用户信息获取失败',
                    icon: 'none',
                    duration: 2000
                })
            }
        })
    },
    linkIndex() {
        wx.switchTab({
            url: '../posts/post',
        })
    }
})