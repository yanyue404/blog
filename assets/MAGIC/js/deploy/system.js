/**
 * Created by Administrator on 2017/6/8.
 */
/**
 * Created by Administrator on 2017/5/2.
 */
/**
 * 部署管理=='系统'
 */
function deploySystem($scope, $rootScope, $http, interface_url) {
    // 分页开始
    //点击分页执行的函数
    $scope.changePageFun = function (pageNumber) {
        $http({
            'method': 'GET',
            'url': interface_url + '/gdc/system/',
            'params': {
                'page': pageNumber,
                'is_active': 'all',
                'department_id': $scope.department_case,
                'product_id': $scope.product_case
            },
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            }else if (data.code === 200 || data.code === '200'){
                $scope.systemList = data.result;
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
                console.log(page_number);
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
    // 1、获取系统列表
    $scope.systemList = [];
    $scope.getSystemList = function () {
        $scope.pageNum=1;
        $scope.forInitPage = true;
        $http({
            'method': 'GET',
            'params': {
                'is_active': 'all',
                'page': 1
            },
            'url': interface_url + '/gdc/system/',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            }else if (data.code === 200 || data.code === '200'){
                $scope.systemList = data.result;
                $scope.initPageCompomentFun(data.allPage,".forInit .tcdPageCode");
                //$scope.queryStorageList = data.result;
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
        });
    };
    $scope.getSystemList();
    // 2、查询系统列表
    // 获取部门列表
    $scope.queryProductList=[];
    $scope.getDepartmentMethod = function (obj) {
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
        });
    };
    $scope.getDepartmentMethod();
    $scope.queryFlag = 1;
    $scope.queryDepartment = function (callback) {
        if (!$scope.querySystemParam.department)return;
        // 获取部门下的产品列表
        $scope.queryFlag = 1;
        var departmentid = $scope.querySystemParam.department.uuid;
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/product/list/?department_id=' + departmentid,
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
    // 点击查询
    $scope.queryCase = function () {
        $scope.pageNum=1;
        $scope.forInitPage = false;
        $scope.department_case = $scope.querySystemParam.department?$scope.querySystemParam.department.uuid:'';
        $scope.product_case = $scope.querySystemParam.product?$scope.querySystemParam.product.uuid:'';
        var sendData = {
            'department': $scope.department_case,
            'product': $scope.product_case,
            'is_active': 'all',
            'page': 1
        }
        $http({
            'method': 'GET',
            'url': interface_url + '/gdc/system/',
            'params': sendData,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            }else if (data.code === 200 || data.code === '200'){
                $scope.systemList = data.result;
                $scope.initPageCompomentFun(data.allPage,".forSearch .tcdPageCode");
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            $rootScope.showToast('查询失败');
        })
    };

    // 初始化参数，清空新增完保存的数据
    $scope.initParam = function () {
        // $scope.selectSearchResult = '';
        // $scope.warehouseList = '';
        $scope.params = {
            productName: '',
            systemName: '',
            // systemDes: '',
            is_active: false,
            board: '',
            sort_priority: '',
            warehouse:''
        }
    };
    // 打开新增页面，初始化参数，配置dialog的内容
    $scope.openSystem = function () {
        $scope.initParam();
        $scope.params.board = $scope.boardShow[0];
        $scope.dialog = {
            header: '新增系统',
            input_isClick: false,
            add: true,
            status: 'create'
        };
    };
    $scope.productNameList = []; // 所有产品的列表
    // 获取产品的接口
    $http({
        'method': 'GET',
        'url': interface_url + '/interface/product/list/?format=json',
        'headers': {
            'Authorization': 'Token ' + localStorage.getItem('auth_token')
        }
    }).success(function (data) {
        if(data.code === 403 || data.code === '403') {
            $rootScope.showLogin();
        }else if (data.code === 200 || data.code === '200'){
            $scope.productNameList = data.result;
        }else {
            $rootScope.showToast(data.message);
        }
    }).error(function (data) {
    });
    $scope.warehouseList = []; // 数据仓库的列表
    //20170829==根据产品查询数据仓库
    $scope.getWarehouse = function (productid, callback) {
        $http({
            'method': 'GET',
            'url': interface_url + '/gdc/warehouse/?product_id=' + productid,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
                if (data.code === 200 || data.code === '200'){
                    $scope.warehouseList = data.result;
                    callback && callback();
                }else {
                    $rootScope.showToast(data.message);
                }
            }}).error(function (data) {
        })
    };
    // $scope.getWechatGroup = function (productid, callback) {
    //     $http({
    //         'method': 'GET',
    //         'url': interface_url + '/gdc/wechatgroup/?product_id=' + productid,
    //         'headers': {
    //             'Authorization': 'Token ' + localStorage.getItem('auth_token')
    //         }
    //     }).success(function (data) {
    //         if(data.code === 403 || data.code === '403'){
    //             $rootScope.showLogin();
    //         }else {
    //             if (data.code === 200 || data.code === '200'){
    //                 $scope.wechatGroupList = data.result;
    //                 callback && callback();
    //             }else {
    //                 $rootScope.showToast(data.message);
    //             }
    //         }}).error(function (data) {
    //     })
    // };
    // 先选择产品，再根据产品选择数据仓库
    $scope.selectedProduct = function () {
        if (!$scope.params.productName)return;
        // 获取当前产品下的数据仓库
        $scope.getWarehouse($scope.params.productName.uuid);
        // $scope.getWechatGroup($scope.params.productName.id);
    };
    // 是否显示看板选项
    $scope.boardShow = [
        {
            is_board_display: true,
            description: '是'
        },
        {
            is_board_display: false,
            description: '否'
        }
    ];
    // 3、添加系统
    $scope.addSystemConfirm = function () {
        if (!$scope.params.productName) {
            $rootScope.showToast('请选择产品') ;
            return;
        }
        /*if (!$scope.params.systemName) {
            $rootScope.showToast('请填写系统名称') ;
            return;
        }*/
        if (!$scope.params.systemName) {
            $rootScope.showToast('请填写系统名称') ;
            return;
        }
        var paramsAll = {
            'product': $scope.params.productName.uuid,
            'name': $scope.params.systemName,
            // 'description': $scope.params.systemName,
            'warehouse': $scope.params.warehouse.uuid,
            // 'wechatGroup': $scope.params.wechatGroup,
            'is_active': $scope.params.is_active,
            'is_board_display': $scope.params.board.is_board_display,
            'sort_priority': $scope.params.sort_priority
        };
        $http({
            'method': 'POST',
            'url': interface_url + '/gdc/system/',
            'data': paramsAll,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
                $('#myModal').modal('hide');
            }else if (data.code === 201 || data.code === '201'){
                $rootScope.showToast('添加系统成功');
                $('#myModal').modal('hide');
                //$scope.seeSystem(data.result.uuid);
                $scope.getSystemList();
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            $rootScope.showToast(data.message);
        })
    };
    /**
     * 3、查看系统
     * @param  {[string]} itemId [查看的id]
     * @return {[type]}        [description]
     */
    $scope.seeSystem = function (itemId) {
        $scope.dialog = {
            header: '查看',
            input_isClick: true,
            detail: true,
            status: 'see'
        };
        $scope.getSystemDetail(itemId);
    };
    // 通过id查看系统详情的方法
    $scope.getSystemDetail = function (id) {
        $http({
            'method': 'GET',
            'url': interface_url + '/gdc/system/' + id + '/',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            }else if (data.code === 200 || data.code === '200'){
                $scope.params = data.result;
                $scope.params.systemName = data.result.name;
                // $scope.params.systemDes = data.result.description;
                if ($scope.dialog.status === 'see' || $scope.dialog.status === 'modify') {
                    // 渲染产品
                    for (var i = 0; i < $scope.productNameList.length; i++) {
                        if ($scope.productNameList[i].uuid == data.result.product) {
                            $scope.params.productName = $scope.productNameList[i];
                            break;
                        }
                    };
                    // 是否显示看板
                    // for (var j = 0; j < $scope.boardShow.length; j++) {
                    //     if ($scope.boardShow[j].is_board_display == data.result.is_board_display) {
                    //         $scope.params.board = $scope.boardShow[j];
                    //         break;
                    //     }
                    // };
                    //20170829渲染数据仓库
                    var productId = data.result.product_id;
                    var warehouseId = data.result.warehouse;
                    $http({
                        'method': 'GET',
                        'url': interface_url + '/gdc/warehouse/?product_id=' + productId,
                        'headers': {
                            'Authorization': 'Token ' + localStorage.getItem('auth_token')
                        }
                    }).success(function (data) {
                        if(data.code === 403 || data.code === '403'){
                            $rootScope.showLogin();
                        }else {
                            if (data.code === 200 || data.code === '200'){
                                // console.log(data.result.product_id)
                                $scope.warehouseList = data.result;
                                for (var i = 0; i < $scope.warehouseList.length; i++) {
                                    if ($scope.warehouseList[i].uuid == warehouseId) {
                                        $scope.params.warehouse = $scope.warehouseList[i];
                                        break;
                                    }
                                }
                            }else {
                                $rootScope.showToast(data.message);
                            }
                        }}).error(function (data) {
                    })
                    //渲染微信组
                    var wechatGroupId = data.result.wechatGroup_id;
                    $http({
                        'method': 'GET',
                        'url': interface_url + '/gdc/wechatgroup/?product_id=' + productId,
                        'headers': {
                            'Authorization': 'Token ' + localStorage.getItem('auth_token')
                        }
                    }).success(function (data) {
                        if(data.code === 403 || data.code === '403'){
                            $rootScope.showLogin();
                        }else {
                            if (data.code === 200 || data.code === '200'){
                                $scope.warehouseList = data.result;
                                for (var i = 0; i < $scope.warehouseList.length; i++) {
                                    if ($scope.warehouseList[i].id == wechatGroupId) {
                                        $scope.params.wechatGroup = $scope.warehouseList[i].name;
                                        break;
                                    }
                                }
                            }else {
                                $rootScope.showToast(data.message);
                            }
                        }}).error(function (data) {
                    })
                }
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            $rootScope.showToast('查看系统详情失败');
        });
    };

    // 4、要修改的id
    $scope.editSystemId = '';
    /**
     * [editCase 修改情况下]
     * @param  {[string]} itemId [修改的id
     * @return {[type]}        [description]
     */
    $scope.editSystem = function (itemId) {
        $scope.dialog = {
            header: '修改',
            input_isClick: false,
            add:true,
            status: 'modify'
        };
        $scope.editSystemId = itemId;
        $scope.getSystemDetail(itemId);
    };
    // 确认修改系统
    $scope.editSystemConfirm = function () {
        var paramsAll = {
            'product': $scope.params.productName.uuid,
            //'name': $scope.params.systemName,
            'description': $scope.params.systemName,
            'warehouse': $scope.params.warehouse.uuid,
            // 'wechatGroup': $scope.params.wechatGroup,
            'is_active': $scope.params.is_active,
            //'is_board_display': $scope.params.board.is_board_display,
            //'sort_priority': $scope.params.sort_priority
        };
        $http({
            'method': 'POST',
            'url': interface_url + '/gdc/system/' + $scope.editSystemId +'/',
            'data': paramsAll,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
                $('#myModal').modal('hide');
            }else if (data.code === 202 || data.code === '202'){
                $rootScope.showToast('修改成功');
                $scope.getSystemList();
                $("#myModal").modal('hide');
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            $rootScope.showToast('修改失败');
        })
    };
    // 删除
    $scope.delSystemId = '';
    // 获取某条要删除系统的id
    $scope.delSystem = function (itemId, index) {
        $scope.delSystemId = itemId;
        $scope.delIndex = index;
        $scope.dialog = {
            header: '删除',
            status: 'del'
        };
    };
    // 确认删除系统
    $scope.delSystemConfirm = function () {
        $http({
            'method': 'DELETE',
            'url': interface_url + '/gdc/system/' + $scope.delSystemId + '/',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
                $('#DisableModel').modal('hide');
            }else if (data.code === 204 || data.code === '204'){
                $rootScope.showToast('删除成功');
                $("#DisableModel").modal('hide');
                $scope.getSystemList();
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            $rootScope.showToast('删除失败');
        })
    };

    // 禁用某条代码分支
    $scope.disableSystemId = '';
    $scope.disableSystem = function (itemId, index) {
        console.log(itemId)
        $scope.dialog = {
            header: '禁用',
            status: 'disable'
        };
        $scope.disableSystemId = itemId;
        $scope.disableIndex = index;
    };
    // 确认禁用
    $scope.disableSystemConfirm = function () {
        $http({
            'method': 'POST',
            'url': interface_url + '/gdc/system/' + $scope.disableSystemId + '/',
            'data': {
                'is_active': false
            },
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
                $('#DisableModel').modal('hide');
            }else if (data.code === 202 || data.code === '202'){
                $rootScope.showToast('禁用成功');
                $scope.systemList[$scope.disableIndex].is_active = false;
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
    .controller('deploySystem', deploySystem) // 后台系统列表