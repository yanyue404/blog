/**
 * Created by zxh on 2017/4/26.
 */
/**
 *系统配置 === jenkins服务器==0315
 */
function backSysConfig_jenkins($scope, $rootScope, $http, interface_url) {
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
            os:'',
            name: '',
            method: '',
            address: '',
            port: '',
            param: '',
            login_user: '',
            login_password: '',
            jenkins_jobs_address: '',
            is_active: false
        };
    };
    // 打开新增页面，初始化参数，配置dialog的内容
    $scope.openJenkins = function () {
        $scope.initParam();
        $scope.dialog = {
            header: '新增jenkins服务器',
            input_isClick: false,
            add: true,
            status: 'create'
        };
    };
    $scope.jenkinsList = [];
// 获取jenkins服务器列表接口
    $scope.getJenkinsList = function () {
        $scope.pageNum=1;
        $http({
            'method': 'GET',
            'url': interface_url + '/gdc/jenkins/server/?format=json',
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
                    $scope.jenkinsList = data.result;
                    $scope.initPageCompomentFun(data.allPage);
                }
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('获取jenkins服务器数据失败');
        });
    };
    // 调用jenkins服务器接口
    $scope.getJenkinsList();
    // 分页开始
    //点击分页执行的函数
    $scope.changePageFun = function (pageNumber) {
        $http({
            'method': 'GET',
            'url': interface_url + '/gdc/jenkins/server/?format=json',
            'params': {
                'page': pageNumber,
                'is_active': 'all'
            },
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
            if (data.code === 200 || data.code === '200'){
                $scope.jenkinsList = data.result;
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {

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
    $scope.addJenkinsConfirm = function () {
        var params = {
            os: $scope.params.os,
            name: $scope.params.name,
            method: $scope.params.method,
            address: $scope.params.address,
            port: $scope.params.port,
            param: $scope.params.param,
            login_user: $scope.params.login_user,
            login_password: $scope.params.login_password,
            jenkins_jobs_address: $scope.params.jenkins_jobs_address,
            is_active: $scope.params.is_active
        };
        $http({
            'method': 'POST',
            'url': interface_url + '/gdc/jenkins/server/',
            'data': params,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $("#myModal").modal('hide');
                $rootScope.showLogin();
            }else {
            if (data.code === 201 || data.code === '201'){
                $rootScope.showToast(data.message);
                $('#myModal').modal('hide');
                $scope.getJenkinsList();
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast(data.message);
            // $('#myModal').modal('hide');
        })
    };
    /**
     * 查看Jenkins服务器
     * @param  {[string]} itemId [查看某条Jenkins服务器的id]
     * @return {[type]}        [description]
     */
    $scope.seeJenkins = function (itemId) {
        $scope.dialog = {
            header: '查看',
            input_isClick: true,
            detail: true,
            status: 'see'
        };
        $scope.getJenkinsDetail(itemId);
    };

    // 通过id查看Jenkins的方法
    $scope.getJenkinsDetail = function (id) {
        $http({
            'method': 'GET',
            'url': interface_url + '/gdc/jenkins/server/' + id + '/?format=json',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
            if (data.code === 200 || data.code === '200'){
                $scope.params = data.result;
                $scope.params.login_password = '********';
            }else {
                $rootScope.showToast(data.message);
            }
            // 查看某个用例的情况下，将之前保存的数据渲染出来
            if ($scope.dialog.status === 'see' || $scope.dialog.status === 'modify') {
            }
        }}).error(function (data) {
            $rootScope.showToast('查看Jenkins服务器失败');
        });
    };

    // 要修改的id
    $scope.editJenkinsId = '';
    /**
     * [editCase 修改情况下]
     * @param  {[string]} itemId [修改用例接口的id
     * @return {[type]}        [description]
     */
    $scope.editJenkins = function (itemId) {
        $scope.dialog = {
            header: '修改',
            input_isClick: false,
            add:true,
            status: 'modify'
        };
        $scope.editJenkinsId = itemId;
        $scope.getJenkinsDetail(itemId);
    };
    // 确认修改Jenkins服务器
    $scope.editJenkinsConfirm = function () {
        var pwdReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
        if (pwdReg.test($scope.params.login_password) || $scope.params.login_password === '********') {
            if($scope.params.login_password === '********') {
                $scope.params.login_password = '';
            }
            var params = {
                os: $scope.params.os,
                name: $scope.params.name,
                method: $scope.params.method,
                address: $scope.params.address,
                port: $scope.params.port,
                param: $scope.params.param,
                login_user: $scope.params.login_user,
                login_password: $scope.params.login_password,
                jenkins_jobs_address: $scope.params.jenkins_jobs_address,
                is_active: $scope.params.is_active
            };
            $http({
                'method': 'POST',
                'url': interface_url + '/gdc/jenkins/server/' + $scope.editJenkinsId + '/',
                'data': params,
                'headers': {
                    'Authorization': 'Token ' + localStorage.getItem('auth_token')
                }
            }).success(function (data) {
                if(data.code === 403 || data.code === '403'){
                    $("#myModal").modal('hide');
                    $rootScope.showLogin();
                }else {
                if (data.code === 202 || data.code === '202'){
                    $rootScope.showToast(data.message);
                    // 初始化页面调用Jenkins服务器列表
                    $scope.getJenkinsList();
                    $("#myModal").modal('hide');
                }else {
                    $rootScope.showToast(data.message);
                }
            }}).error(function (data) {
                $rootScope.showToast(data.message);
            })
        }else {
            $rootScope.showToast('密码必须为6-20位字母和数字混合，请检查');
        }
    };
    // 删除某条Jenkins服务器
    $scope.delJenkinsId = '';
    // 获取某条要删除Jenkins服务器的id
    $scope.delJenkins = function (itemId, index) {
        $scope.delJenkinsId = itemId;
        $scope.delIndex = index;
        $scope.dialog = {
            header: '删除',
            status: 'del'
        };
    };
    // 确认删除Jenkins服务器
    $scope.delJenkinsConfirm = function () {
        $http({
            'method': 'DELETE',
            'url': interface_url + '/gdc/jenkins/server/' + $scope.delJenkinsId + '/',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $("#DisableModel").modal('hide');
                $rootScope.showLogin();
            }else {
            if (data.code === 204 || data.code === '204'){
                $rootScope.showToast(data.message);
                // 初始化页面调用用例列表
                $scope.getJenkinsList();
                $("#DisableJenkins").modal('hide');
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast(data.message);
        })
    };

    // 禁用某条Jenkins服务器
    $scope.disableJenkinsId = '';
    $scope.disableJenkins = function (itemId, index) {
        $scope.disableJenkinsId = itemId;
        $scope.disableIndex = index;
        $scope.dialog = {
            header: '禁用',
            status: 'disable'
        };
    };
    // 确认禁用某条Jenkins服务器
    $scope.disableJenkinsConfirm = function () {
        $http({
            'method': 'POST',
            'url': interface_url + '/gdc/jenkins/server/' + $scope.disableJenkinsId + '/',
            'data': {
                'is_active': false
            },
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $("#DisableJenkins").modal('hide');
                $rootScope.showLogin();
            }else {
            if (data.code === 202 || data.code === '202'){
                $rootScope.showToast(data.message);
                $scope.jenkinsList[$scope.disableIndex].is_active = false;
                $("#DisableJenkins").modal('hide');
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast(data.message);
        });
    };
}
/**
 * Pass all functions into module
 */
angular
    .module('inspinia')
    .controller('backSysConfig_jenkins', backSysConfig_jenkins); // 系统配置 === jenkins服务器