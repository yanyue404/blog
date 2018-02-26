/**
 * Created by zxh on 2017/4/26.
 */
/**
 * 基本信息===部门
 */
function backDepartment($scope, $rootScope, $http, interface_url) {
    // 0411==zxh==校验名称不能输入中文==bug33
    // $scope.checkChina = function (val) {
    //     if(val){
    //         $scope.reg=/^[\u4e00-\u9fa5]{0,}$/;

    //         if ($scope.reg.test(val)) {
    //         }else {
    //             $rootScope.showToast('请输入中文');
    //         }
    //     }
    // };
    $scope.isForbid = '禁用';
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
    $scope.isActiveMethod = function () {
        $scope.addInfo.isActive = !$scope.addInfo.isActive;
    };
    // 新增部门
    $scope.addDepartmentMethod = function () {
        // if (!$scope.addInfo.departmentName) {
        //     $rootScope.showToast('请填写部门名称');
        //     return;
        // } 
        // else {
            // $scope.reg= /^\w+$/;
            //  $scope.reg=/^[\u4e00-\u9fa5]{0,}$/;
        //     if ($scope.reg.test($scope.addInfo.departmentName)) {
        //     }else {
        //         // $rootScope.showToast('部门名称限字母、数字和下划线');
        //         $rootScope.showToast('请输入十位以内中文');
        //         return;
        //     }
        // }
        // if (!$scope.addInfo.departmentDes) {
        //     $rootScope.showToast('请填写部门描述');
        //     return;
        // }
        // 添加部门请求接口的参数
        var addDepartmentPostParam = {
            name: $scope.addInfo.departmentName,
            // description: $scope.addInfo.departmentDes,
            is_active: $scope.addInfo.isActive
        };
        $http({
            'method': 'POST',
            'url': interface_url + '/interface/department/add/',
            'data': addDepartmentPostParam,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
                $('#myModal').modal('hide');
            }else if (data.code === 201 || data.code === '201'){
                $scope.departList.push(data.result);
                // 重置弹窗的内容
                $scope.addInfo = {
                    departmentName:'', // 部门名称
                    // departmentDes: '', // 部门描述
                    isActive: false // 是否启用部门
                };
                $scope.getDepartmentMethod('departList');
                $scope.isActiveMethod(); //重置勾选按钮默认状态
                $('#myModal').modal('hide'); // 隐藏模态窗
                $rootScope.showToast(data.message);
            } else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            $rootScope.showToast(data.name[0]);
        });
    };
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
        $scope.EditIsActiveMethod = function () {
            $scope.editInfo.is_active = !$scope.editInfo.is_active;
        };
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
    // 要禁用的id
    $scope.DisableDepartmentId = '';
    // 部门禁用
    $scope.DisableDepartment = function (itemId) {
        $scope.DisableDepartmentId = itemId
    };
    // 确认禁用
    $scope.disableDepartmentMethod = function () {
        var urlPath = interface_url + '/interface/department/detail/' + $scope.DisableDepartmentId + '/update/';
        $http({
            'method': 'PATCH',
            'url': urlPath,
            'data': {
                'is_active':false
            },
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
                $("#disableDepartment").modal('hide');
            }else if (data.code === 202 || data.code === '202'){
                $rootScope.showToast('禁用部门成功');
                $scope.getDepartmentMethod('departList'); // 获取部门列表
                $("#disableDepartment").modal('hide');
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            $rootScope.showToast('禁用部门失败');
            // $("#disableDepartment").modal('hide');
        });
    };
    // 部门删除
    $scope.delDepartment = function (itemId) {
        // 确认删除
        $scope.sureDel = function () {
            $http({
                'method': 'DELETE',
                'url': interface_url + '/interface/department/detail/' + itemId + '/del/',
                'headers': {
                    'Authorization': 'Token ' + localStorage.getItem('auth_token')
                }
            }).success(function (data) {
                if(data.code === 403 || data.code === '403') {
                    $rootScope.showLogin();
                }else if (data.code === 204 || data.code === '204'){
                    // 在总列表里查找删除的是那一项,然后将其删掉
                    for (var i = 0; i < $scope.departList.length; i++) {
                        if (itemId === $scope.departList[i].uuid) {
                            $scope.departList = $scope.departList.slice(0, i).concat($scope.departList.slice(i + 1));
                        }
                    }
                    $rootScope.showToast('删除部门成功');
                }else {
                    $rootScope.showToast(data.message);
                }
            }).error(function (data) {
                $rootScope.showToast('删除部门失败');
            });
        }
    };
}
/**
 * Pass all functions into module
 */
angular
    .module('inspinia')
    .controller('backDepartment', backDepartment) // 后台部门列表