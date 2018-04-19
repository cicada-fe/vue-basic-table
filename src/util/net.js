import axios from 'axios';
import qs from 'qs';

var axInstance;

const init = function () {

    if (axInstance) {
        return;
    }
    axInstance = axios.create({
        //请求超时时间
        timeout: 5000,
        //跨站点访问控制请求 如果true  Access-Control-Allow-Origin 字段必须指定域名，不能为*
        withCredentials: false,
        responseType: 'json'
    });
};

const handlerParams = function (url, obj) {
    var i = 0;
    var isHasParam;

    if (url.indexOf('?') != -1)
        isHasParam = true;

    for (var o in obj) {
        if (obj[o] == undefined || obj[o] == null) {
            continue;
        }

        if (i == 0 && !isHasParam) {
            url += '?' + o + '=' + obj[o];
        } else {
            url += '&' + o + '=' + obj[o];
        }
        i++;
    }
    return url;
};

const baseJSON = function (method, url, params, data) {
    params = params || {};
    data = data || {};

    url = handlerParams(url, params);
    return axInstance({
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        data: data,
        url,
    });
};

const baseForm = function (method, url, params, data) {

    params = params || {};
    data = data || {};

    url = handlerParams(url, params);

    return axInstance({
        method: method,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
        data: qs.stringify(data),
        url,
    });

};


/**
 * 公共方法
 */
const Net = {

    init: init,

    postJSON(url, params, data) {
        return baseJSON('POST', url, params, data);
    },

    getJSON(url, params) {
        return baseJSON('GET', url, params);
    },

    postForm(url, params, data) {
        return baseForm('POST', url, params, data);
    }
};

export {Net};
