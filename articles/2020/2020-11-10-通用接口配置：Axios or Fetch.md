## 前言

在项目的开发过程中，我们也少不了与后台服务器进行数据的获取和交互，这一般都是通过接口完成的，那么我们如何进行合理的通用接口配置呢？

## 需求分析

**期望：**

-   支持 RESTful API（get，post，put，delete ）
-   headers 可配置，如设置 `Authorization` 、`x-tenant-header` 等
-   Content-Type 可配置，如 `application/x-www-form-urlencoded` 或 `application/json`
-   通用请求头 origin `baseURL`
-   设置连接超时时间 `60*1000`
-   支持 Promise 调用
-   常见错误状态码处理
-   token 失效处理

**使用：**

-   `GET /articles?page=1&limit=20`
-   `GET /articles/all`
-   `GET /articles/:id`
-   `POST /articles application/json`
-   `PUT /articles/:id application/x-www-form-urlencoded`
-   `DELETE /articles/:id`

```js
import { _get, _post, _put, _delete } from '@/utils/fetch';

export const getArticleList = (p) => _get('/cms-api/api/cms/getVideoList', p);

export const addNewArticle = (p) => _post('/cms-api/api/cms/addNewArticle', p);

export const updateArticle = (p) => _put('/cms-api/api/cms/updateArticle', p);

export const deleteArticle = (p) =>
  _delete('/cms-api/api/cms/deleteArticle', p);
```

## 实现思路

axios 是 前端请求库的集大成者，api 设计对于我们二次封装极为方便。

fetch API 在兼容库[fetch polyfill](https://github.com/github/fetch)的支持下，封装也十分的遍历。

下面，我们选择这两种方案来进行封装前端公共请求。

## 请求方式 —— axios

```js
// 环境的切换
axios.defaults.baseURL = '/prod-api';
axios.defaults.timeout = 60000;
axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded;charset=UTF-8;';

const LOADING = (window.LOADING = new loadingControl());

// 请求拦截器
axios.interceptors.request.use(
  (config) => {
    config.headers['x-tenant-header'] = 'web-spcloud-sales';

    LOADING.addLoading();

    Toast.loading({
      message: '加载中...',
      forbidClick: true,
      loadingType: 'spinner',
      duration: 60000,
    });

    const token = sessionStorage.getItem('ACC_SIGN') || '';
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token; // 让每个请求携带自定义token 请根据实际情况自行修改
    } else {
      // 客戶端以及客戶端秘钥
      config.headers['Authorization'] =
        'Basic ' + window.btoa('web-spcloud-sales:webApp');
    }
    return config;
  },
  (error) => {
    return Promise.error(error);
  },
);

// 响应拦截器
axios.interceptors.response.use(
  (response) => {
    LOADING.isCloseLoading();
    LOADING.loadingCount === 0 ? Toast.clear() : '';

    if (response.status === 200) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
  },
  // 服务器状态码不是2开头的的情况
  // 处理错误状态码，例如登录过期提示，错误提示等等
  (error) => {
    LOADING.reset();
    Toast.clear();
    if (error.response.status) {
      switch (error.response.status) {
        case 401:
          this.$toast({ message: '用户未授权', time: 2000 });
          break;
        // 403 token过期
        // 登录过期对用户进行提示
        // 清除本地token和清空vuex中token对象
        // 跳转登录页面
        case 403:
          Toast.fail({
            message: '登录过期，请重新登录',
            duration: 3000,
          });
          break;
        // 404请求不存在
        case 404:
          Toast.fail({
            message: '网络请求不存在...',
            duration: 3000,
          });
          break;
        // 其他错误，直接抛出错误提示
        default:
          Toast.fail({
            message: '未知系统异常...',
            duration: 3000,
          });
      }
      return Promise.reject(error.response);
    }
  },
);

export function _get(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: params,
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        console.log(err);
        reject(err.data);
      });
  });
}

export function _post(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, params)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err.data);
      });
  });
}

export function _put(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .put(url, QS.stringify(params))
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err.data);
      });
  });
}

export function _delete(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .delete(url, QS.stringify(params))
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err.data);
      });
  });
}
```

## 请求方式 —— fetch

```js
import 'whatwg-fetch';
import { Toast } from 'vant';
import loadingControl from './loadingControl';

const baseURL = '/prod-api';
const LOADING = (window.LOADING = new loadingControl());

export default class Http {
  static async request(method, url, data) {
    const config = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'x-tenant-header': 'web-spcloud-sales',
      },
    };

    const token = sessionStorage.getItem('ACC_SIGN') || '';
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    } else {
      // 客戶端以及客戶端秘钥
      config.headers['Authorization'] =
        'Basic ' + window.btoa('web-spcloud-sales:webApp');
    }

    if (method === 'GET') {
      url = baseURL + url + this.formatQuery(data);
    } else {
      url = baseURL + url;
      config['body'] = JSON.stringify(data);
    }

    LOADING.addLoading();
    Toast.loading({
      message: '加载中...',
      forbidClick: true,
      loadingType: 'spinner',
      duration: 55000,
    });

    return fetch(url, config)
      .then((response) => this.isSuccess(response))
      .then((response) => {
        return response.json();
      });
  }

  // 判断请求是否成功
  static isSuccess(res) {
    LOADING.isCloseLoading();
    LOADING.loadingCount === 0 ? Toast.clear() : '';
    if (res.status >= 200 && res.status < 300) {
      return res;
    } else {
      this.requestException(res);
    }
  }

  // 处理异常
  static requestException(res) {
    const error = new Error(res.statusText);
    error.response = res;
    throw error;
  }

  // url处理
  static formatQuery(query) {
    let params = [];
    if (query) {
      for (let item in query) {
        let vals = query[item];
        if (vals !== undefined) {
          params.push(item + '=' + query[item]);
        }
      }
    }
    return params.length ? '?' + params.join('&') : '';
  }

  static get(url, data) {
    return this.request('GET', url, data);
  }

  static post(url, data) {
    return this.request('POST', url, data);
  }

  static put(url, data) {
    return this.request('PUT', url, data);
  }

  static delete(url, data) {
    return this.request('DELETE', url, data);
  }
}

export function _get(url, params) {
  return new Promise((resolve, reject) => {
    Http.get(url, params)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function _post(url, params) {
  return new Promise((resolve, reject) => {
    Http.post(url, params)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function _put(url, params) {
  return new Promise((resolve, reject) => {
    Http.post(url, params)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function _delete(url, params) {
  return new Promise((resolve, reject) => {
    Http.delete(url, params)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
```

## 模块化组合

这里看我的另一篇文章

-   [#92](https://github.com/yanyue404/blog/issues/92) (前端项目目录层级优化 —— 文件级分层 API)

## 参考

-   [camsong/blog#2](https://github.com/camsong/blog/issues/2)
-   [https://zhuanlan.zhihu.com/p/32734197](https://zhuanlan.zhihu.com/p/32734197)
-   [https://www.jianshu.com/p/d6796986e2ab](https://www.jianshu.com/p/d6796986e2ab)

The text was updated successfully, but these errors were encountered: