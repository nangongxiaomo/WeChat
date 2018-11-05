const util = require('../../../utils/util.js');
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        movies: {},
        requestUrl: '',
        totalCount: 0,
        isEmpty: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var category = options.category; //获取传值
        var doubanApi = app.globalData.g_doubanApi;
        //动态设置导航条title
        wx.setNavigationBarTitle({
            title: category,
        });
        switch (category) {
            case '正在热映':
                var dataUrl = doubanApi + '/v2/movie/in_theaters'; //正在热映
                break;
            case '即将上映':
                var dataUrl = doubanApi + '/v2/movie/coming_soon'; //即将上映
                break;
            case 'top250':
                var dataUrl = doubanApi + '/v2/movie/top250'; //top250
                break;
        };
        this.data.requestUrl = dataUrl;
        util.http(dataUrl, this.callBack);
    },
    onReachBottom(event) {
        var nextUrl = this.data.requestUrl + '?start=' + this.data.totalCount + '&count=20';
        util.http(nextUrl, this.callBack);
        wx.showNavigationBarLoading();
    },
    callBack(data) {
        var movies = [];
        for (var idx in data.subjects) {
            var subjects = data.subjects[idx];
            var title = subjects.title;
            if (title.length >= 6) {
                title = title.substring(0, 6) + '...';
            }
            var temp = {
                stars: util.startArray(subjects.rating.stars),
                title: title,
                average: subjects.rating.average,
                coverageUrl: subjects.images.large,
                movieId: subjects.id
            }
            movies.push(temp);
        };
        var totalMovies = {};
        if (!this.data.isEmpty) {
            totalMovies = this.data.movies.concat(movies);
        } else {
            totalMovies = movies;
            this.data.isEmpty = false;
        }
        this.data.totalCount += 20;
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        this.setData({
            movies: totalMovies
        });
    },

    onPullDownRefresh() {
        var refreshUrl = this.data.requestUrl + '?start=0&count=20';
        this.data.movies = {};
        this.data.isEmpty = true;
        util.http(refreshUrl, this.callBack);
        wx.showNavigationBarLoading();
    },
    linkDetail(event) {
        var movieId = event.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../movie-detail/movie-detail?id=' + movieId,
        })
    },
})