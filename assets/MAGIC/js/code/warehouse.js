/**
 * Created by Administrator on 2017/6/8.
 */
/**
 * 代码管理==代码仓库
 */
function warehouse($scope, $rootScope, $http, interface_url) {
    // 分页开始
    //点击分页执行的函数
    $scope.changePageFun = function (pageNumber) {
        $http({
            'method': 'GET',
            'url': interface_url + '/cmc/warehouse/',
            'params': {
                'page': pageNumber,
                'is_active': 'all',
                'department': $scope.department_case,
                'product': $scope.product_case
            },
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            }else if (data.code === 200 || data.code === '200'){
                $scope.warehouseList = data.result;
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            console.info('获取列表方法-分页error');
        })
    };
    //创建分页
    $scope.initPageCompomentFun = function (count,select) {
        $(select).createPage({
            pageCount : count,
            current: 1,
            backFn: function (page_number) {
                //console.log(page_number);
                $scope.pageNum=page_number;
                $scope.changePageFun(page_number);
            }
        })
    };
    // 分页结束
    // dialog配置
    $scope.dialog = {
        header: '',
        input_isClick: false,
        detail: false,
        add: false,
        status: ''
    };
    // 1、获取列表
    $scope.warehouseList = [];
    $scope.getWarehouseList = function () {
        $scope.pageNum=1;
        $scope.forInitPage = true;
        $http({
            'method': 'GET',
            'params': {
                'page': 1
            },
            'url': interface_url + '/cmc/warehouse/',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            }else if (data.code === 200 || data.code === '200'){
                $scope.warehouseList = data.result;
                $scope.initPageCompomentFun(data.allPage,".forInit .tcdPageCode");
                //$scope.queryStorageList = data.result;
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
        });
    };
    $scope.getWarehouseList();
    // 2、查询列表
    // 获取部门
    $scope.queryDetailParam={
        department:'',
        product:'',
        warehouse:''
    };
    $scope.queryDepartmentList = [];
    $scope.getDepartmentList = function () {
        if ($scope.queryDepartmentList.length === 0) {
            $http({
                'method': 'GET',
                'url': interface_url + '/interface/department/list/?format=json',
                'headers': {
                    'Authorization': 'Token ' + localStorage.getItem('auth_token')
                }
            }).success(function (data) {
                if(data.code === 403 || data.code === '403') {
                    $rootScope.showLogin();
                }else if (data.code === 200 || data.code === '200'){
                    $scope.queryDepartmentList = data.result;
                }else {
                    $rootScope.showToast(data.message);
                }
            }).error(function (data) {
                //console.info(data);
            });
        }
    };
    $scope.getDepartmentList();
    // 先选择部门，在选择产品，根据部门选择产品
    $scope.selectedProduct = function () {
        if (!$scope.addDetailParam.product && !$scope.EditDetailProduct)return;
        // 获取当前产品下的 系统
        $scope.queryFlag = '';
        if ($scope.addDetailParam.product) {
            $scope.getCaseSystem($scope.addDetailParam.product.id);
        }
        if ($scope.EditDetailProduct) {
            $scope.getCaseSystem($scope.EditDetailProduct.id);
        }
    };
    $scope.queryFlag = 1;
    $scope.queryDepartment = function (callback) {
        if (!$scope.queryDetailParam.department)return;
        $scope.queryFlag = 1;
        var departmentid = $scope.queryDetailParam.department.id;
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/product/list/?product_id=' + departmentid,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            }else if (data.code === 200 || data.code === '200'){
                $scope.queryProductList = data.result;
                callback && callback();
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
        })
    };
    $scope.queryCaseJob = function () {
        $scope.pageNum=1;
        $scope.forInitPage = false;
        $scope.department_id = $scope.queryDetailParam.department?$scope.queryDetailParam.department.id:'';
        $scope.product_id = $scope.queryDetailParam.product?$scope.queryDetailParam.product.id:"";
        $scope.warehouse = $scope.queryDetailParam.warehouse?$scope.queryDetailParam.warehouse.uuid:'';
        $http({
            'method': 'GET',
            'url': interface_url + '/cmc/warehouse/',
            'params': {
                'product': $scope.product_id,
                'department': $scope.department_id,
                'warehouse': $scope.warehouse,
                'page': 1,
                'is_active': 'all'
            },
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            }else if (data.code === 200 || data.code === '200'){
                if (data.result) {
                    $scope.warehouseList = data.result;
                    $scope.initPageCompomentFun(data.allPage,".forSearch .tcdPageCode");
                }
            }
        }).error(function (data) {
            $rootScope.showToast('查询失败');
        });
    };

    // 初始化参数，清空新增完保存的数据
    $scope.initParam = function () {
        $scope.params = {
            productName: '',
            systemName: '',
            systemDes: '',
            is_active: false
        }
    };
    // 打开新增页面，初始化参数，配置dialog的内容
    $scope.openWarehouse = function () {
        $scope.initParam();
        $scope.dialog = {
            header: '新增代码仓库',
            input_isClick: false,
            add: true,
            status: 'create'
        };
    };
    // 获取数据仓库列表
    $scope.dataStorageList = [];
    $scope.queryWarehouselList = [];
    $scope.getDataStorageList = function () {
        if ($scope.dataStorageList.length === 0) {
            $http({
                'method': 'GET',
                'url': interface_url + '/gdc/warehouse/?format=json',
                'headers': {
                    'Authorization': 'Token ' + localStorage.getItem('auth_token')
                }
            }).success(function (data) {
                if(data.code === 403 || data.code === '403') {
                    $rootScope.showLogin();
                }else if (data.code === 200 || data.code === '200'){
                    if (data.result) {
                        $scope.dataStorageList = data.result;
                        $scope.queryWarehouselList = data.result;
                    }
                }
            }).error(function (data) {
            });
        }
    };
    $scope.getDataStorageList();

    // $scope.jobList = []; // 任务列表
    // // 获取任务的接口
    // $scope.selectWarehouse = function(){
    //     var source_warehouse = $scope.params.warehouse.uuid;
    //     $http({
    //         'method': 'GET',
    //         'url': interface_url + '/cmc/job/search/?source_warehouse='+source_warehouse,
    //         'headers': {
    //             'Authorization': 'Token ' + localStorage.getItem('auth_token')
    //         }
    //     }).success(function (data) {
    //         if (data.code === 200 || data.code === '200'){
    //             $scope.jobList = data.result;
    //         }else {
    //             $rootScope.showToast(data.message);
    //         }
    //     }).error(function (data) {
    //     });
    // };

    // 3、添加系统
    $scope.addWarehouseConfirm = function () {
        // var ware = $scope.params.job.uuid?$scope.params.job.uuid:"";
        var paramsAll = {
            'name': $scope.params.name,
            'warehouse': $scope.params.warehouse?$scope.params.warehouse.uuid:"",
            // 'job': $scope.params.job?$scope.params.job.uuid:"",
            'is_active': $scope.params.is_active
        };
        $http({
            'method': 'POST',
            'url': interface_url + '/cmc/warehouse/',
            'data': paramsAll,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
                $('#myModal').modal('hide');
            }else if (data.code === 201 || data.code === '201'){
                $rootScope.showToast('添加成功');
                $('#myModal').modal('hide');
                $scope.getWarehouseList();
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            $rootScope.showToast(data);
        })
    };
    /**
     * 3、查看
     * @param  {[string]} itemId [查看的id]
     * @return {[type]}        [description]
     */
    $scope.seeWarehouse = function (itemId) {
        $scope.dialog = {
            header: '查看',
            input_isClick: true,
            detail: true,
            status: 'see'
        };
        $scope.getWarehouseDetail(itemId);
    };
    // 通过id查看系统详情的方法
    $scope.getWarehouseDetail = function (id) {
        $http({
            'method': 'GET',
            'url': interface_url + '/cmc/warehouse/' + id + '/',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            }else if (data.code === 200 || data.code === '200'){
                $scope.params = data.result;
                if ($scope.dialog.status === 'see' || $scope.dialog.status === 'modify') {
                    // 渲染代码仓库
                    for (var i = 0; i < $scope.dataStorageList.length; i++) {
                        if ($scope.dataStorageList[i].uuid === data.result.warehouse) {
                            $scope.params.warehouse = $scope.dataStorageList[i];
                            break;
                        }
                    }
                    // var jobId = data.result.job;
                    // $http({
                    //     'method': 'GET',
                    //     'url': interface_url + '/cmc/job/search/?source_warehouse='+data.result.warehouse.uuid,
                    //     'headers': {
                    //         'Authorization': 'Token ' + localStorage.getItem('auth_token')
                    //     }
                    // }).success(function (data) {
                    //     if (data.code === 200 || data.code === '200'){
                    //         $scope.jobList = data.result;
                    //         // 渲染任务
                    //         for (var i = 0; i < $scope.jobList.length; i++) {
                    //             if ($scope.jobList[i].uuid == jobId) {
                    //                 $scope.params.job = $scope.jobList[i];
                    //                 break;
                    //             }
                    //         }
                    //     }else {
                    //         $rootScope.showToast(data.message);
                    //     }
                    // }).error(function (data) {
                    // });
                }
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            $rootScope.showToast('查看系统详情失败');
        });
    };

    // 4、要修改的id
    $scope.editWarehouseId = '';
    /**
     * [editCase 修改情况下]
     * @param  {[string]} itemId [修改的id
     * @return {[type]}        [description]
     */
    $scope.editWarehouse = function (itemId) {
        $scope.dialog = {
            header: '修改',
            input_isClick: false,
            add:true,
            status: 'modify'
        };
        $scope.editWarehouseId = itemId;
        $scope.getWarehouseDetail(itemId);
    };
    // 确认修改系
    $scope.editWarehouseConfirm = function () {
        var paramsAll = {
            'name': $scope.params.name,
            'warehouse': $scope.params.warehouse?$scope.params.warehouse.uuid:'',
            // 'job': $scope.params.job?$scope.params.job.uuid:'',
            'is_active': $scope.params.is_active
        };
        $http({
            'method': 'POST',
            'url': interface_url + '/cmc/warehouse/' + $scope.editWarehouseId +'/',
            'data': paramsAll,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
                $("#myModal").modal('hide');
            }else if (data.code === 202 || data.code === '202'){
                $rootScope.showToast('修改成功');
                $scope.getWarehouseList();
                $("#myModal").modal('hide');
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            $rootScope.showToast('修改失败');
        })
    };
    // 删除
    $scope.delWarehouseId = '';
    // 获取某条要删除系统的id
    $scope.delWarehouse = function (itemId, index) {
        $scope.delWarehouseId = itemId;
        $scope.delIndex = index;
        $scope.dialog = {
            header: '删除',
            status: 'del'
        };
    };
    // 确认删除系统
    $scope.delWarehouseConfirm = function () {
        $http({
            'method': 'DELETE',
            'url': interface_url + '/cmc/warehouse/' + $scope.delWarehouseId + '/',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
                $("#myModal").modal('hide');
            }else if (data.code === 204 || data.code === '204'){
                $rootScope.showToast('删除成功');
                $("#DisableModel").modal('hide');
                $scope.getWarehouseList();
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            $rootScope.showToast('删除失败');
        })
    };

    // 禁用某条代码分支
    $scope.disableWarehouseId = '';
    $scope.disableWarehouse = function (itemId, index) {
        console.log(itemId)
        $scope.dialog = {
            header: '禁用',
            status: 'disable'
        };
        $scope.disableWarehouseId = itemId;
        $scope.disableIndex = index;
    };
    // 确认禁用
    $scope.disableWarehouseConfirm = function () {
        $http({
            'method': 'POST',
            'url': interface_url + '/cmc/warehouse/' + $scope.disableWarehouseId + '/',
            'data': {
                'is_active': false
            },
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
                $("#myModal").modal('hide');
            }else if (data.code === 202 || data.code === '202'){
                $rootScope.showToast('禁用成功');
                $scope.warehouseList[$scope.disableIndex].is_active = false;
                $("#DisableModel").modal('hide');
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            $rootScope.showToast('禁用失败');
        });
    };
}
/**
 * Pass all functions into module
 */
angular
    .module('inspinia')
    .controller('warehouse', warehouse) // 代码管理==代码仓库