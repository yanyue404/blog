/**
 * Created by zxh on 2017/4/26.
 */
/**
 * 基本信息===部门
 */
function backSysConfig_baseInfo($scope, $rootScope, $http, interface_url) {
    // $scope.isForbid = '禁用';
    $scope.addInfo = {
        departmentName: '', // 部门名称
        // departmentDes: '', // 部门描述
        isActive: false // 是否启用部门
    };
    $scope.departList = []; // 部门列表
    $('#myModal').modal('hide'); //隐藏模态窗
    // 分页开始
    //点击分页执行的函数
    $scope.changePageFun = function (pageNumber) {
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/department/list/?format=json',
            'params': {
                'page': pageNumber,
                'is_active': 'all'
            },
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            }else if (data.code === 200 || data.code === '200'){
                $scope.departList = data.result;
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            $rootScope.showToast(data.message);
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
    // 部门列表方法
    $scope.getDepartmentMethod = function (obj) {
        $scope.pageNum=1;
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/department/list/?format=json',
            'params': {
                'is_active': 'all',
                'page':'1'
            },
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            }else if (data.code === 200 || data.code === '200'){
                $scope[obj] = data.result;
                $scope.initPageCompomentFun(data.allPage,".forSearch .tcdPageCode");
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            $rootScope.showToast('部门列表-error');
        });
    };
    // 获取部门列表
    $scope.getDepartmentMethod('departList');
    // 是否启用部门
    // $scope.isActiveMethod = function () {
    //     $scope.addInfo.isActive = !$scope.addInfo.isActive;
    // };
    
    // 查看部门相关属性
    $scope.seeInfo = {};
    // 查看部门详情
    $scope.seeDepartmentDes = function (itemId) {
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/department/detail/' + itemId + '/?format=json',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            }else if (data.code === 200 || data.code === '200'){
                $scope.seeInfo = data.result;
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            $rootScope.showToast('详情查看失败');
        })
    };
    // 修改部门
    $scope.editDepartmentDes = function (itemId) {
        // 该部门的值
        $scope.editInfo = {};
        // 查看详情接口
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/department/detail/' + itemId + '/?format=json',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            }else if (data.code === 200 || data.code === '200'){
                $scope.editInfo = data.result;
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            $rootScope.showToast('详情查看失败');
        });
        // 是否启用部门
        // $scope.EditIsActiveMethod = function () {
        //     $scope.editInfo.is_active = !$scope.editInfo.is_active;
        // };
        // 确认更改
        $scope.EditDepartmentMethod = function () {
            if (!$scope.editInfo.name) {
                //$scope.validateText = '请填写部门描述';
                $rootScope.showToast('请填写部门名称');
                return;
            }
            $http({
                'method': 'PATCH',
                'url': interface_url + '/interface/department/detail/' + itemId + '/update/?format=json',
                'data': $scope.editInfo,
                'headers': {
                    'Authorization': 'Token ' + localStorage.getItem('auth_token')
                }
            }).success(function (data) {
                if(data.code === 403 || data.code === '403') {
                    $rootScope.showLogin();
                }else if (data.code === 202 || data.code === '202'){
                    $rootScope.showToast('修改部门成功');
                    $scope.getDepartmentMethod('departList'); // 重新获取部门列表
                }else {
                    $rootScope.showToast(data.message);
                }
            }).error(function (data) {
                $rootScope.showToast('修改部门失败');
            });
            $("#editDepartment").modal('hide');
        };
    };
//    $('#editBtn').modal('hide');
    $scope.editInfoModify = function(){
        console.log(111111)        
        $('#editBtn').show();
        $scope.apply();
        console.log(111111)
    }
}
/**
 * Pass all functions into module
 */
angular
    .module('inspinia')
    .controller('backSysConfig_baseInfo', backSysConfig_baseInfo) // 后台部门列表