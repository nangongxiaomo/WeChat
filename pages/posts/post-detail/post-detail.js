// pages/posts/post-detail/post-detail.js
const postData = require('../../../data/posts-data.js');
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isPlayingMusic: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (option) {

        const postId = option.id;
        this.data.currentPostId = postId;
        const postDetailData = postData.postList[postId];
        this.setData({
            postDetailData: postDetailData
        });

        //实现文章收藏
        const postsCollected = wx.getStorageSync('posts_collected'); //获取storage
        if (postsCollected) {
            const postCollected = postsCollected[postId]; //获取对应文章的postId值
            if (postCollected) {
                this.setData({
                    collected: postCollected
                })
            }
        } else {
            const postsCollected = {};
            postsCollected[postId] = false;
            wx.setStorageSync('posts_collected', postsCollected);
        };

        if (app.globalData.g_isPlay && app.globalData.g_postId === postId) {
            this.setData({
                isPlayingMusic: true
            })
        }

        this.setmusicMonitor();
    },
    //点击收藏
    isCollection(event) {
        const postsCollected = wx.getStorageSync('posts_collected'); //获取storage
        var postCollected = postsCollected[this.data.currentPostId]; //获取当前文章ID
        postCollected = !postCollected;
        postsCollected[this.data.currentPostId] = postCollected;
        wx.setStorageSync('posts_collected', postsCollected); //设置storage
        if (postCollected) {
            wx.showToast({
                title: '收藏成功',
            })
        } else {
            wx.showToast({
                title: '取消成功',
            })
        }
        this.setData({
            collected: postCollected
        })
    },
    //点击分享
    isShare() {
        wx.showActionSheet({
            itemList: ['新浪微博', 'QQ空间', '朋友圈'],
            success: function (res) {
                console.log(res)
            }
        })
    },
    //音乐播放
    isPlay() {
        var isMusic = this.data.isPlayingMusic;
        var currentPostId = this.data.currentPostId;
        if (isMusic) {
            wx.pauseBackgroundAudio();
            this.setData({
                isPlayingMusic: false
            })
        } else {
            wx.playBackgroundAudio({
                dataUrl: postData.postList[currentPostId].music.url
            });
            this.setData({
                isPlayingMusic: true
            })
        }
    },
    backgroundAudio(){
        const backAudio = wx.getBackgroundAudioManager();
        backAudio.onEnded(() => {
            this.setData({
                isPlayingMusic: false
            })
        })
    },
    setmusicMonitor() {
        const _this = this;
        //监听音乐播放
        wx.onBackgroundAudioPlay(() => {
            this.setData({
                isPlayingMusic: true
            });
            app.globalData.g_isPlay = true;
            app.globalData.g_postId = _this.data.currentPostId;
        });
        //监听音乐暂停
        wx.onBackgroundAudioPause(() => {
            this.setData({
                isPlayingMusic: false
            })
        });
        //监听音乐停止
        wx.onBackgroundAudioStop(() => {
            this.setData({
                isPlayingMusic: false
            })
        });
        this.backgroundAudio();
        app.globalData.g_isPlay = false;
        app.globalData.g_postId = null;
    }
})