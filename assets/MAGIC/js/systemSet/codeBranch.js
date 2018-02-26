/**
 * Created by zxh on 2017/4/26.
 */
/**
 * 系统配置==代码分支==0316
 */
function backSysConfig_codeBranch($scope, $rootScope, $http, interface_url) {
    // 获取数据仓库列表
    $scope.dataStorageList = [];
    $scope.getDataStorageList = function () {
        if ($scope.dataStorageList.length === 0) {
            $http({
                'method': 'GET',
                'url': interface_url + '/gdc/warehouse/?format=json',
                'headers': {
                    'Authorization': 'Token ' + localStorage.getItem('auth_token')
                }
            }).success(function (data) {
                if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
                }else {
                if (data.code === 200 || data.code === '200'){
                    $scope.dataStorageList = data.result;
                    $scope.queryStorageList = data.result;
                }else {
                    $rootScope.showToast(data.message);
                }
            }}).error(function (data) {
            });
        }
    };
    $scope.getDataStorageList();
    // 点击查询==0425==bug167
    $scope.queryCase = function () {
        $scope.pageNum=1;
        $scope.forInitPage = false;
        $scope.CodeBranchuuid = $scope.queryCodeBranchParam.dataStorage.uuid;
        var sendData = {
            'warehouse': $scope.CodeBranchuuid,
            'page':1,
            'is_active': 'all'
        };
        $http({
            'method': 'GET',
            'url': interface_url + '/gdc/branch/?format=json',
            'params': sendData,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
            if (data.code === 200 || data.code === '200'){
                $scope.initPageCompomentFun(data.allPage,".forSearch .tcdPageCode");
                $scope.codeBranchList = data.result;
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('查询失败');
        })
    };
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
            dataStorageName: '',
            types_of:'',
            name: '',
            is_active: false
        }
    };
    // 打开新增页面，初始化参数，配置dialog的内容
    $scope.openCodeBranch = function () {
        $scope.initParam();
        $scope.dialog = {
            header: '新增代码分支',
            input_isClick: false,
            add: true,
            status: 'create'
        };
    };
    $scope.codeBranchList = [];
