/**
 * Created by Administrator on 2017/4/27.
 */
/**
 * 测试结果-->执行结果
 * @param {any} $scope
 * @param {any} $rootScope
 * @param {any} $http
 * @param interface_url
 * @param result_url
 */
function RunResult($scope, $rootScope, $http, interface_url, result_url) {
    $scope.result_url = result_url;
    $scope.showResult_status = function (val) { // 0325
        if (val === 'fail') {
            return '失败';
        }
        if (val === 'pass') {
            return '成功';
        }
    };
    $scope.ResultList = []; // 执行结果列表
    // 执行结果列表方法
    $scope.ResultListMethod = function () {
        $scope.pageNum = 1;
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/case/result/list/?format=json',
            'params': {
                'page': 1
            },
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
            if (data.code === 200 || data.code === '200'){
                $scope.ResultList = data.result;
                $scope.initPageCompomentFun(data.allPage);
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            // console.info('执行结果列表方法-error');
            $rootScope.showToast(data.message);
        })
    };
    $scope.ResultListMethod();
    // 分页开始

    //点击分页执行的函数
    $scope.changePageFun = function (pageNumber) {
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/case/result/list/?format=json',
            'params': {
                'page': pageNumber
            },
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
            if (data.code === 200 || data.code === '200'){
                $scope.ResultList = data.result;
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast(data.message);
        })
    };
    //创建分页
    $scope.initPageCompomentFun = function (count) {
        $(".back-runResult-frame .tcdPageCode").createPage({
            pageCount : count,
            current: 1,
            backFn: function (page_number) {
                $scope.pageNum=page_number;
                $scope.changePageFun(page_number);
            }
        })
    };
    // 分页结束

    $scope.seeRunResultDes = function (id) {
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/case/result/detail/' + id + '/?format=json',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
            //console.info('执行结果列表方法-success' + data);
            if (data.code === 200 || data.code === '200'){
                $scope.itemDetail = data.result;
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('查看执行结果详情失败');
        });
    };
}
/**
 * Pass all functions into module
 */
angular
    .module('inspinia')
    .controller('RunResult', RunResult); // 测试结果 --->  执行结果
