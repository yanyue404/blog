/**
 * Created by Administrator on 2017/4/26.
 */
/**
 * 系统配置==发送邮箱配置==0319
 */
function backSysConfig_emailSendSet($scope, $rootScope, $http, interface_url) {
    // 获取邮箱配置列表
    $scope.emailSendSetMailList = [];
    $scope.getMailList = function () {
        if ($scope.emailSendSetMailList.length === 0) {
            $http({
                'method': 'GET',
                'url': interface_url + '/gdc/mail/',
                'headers': {
                    'Authorization': 'Token ' + localStorage.getItem('auth_token')
                }
            }).success(function (data) {
                if(data.code === 403 || data.code === '403'){
                    $rootScope.showLogin();
                }else {
                if (data.code === 200 || data.code === '200'){
                    $scope.emailSendSetMailList = data.result;
                }else {
                    $rootScope.showToast(data.message);
                }
            }}).error(function (data) {
            });
        }
    };
    $scope.getMailList();
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
            mail:'',
            url: '',
            user_to: '',
            user_cc: '',
            user_bc: '',
            subject: '',
            mime_text: '',
            is_active: false
        }
    };
    // 打开新增页面，初始化参数，配置dialog的内容
    $scope.openEmailSendSet = function () {
        $scope.initParam();
        $scope.dialog = {
            header: '新增',
            input_isClick: false,
            add: true,
            status: 'create'
        };
    };
    $scope.emaiSendSetList = [];
// 获取列表接口
    $scope.getEmailSendSetList = function () {
        $scope.pageNum=1;
        $http({
            'method': 'GET',
            'url': interface_url + '/gdc/sendmail/',
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
                    $scope.emailSendSetList = data.result;
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
    $scope.getEmailSendSetList();
    // 分页开始
    //点击分页执行的函数
    $scope.changePageFun = function (pageNumber) {
        $http({
            'method': 'GET',
            'url': interface_url + '/gdc/sendmail/',
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
                $scope.emailSendSetList = data.result;
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
    $scope.addEmailSendSetConfirm = function () {
        var params = {
            name: $scope.params.name,
            mail:$scope.params.mail.uuid,
            url: $scope.params.url,
            user_to: $scope.params.user_to,
            user_cc: $scope.params.user_cc,
            user_bc: $scope.params.user_bc,
            subject: $scope.params.subject,
            mime_text: $scope.params.mime_text,
            is_active: $scope.params.is_active
        };
        $http({
            'method': 'POST',
            'url': interface_url + '/gdc/sendmail/',
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
                $rootScope.showToast('添加邮箱配置成功');
                $('#myModal').modal('hide');
                $scope.getEmailSendSetList();
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
    $scope.seeEmailSendSet = function (itemId) {
        $scope.dialog = {
            header: '查看',
            input_isClick: true,
            detail: true,
            status: 'see'
        };
        $scope.getEmailSendSetDetail(itemId);
    };

    // 通过id查看邮箱配置的方法
    $scope.getEmailSendSetDetail = function (id) {
        $http({
            'method': 'GET',
            'url': interface_url + '/gdc/sendmail/' + id + '/',
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
                    // 渲染邮箱
                    for (var i = 0; i < $scope.emailSendSetMailList.length; i++) {
                        if ($scope.emailSendSetMailList[i].uuid === data.result.mail) {
                            $scope.params.mail = $scope.emailSendSetMailList[i];
                            break;
                        }
                    }
                }
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('查看失败');
        });
    };

    // 要修改的id
    $scope.editEmailSendSetId = '';
    /**
     * [editCase 修改情况下]
     * @param  {[string]} itemId [修改代码分支的id
     * @return {[type]}        [description]
     */
    $scope.editEmailSendSet = function (itemId) {
        $scope.dialog = {
            header: '修改',
            input_isClick: false,
            add:true,
            status: 'modify'
        };
        $scope.editEmailSendSetId = itemId;
        $scope.getEmailSendSetDetail(itemId);
    };
    // 确认修改
    $scope.editEmailSendSetConfirm = function () {
        var params = {
            name: $scope.params.name,
            mail:$scope.params.mail.uuid,
            url: $scope.params.url,
            user_to: $scope.params.user_to,
            user_cc: $scope.params.user_cc,
            user_bc: $scope.params.user_bc,
            subject: $scope.params.subject,
            mime_text: $scope.params.mime_text,
            is_active: $scope.params.is_active
        };
        $http({
            'method': 'POST',
            'url': interface_url + '/gdc/sendmail/' + $scope.editEmailSendSetId +'/',
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
                $rootScope.showToast('修改成功');
                // 初始化页面调用代码分支列表
                $scope.getEmailSendSetList();
                $("#myModal").modal('hide');
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast(data);
        })
    };
    // 删除某条
    $scope.delEmailSendSetId = '';
    // 获取某条要删除代码分支的id
    $scope.delEmailSendSet = function (itemId, index) {
        $scope.delEmailSendSetId = itemId;
        $scope.delIndex = index;
        $scope.dialog = {
            header: '删除',
            status: 'del'
        };
    };
    // 确认删除
    $scope.delEmailSendSetConfirm = function () {
        $http({
            'method': 'DELETE',
            'url': interface_url + '/gdc/sendmail/' + $scope.delEmailSendSetId + '/',
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
                $scope.getEmailSendSetList();
                $("#DisableModel").modal('hide');
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('删除失败');
        })
    };

    // 禁用某条代码分支
    $scope.disableEmailSendSetId = '';
    $scope.disableEmailSendSet = function (itemId, index) {
        $scope.disableEmailSendSet = itemId;
        $scope.disableIndex = index;
        $scope.dialog = {
            header: '禁用',
            status: 'disable'
        };
    };
    // 确认禁用某条代码分支
    $scope.disableEmailSendSetConfirm = function () {
        $http({
            'method': 'POST',
            'url': interface_url + '/gdc/sendmail/' + $scope.disableEmailSendSet + '/',
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
                $scope.emailSendSetList[$scope.disableIndex].is_active = false;
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
    .controller('backSysConfig_emailSendSet', backSysConfig_emailSendSet); // 系统配置==发送邮箱配置