// 获取代码分支列表接口
    $scope.getCodeBranchList = function () {
        $scope.pageNum=1;
        $scope.forInitPage = true;
        $http({
            'method': 'GET',
            'url': interface_url + '/gdc/branch/?format=json',
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
                    $scope.codeBranchList = data.result;
                    $scope.initPageCompomentFun(data.allPage,".forInit .tcdPageCode");
                }
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('获取代码分支列表失败');
        });
    };
    // 调用代码分支接口
    $scope.getCodeBranchList();
    // 分页开始
    //点击分页执行的函数
    $scope.changePageFun = function (pageNumber) {
        $http({
            'method': 'GET',
            'url': interface_url + '/gdc/branch/?format=json',
            'params': {
                'page': pageNumber,
                'is_active': 'all',
                'warehouse': $scope.CodeBranchuuid?$scope.CodeBranchuuid:'',
            },
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
            if (data.code === 200 || data.code === '200'){
                $scope.codeBranchList = data.result;
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            console.info('获取列表方法-分页error');
        })
    };
    //创建分页
    $scope.initPageCompomentFun = function (count,select) {
        $(select).createPage({
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
    $scope.addCodeBranchConfirm = function () {
        var params = {
            warehouse: $scope.params.dataStorageName.uuid,
            types_of: $scope.params.types_of,
            name: $scope.params.name,
            is_active: $scope.params.is_active
        };
        $http({
            'method': 'POST',
            'url': interface_url + '/gdc/branch/',
            'data': params,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $('#myModal').modal('hide');
                $rootScope.showLogin();
            }else {
            if (data.code === 201 || data.code === '201'){
                $rootScope.showToast('添加代码分支成功');
                $('#myModal').modal('hide');
                $scope.getCodeBranchList();
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('添加代码分支失败');
            // $('#myModal').modal('hide');
        })
    };
    /**
     * 查看代码分支
     * @param  {[string]} itemId [查看某条代码分支的id]
     * @return {[type]}        [description]
     */
    $scope.seeCodeBranch = function (itemId) {
        $scope.dialog = {
            header: '查看',
            input_isClick: true,
            detail: true,
            status: 'see'
        };
        $scope.getCodeBranchDetail(itemId);
    };

    // 通过id查看代码分支的方法
    $scope.getCodeBranchDetail = function (id) {
        $http({
            'method': 'GET',
            'url': interface_url + '/gdc/branch/' + id + '/',
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
                    //渲染类型
                    if (data.result.types_of === '0') {
                        $scope.params.source_type = '0';
                    }else if (data.result.types_of === '1') {
                        $scope.params.source_type = '1';
                    }
                    // 渲染数据仓库
                    for (var i = 0; i < $scope.dataStorageList.length; i++) {
                        if ($scope.dataStorageList[i].uuid === data.result.warehouse) {
                            $scope.params.dataStorageName = $scope.dataStorageList[i];
                            break;
                        }
                    }
                }
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('查看代码分支失败');
        });
    };

    // 要修改的id
    $scope.editCodeBranchId = '';
    /**
     * [editCase 修改情况下]
     * @param  {[string]} itemId [修改代码分支的id
     * @return {[type]}        [description]
     */
    $scope.editCodeBranch = function (itemId) {
        $scope.dialog = {
            header: '修改',
            input_isClick: false,
            add:true,
            status: 'modify'
        };
        $scope.editCodeBranchId = itemId;
        $scope.getCodeBranchDetail(itemId);
    };
    // 确认修改代码分支
    $scope.editCodeBranchConfirm = function () {
        var params = {
            warehouse: $scope.params.dataStorageName.uuid,
            types_of: $scope.params.types_of,
            name: $scope.params.name,
            is_active: $scope.params.is_active
        };
        $http({
            'method': 'POST',
            'url': interface_url + '/gdc/branch/' + $scope.editCodeBranchId +'/',
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
                $rootScope.showToast('修改代码分支成功');
                // 初始化页面调用代码分支列表
                $scope.getCodeBranchList();
                $("#myModal").modal('hide');
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('修改代码分支失败');
        })
    };
    // 删除某条代码分支库
    $scope.delCodeBranchId = '';
    // 获取某条要删除代码分支的id
    $scope.delCodeBranch = function (itemId, index) {
        $scope.delCodeBranchId = itemId;
        $scope.delIndex = index;
        $scope.dialog = {
            header: '删除',
            status: 'del'
        };
    };
    // 确认删除代码分支
    $scope.delCodeBranchConfirm = function () {
        $http({
            'method': 'DELETE',
            'url': interface_url + '/gdc/branch/' + $scope.delCodeBranchId + '/',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $("#disableModel").modal('hide');
                $rootScope.showLogin();
            }else {
            if (data.code === 204 || data.code === '204'){
                $rootScope.showToast('删除代码分支成功');
                // 初始化页面调用代码分支列表
                $scope.getCodeBranchList();
                $("#DisableModel").modal('hide');
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('删除代码分支失败');
        })
    };

    // 禁用某条代码分支
    $scope.disableCodeBranchId = '';
    $scope.disableCodeBranch = function (itemId, index) {
        $scope.disableCodeBranch = itemId;
        $scope.disableIndex = index;
        $scope.dialog = {
            header: '禁用',
            status: 'disable'
        };
    };
    // 确认禁用某条代码分支
    $scope.disableCodeBranchConfirm = function () {
        $http({
            'method': 'POST',
            'url': interface_url + '/gdc/branch/' + $scope.disableCodeBranch + '/',
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
                $rootScope.showToast('禁用代码分支成功');
                $scope.codeBranchList[$scope.disableIndex].is_active = false;
                $("#DisableModel").modal('hide');
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('禁用代码分支失败');
        });
    };
}
/**
 * Pass all functions into module
 */
angular
    .module('inspinia')
    .controller('backSysConfig_codeBranch', backSysConfig_codeBranch); // 系统配置==代码分支