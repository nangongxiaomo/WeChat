const util = require('../../../utils/util.js');
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {

        actorImgList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var movieId = options.id;
        var doubanApi = app.globalData.g_doubanApi;
        var movieDetailUrl = doubanApi + '/v2/movie/subject/' + movieId;
        util.http(movieDetailUrl, this.callBack);
    },

    callBack(data) {
        console.log(data)
        var movie = {
            movieImg: data.images.large,
            movieName: data.title,
            movieArea: data.countries[0],
            movieYears: data.year,
            movieLike: data.wish_count,
            movieComments: data.comments_count,
            movieScore: data.rating.average,
            movieStars: util.startArray(data.rating.stars),
            movieDirector: data.directors[0].name,
            movieActor: this.getActorName(data.casts),
            movieActorList: data.casts,
            movieType: data.genres.join('、'),
            movieSummary: data.summary == '' ? '暂无简介' : data.summary.replace(/\\n/g, '\n')
        };
        for (var i = 0, listLen = data.casts.length; i < listLen; i++) {
            this.data.actorImgList.push(data.casts[i].avatars.large);
        };
        this.setData({
            movie: movie
        });

    },
    getActorName(casts) {
        var actorStr = '';
        for (var idx in casts) {
            actorStr += casts[idx].name + '、';
        }
        return actorStr.substring(0, actorStr.length - 1);
    },
    //点击演员图片显示大图
    previewImg(event) {
        var previewImgUrl = event.currentTarget.dataset.src;
        wx.previewImage({
            current: previewImgUrl,
            urls: this.data.actorImgList,
        })
    }
})