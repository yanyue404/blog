/**
 * Created by Administrator on 2017/4/27.
 */
/**
 * 测试结果-->覆盖结果
 * @param {any} $scope
 * @param {any} $rootScope
 * @param {any} $http
 * @param interface_url
 */
function CoverResult($scope, $rootScope, $http, interface_url) {
    // 覆盖结果列表
    $scope.coverResultList = [];
    // 获取覆盖结果列表
    $scope.getCoverResultList = function () {
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/coverage/result/list/?format=json',
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
                $scope.coverResultList = data.result;
                $scope.initPageCompomentFun(data.allPage);
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast(data.message);
        })
    };
    $scope.getCoverResultList(); // 渲染列表数据
    // 分页开始
    //点击分页执行的函数
    $scope.changePageFun = function (pageNumber) {
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/coverage/result/list/?format=json',
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
                $scope.coverResultList = data.result;
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


    // 新增覆盖结果初始值:
    $scope.addCoverResultNoramll = {};
    // 新增覆盖结果
    $scope.addCoverResult = function () {

    };


    $scope.systemNameList = []; // 系统列表
    $scope.envList = []; // 环境列表


    // 查看覆盖结果详情
    $scope.coverResultListDetail = {};
    $scope.seeCoverResultDes = function (itemId) {
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/coverage/result/detail/' + itemId + '/?format=json',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
            if (data.code === 200 || data.code === '200'){
                $scope.coverResultListDetail = data.result;
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            // console.log('查看覆盖结果详情-error', data);
            $rootScope.showToast('查看覆盖结果详情失败');
        })
    };
}
/**
 * Pass all functions into module
 */
angular
    .module('inspinia')
    .controller('CoverResult', CoverResult); // 测试结果==覆盖结果
