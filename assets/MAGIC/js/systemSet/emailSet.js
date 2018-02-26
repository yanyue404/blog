/**
 * Created by Administrator on 2017/4/26.
 */
/**
 * 系统配置==邮箱配置==0319
 */
function backSysConfig_emailSet($scope, $rootScope, $http, interface_url) {
    // dialog配置
    $scope.dialog = {
        header: '',
        input_isClick: false,
        detail: false,
        add: false,
        status: ''
    };
    // 初始化参数，清空新增完保存的数据
    $scope.initParam = function () {
        $scope.params = {
            name: '',
            login_user: '',
            password: '',
            smtp: '',
            pop3: '',
            is_active: false
        }
    };
    // 打开新增页面，初始化参数，配置dialog的内容
    $scope.openEmailSet = function () {
        $scope.initParam();
        $scope.dialog = {
            header: '新增',
            input_isClick: false,
            add: true,
            status: 'create'
        };
    };
    $scope.emailSetList = [];
// 获取列表接口
    $scope.getEmailSetList = function () {
        $scope.pageNum=1;
        $http({
            'method': 'GET',
            'url': interface_url + '/gdc/mail/',
            'params': {
                'is_active': 'all',
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
                    $scope.emailSetList = data.result;
                    $scope.initPageCompomentFun(data.allPage);
                }
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('获取列表失败');
        });
    };
    // 调用接口
    $scope.getEmailSetList();
    // 分页开始
    //点击分页执行的函数
    $scope.changePageFun = function (pageNumber) {
        $http({
            'method': 'GET',
            'url': interface_url + '/gdc/mail/',
            'params': {
                'page': pageNumber,
                'is_active': 'all',
            },
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
            if (data.code === 200 || data.code === '200'){
                $scope.emailSetList = data.result;
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            console.info('获取列表方法-分页error');
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
    // 确认添加
    $scope.addEmailSetConfirm = function () {
        var params = {
            name: $scope.params.name,
            login_user: $scope.params.login_user,
            password: $scope.params.password,
            smtp: $scope.params.smtp,
            pop3: $scope.params.pop3,
            is_active: $scope.params.is_active
        };
        $http({
            'method': 'POST',
            'url': interface_url + '/gdc/mail/',
            'data': params,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
            if (data.code === 201 || data.code === '201'){
                $rootScope.showToast('添加邮箱配置成功');
                $('#myModal').modal('hide');
                $scope.getEmailSetList();
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('添加邮箱配置失败');
            // $('#myModal').modal('hide');
        })
    };
    /**
     * 查看邮箱配置
     * @param  {[string]} itemId [查看某条代码分支的id]
     * @return {[type]}        [description]
     */
    $scope.seeEmailSet = function (itemId) {
        $scope.dialog = {
            header: '查看',
            input_isClick: true,
            detail: true,
            status: 'see'
        };
        $scope.getEmailSetDetail(itemId);
    };

    // 通过id查看邮箱配置的方法
    $scope.getEmailSetDetail = function (id) {
        $http({
            'method': 'GET',
            'url': interface_url + '/gdc/mail/' + id + '/',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
            if (data.code === 200 || data.code === '200'){
                $scope.params = data.result;
                // 查看某个代码分支的情况下，将之前保存的数据渲染出来
                if ($scope.dialog.status === 'see' || $scope.dialog.status === 'modify') {
                }
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('查看失败');
        });
    };

    // 要修改的id
    $scope.editEmailSetId = '';
    /**
     * [editCase 修改情况下]
     * @param  {[string]} itemId [修改代码分支的id
     * @return {[type]}        [description]
     */
    $scope.editEmailSet = function (itemId) {
        $scope.dialog = {
            header: '修改',
            input_isClick: false,
            add:true,
            status: 'modify'
        };
        $scope.editEmailSetId = itemId;
        $scope.getEmailSetDetail(itemId);
    };
    // 确认修改
    $scope.editEmailSetConfirm = function () {
        var params = {
            name: $scope.params.name,
            login_user: $scope.params.login_user,
            password: $scope.params.password,
            smtp: $scope.params.smtp,
            pop3: $scope.params.pop3,
            is_active: $scope.params.is_active
        };
        $http({
            'method': 'POST',
            'url': interface_url + '/gdc/mail/' + $scope.editEmailSetId +'/',
            'data': params,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
            if (data.code === 202 || data.code === '202'){
                $rootScope.showToast('修改成功');
                // 初始化页面调用代码分支列表
                $scope.getEmailSetList();
                $("#myModal").modal('hide');
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('修改失败');
        })
    };
    // 删除某条
    $scope.delEmailSetId = '';
    // 获取某条要删除代码分支的id
    $scope.delEmailSet = function (itemId, index) {
        $scope.delEmailSetId = itemId;
        $scope.delIndex = index;
        $scope.dialog = {
            header: '删除',
            status: 'del'
        };
    };
    // 确认删除
    $scope.delEmailSetConfirm = function () {
        $http({
            'method': 'DELETE',
            'url': interface_url + '/gdc/mail/' + $scope.delEmailSetId + '/',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $("#disableModel").modal('hide');
                $rootScope.showLogin();
            }else {
            if (data.code === 204 || data.code === '204'){
                $rootScope.showToast('删除成功');
                // 初始化页面调用代码分支列表
                $scope.getEmailSetList();
                $("#DisableModel").modal('hide');
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('删除失败');
        })
    };

    // 禁用某条代码分支
    $scope.disableEmailSetId = '';
    $scope.disableEmailSet = function (itemId, index) {
        $scope.disableEmailSet = itemId;
        $scope.disableIndex = index;
        $scope.dialog = {
            header: '禁用',
            status: 'disable'
        };
    };
    // 确认禁用某条代码分支
    $scope.disableEmailSetConfirm = function () {
        $http({
            'method': 'POST',
            'url': interface_url + '/gdc/mail/' + $scope.disableEmailSet + '/',
            'data': {
                'is_active': false
            },
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $("#disableModel").modal('hide');
                $rootScope.showLogin();
            }else {
            if (data.code === 202 || data.code === '202'){
                $rootScope.showToast('禁用成功');
                $scope.emailSetList[$scope.disableIndex].is_active = false;
                $("#DisableModel").modal('hide');
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('禁用失败');
        });
    };
}
/**
 * Pass all functions into module
 */
angular
    .module('inspinia')
    .controller('backSysConfig_emailSet', backSysConfig_emailSet); // 系统配置==邮箱配置