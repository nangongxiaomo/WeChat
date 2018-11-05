const util = require('../../utils/util.js');

const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        inTheaters: {},
        comingSoon: {},
        top250: {},
        containerShow: true,
        searchPanelShow: false,
        searchResult: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var doubanApi = app.globalData.g_doubanApi;
        var inTheatersUrl = doubanApi + '/v2/movie/in_theaters?start=0&count=3'; //正在热映
        var comingSoonUrl = doubanApi + '/v2/movie/coming_soon?start=0&count=3'; //即将上映
        var top250Url = doubanApi + '/v2/movie/top250?start=0&count=3'; //top250
        this.getMoviesListData(inTheatersUrl, 'inTheaters', '正在热映');
        this.getMoviesListData(comingSoonUrl, 'comingSoon', '即将上映');
        this.getMoviesListData(top250Url, 'top250', 'top250');
    },

    getMoviesListData(url, settedKey, content) {
        var _this = this;
        wx.request({
            url: url,
            method: 'GET',
            success: function (data) {
                _this.processDoubanData(data.data, settedKey, content);
                console.log(data.data)

            }
        })
    },
    processDoubanData(moviesDouban, settedKey, content) {
        var movies = [];
        for (var idx in moviesDouban.subjects) {
            var subjects = moviesDouban.subjects[idx];
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
        if (moviesDouban.subjects.length === 0) {
            this.setData({
                isHaveData: true
            })
        } else {
            this.setData({
                isHaveData: false
            })
        }
        var readyData = {};
        readyData[settedKey] = {
            movies: movies,
            content: content
        };
        this.setData(readyData);
    },

    moreMovie(event) {
        var category = event.currentTarget.dataset.category;
        wx.navigateTo({
            url: 'more-movies/more-movies?category=' + category,
        })
    },

    linkDetail(event) {
        var movieId = event.currentTarget.dataset.id;
        wx.navigateTo({
            url: 'movie-detail/movie-detail?id=' + movieId,
        })
    },

    onBindFocus(event) {
        this.setData({
            containerShow: false,
            searchPanelShow: true
        })
    },

    onBindBlur(event) {
        var value = event.detail.value;
        if (value === '') {
            return false;
        } else {
            var searchUrl = app.globalData.g_doubanApi + '/v2/movie/search?q=' + value;
            this.getMoviesListData(searchUrl, 'searchResult', '');
        }

    },

    cancelImgTap(event) {
        this.setData({
            containerShow: true,
            searchPanelShow: false,
            searchResult: {},
            emptyValue: ''
        })
    }
})