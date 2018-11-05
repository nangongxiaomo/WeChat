//要是用相对路径 绝对路径无效会报错
var postData = require('../../data/posts-data.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },
    linkDetail(event) {
        const postId = event.currentTarget.dataset.postid;
        wx.navigateTo({
            url: 'post-detail/post-detail?id=' + postId,
        })
    },
    onLoad: function () {
        wx.showLoading({
            title: '页面加载中...',
        });
        this.setData({
            carousel: postData.postList.slice(0, 3), //轮播图片
            listInfo: postData.postList //列表部分
        })
    },
    onReady(){
        wx.hideLoading();
    }
})