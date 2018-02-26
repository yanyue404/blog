/**
 * Created by mustang on 2017/10/21.
 */
function businessResult($scope, $rootScope, $http, interface_url, result_url) {
    $scope.result_url = result_url;
    $scope.showResult_status = function (val) { // 0325
        if (val === 'fail') {
            return '失败';
        }
        if (val === 'pass') {
            return '成功';
        }
        if (val === 'running') {
            return '运行中';
        }
    };
    $scope.interface_url = interface_url;
    // dialog配置
    $scope.dialog = {
        header: '',
        input_isClick: false,
        detail: false,
        add: false,
        status: ''
    };
    $scope.resultList = [];
// 获取列表接口
    $scope.getStepList = function () {
        $scope.pageNum=1;
        $http({
            'method': 'GET',
            'url': interface_url + '/uasc/result/',
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
                if (data.result) {
                    $scope.resultList = data.result;
                    $scope.initPageCompomentFun(data.allPage);
                }
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('获取结果列表失败');
        });
    };
    // 调用构建结果接口
    $scope.getStepList();
    // 分页开始

    //点击分页执行的函数
    $scope.changePageFun = function (pageNumber) {
        $http({
            'method': 'GET',
            'url': interface_url + '/uasc/result/',
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
                $scope.resultList = data.result;
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            console.info('执行结果列表方法-分页error');
        })
    };
    //创建分页
    $scope.initPageCompomentFun = function (count) {
        $(".back-server-frame .tcdPageCode").createPage({
            pageCount : count,
            current: 1,
            backFn: function (page_number) {
                $scope.pageNum=page_number;
                $scope.changePageFun(page_number);
            }
        })
    };
    // 分页结束
    /**
     * 查看结果
     * @param  {[string]} itemId [查看某条代码分支的id]
     * @return {[type]}        [description]
     */
    $scope.seeResult = function (itemId) {
        $scope.dialog = {
            header: '查看',
            input_isClick: true,
            detail: true,
            status: 'see'
        };
        // console.log(itemId);
        $scope.getResultDetail(itemId);
    };
    // 通过id查看构建结果的方法
    $scope.getResultDetail = function (id) {
        $http({
            'method': 'GET',
            'url': interface_url + '/uasc/result/' + id + '/',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
            if (data.code === 200 || data.code === '200'){
                $scope.params = data.result;
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('查看构建结果失败');
        });
    };
}
 /**
 * Pass all functions into module
 * 业务管理--业务结果
 */
 angular
  .module('inspinia')
  .controller('businessResult', businessResult)