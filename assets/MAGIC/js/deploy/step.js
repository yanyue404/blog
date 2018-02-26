/**
 * Created by Administrator on 2017/4/27.
 */
/**
 * 统一部署-->构建步骤==0317
 * @param {any} $scope
 * @param {any} $rootScope
 * @param {any} $http
 */
function deployment_step($scope, $rootScope, $http, interface_url) {
    // 获取部署类型列表
    $scope.deployTypeList = [];
    $scope.getDeployTypeList = function () {
        if ($scope.deployTypeList.length == 0) {
            $http({
                'method': 'GET',
                'url': interface_url + '/gdc/build/type/?format=json',
                'headers': {
                    'Authorization': 'Token ' + localStorage.getItem('auth_token')
                }
            }).success(function (data) {
                if (data.code === 200 || data.code === '200'){
                    if (data.result) {
                        $scope.deployTypeList = data.result;
                    }
                }
            }).error(function (data) {
            });
        }
    };
    $scope.getDeployTypeList();
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
            build_type: '',
            name: '',
            description: '',
            is_active: false
        }
    };
    // 打开新增页面，初始化参数，配置dialog的内容
    $scope.openStep = function () {
        $scope.initParam();
        $scope.dialog = {
            header: '新增构建步骤',
            input_isClick: false,
            add: true,
            status: 'create'
        };
    };
    $scope.stepList = [];
// 获取构建步骤列表接口
    $scope.getStepList = function () {
        $scope.pageNum=1;
        $http({
            'method': 'GET',
            'url': interface_url + '/gdc/jobstep/?format=json',
            'params': {
                'is_active': 'all',
                'page': 1
            },
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if (data.code === 200 || data.code === '200'){
                if (data.result) {
                    $scope.stepList = data.result;
                    $scope.initPageCompomentFun(data.allPage);
                }
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            $rootScope.showToast('获取构建步骤列表失败');
        });
    };
    // 调用构建步骤接口
    $scope.getStepList();
    // 分页开始
    //点击分页执行的函数
    $scope.changePageFun = function (pageNumber) {
        $http({
            'method': 'GET',
            'url': interface_url + '/gdc/jobstep/?format=json',
            'params': {
                'page': pageNumber,
                'is_active': 'all',
            },
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if (data.code === 200 || data.code === '200'){
                $scope.stepList = data.result;
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
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
    // 确认添加
    $scope.addStepConfirm = function () {
        var params = {
            build_type: $scope.params.build_type.uuid,
            name: $scope.params.name,
            description: $scope.params.description,
            is_active: $scope.params.is_active
        };
        $http({
            'method': 'POST',
            'url': interface_url + '/gdc/jobstep/',
            'data': params,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            $rootScope.showToast('添加构建步骤成功');
            $('#myModal').modal('hide');
            $scope.getStepList();
        }).error(function (data) {
            $rootScope.showToast('添加构建步骤失败');
            // $('#myModal').modal('hide');
        })
    };
    /**
     * 查看构建步骤
     * @param  {[string]} itemId [查看某条代码分支的id]
     * @return {[type]}        [description]
     */
    $scope.seeStep = function (itemId) {
        $scope.dialog = {
            header: '查看',
            input_isClick: true,
            detail: true,
            status: 'see'
        };
        $scope.getStepDetail(itemId);
    };

    // 通过id查看构建步骤的方法
    $scope.getStepDetail = function (id) {
        $http({
            'method': 'GET',
            'url': interface_url + '/gdc/jobstep/' + id + '/',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            $scope.params = data.result;
            // 查看某个代码分支的情况下，将之前保存的数据渲染出来
            if ($scope.dialog.status === 'see' || $scope.dialog.status === 'modify') {
                // 渲染数据仓库
                for (var i = 0; i < $scope.deployTypeList.length; i++) {
                    if ($scope.deployTypeList[i].uuid == data.result.build_type) {
                        $scope.params.build_type = $scope.deployTypeList[i];
                        break;
                    }
                }
            }
        }).error(function (data) {
            $rootScope.showToast('查看构建步骤失败');
        });
    };

    // 要修改的id
    $scope.editStepId = '';
    /**
     * [editCase 修改情况下]
     * @param  {[string]} itemId [修改代码分支的id
     * @return {[type]}        [description]
     */
    $scope.editStep = function (itemId) {
        $scope.dialog = {
            header: '修改',
            input_isClick: false,
            add:true,
            status: 'modify'
        };
        $scope.editStepId = itemId;
        $scope.getStepDetail(itemId);
    };
    // 确认修改构建步骤
    $scope.editStepConfirm = function () {
        var params = {
            build_type: $scope.params.build_type.uuid,
            name: $scope.params.name,
            description: $scope.params.description,
            is_active: $scope.params.is_active
        };
        $http({
            'method': 'POST',
            'url': interface_url + '/gdc/jobstep/' + $scope.editStepId +'/',
            'data': params,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if (data.code === 202 || data.code === '202'){
                $rootScope.showToast('修改构建步骤成功');
                // 初始化页面调用代码分支列表
                $scope.getStepList();
                $("#myModal").modal('hide');
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            $rootScope.showToast('修改构建步骤失败');
        })
    };
    // 删除某条构建步骤
    $scope.delStepId = '';
    // 获取某条要删除代码分支的id
    $scope.delStep = function (itemId, index) {
        $scope.delStepId = itemId;
        $scope.delIndex = index;
        $scope.dialog = {
            header: '删除',
            status: 'del'
        };
    };
    // 确认删除代码分支
    $scope.delStepConfirm = function () {
        $http({
            'method': 'DELETE',
            'url': interface_url + '/gdc/jobstep/' + $scope.delStepId + '/',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if (data.code === 204 || data.code === '204'){
                $rootScope.showToast('删除构架步骤成功');
                // 初始化页面调用代码分支列表
                $scope.getStepList();
                $("#DisableModel").modal('hide');
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            $rootScope.showToast('删除构建步骤失败');
        })
    };

    // 禁用某条构建步骤
    $scope.disableStepId = '';
    $scope.disableStep = function (itemId, index) {
        $scope.disableStep = itemId;
        $scope.disableIndex = index;
        $scope.dialog = {
            header: '禁用',
            status: 'disable'
        };
    };
    // 确认禁用某条代码分支
    $scope.disableStepConfirm = function () {
        $http({
            'method': 'POST',
            'url': interface_url + '/gdc/jobstep/' + $scope.disableStep + '/',
            'data': {
                'is_active': false
            },
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if (data.code === 202 || data.code === '202'){
                $rootScope.showToast('禁用构建步骤成功');
                $scope.stepList[$scope.disableIndex].is_active = false;
                $("#DisableModel").modal('hide');
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            $rootScope.showToast('禁用构建步骤失败');
        });
    };
}
/**
 * Pass all functions into module
 */
angular
    .module('inspinia')
    .controller('deployment_step', deployment_step)    // 统一部署===构建步骤
