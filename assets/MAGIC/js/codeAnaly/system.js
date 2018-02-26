/**
 * 代码分析管理=>系统管理-liudg-2017/10/16
 */
function codeAnalySystem($scope, $rootScope, $http, interface_url) {
    // 使新增、查看、修改的模态框在点击空白和键盘esc时不被关闭
    // $('#systemModal').modal({backdrop: 'static', keyboard: false});
    // $('#systemModal').modal('hide');
    /* 系统列表页面变量和方法--start */
    $scope.systemList = []; // 系统列表
    $scope.queryDepartmentList = []; // 部门列表，列表页面和模态框共用变量
    $scope.queryProductList = []; // 产品列表
    $scope.queryWarehouseList = []; // 数据仓库列表
    $scope.querySystemParam = {
        'department': {},
        'product': {},
        'warehouse': {},
        'systemName': ''
    };
    $scope.department_case = ''; // 查询用部门参数
    $scope.product_case = ''; // 查询用产品参数
    $scope.warehouse_case = ''; // 查询用数据仓库参数
    $scope.systemName_case = ''; // 查询用系统名称
    $scope.pageNum = 1; // 分页当前页码
    $scope.forInitPage = true; // 分页--是否初始化页面
    // dialog配置
    $scope.dialog = {
        header: '',
        input_isClick: false,
        detail: false,
        add: false,
        status: ''
    };
    /* 分页开始 */
    // 点击分页执行的函数
    $scope.changePageFun = function(pageNumber) {
        $http({
            'method': 'GET',
            'url': interface_url + '/codeAnalysis/system/',
            'params': {
                'page': pageNumber,
                'is_active': 'all',
                'department': $scope.department_case,
                'product': $scope.product_case,
                'warehouse': $scope.warehouse_case,
                'name': $scope.systemName_case
            },
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function(data) {
            if (data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            } else if (data.code === 200 || data.code === '200') {
                $scope.systemList = data.result;
            } else {
                $rootScope.showToast(data.message);
            }
        }).error(function(data) {
            console.error('获取列表方法-分页error');
        })
    };
    //创建分页
    $scope.initPageCompomentFun = function(count, select) {
        $(select).createPage({
            pageCount: count,
            current: 1,
            backFn: function(page_number) {
                $scope.pageNum = page_number;
                $scope.changePageFun(page_number);
            }
        })
    };
    /* 分页结束 */

    // 1、获取全部系统列表
    $scope.getSystemList = function() {
        $scope.pageNum = 1;
        $scope.forInitPage = true;
        $http({
            'method': 'GET',
            'params': {
                'is_active': 'all',
                'page': 1
            },
            'url': interface_url + '/codeAnalysis/system/',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function(data) {
            if (data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            } else if (data.code === 200 || data.code === '200') {
                $scope.systemList = data.result;
                $scope.initPageCompomentFun(data.allPage, ".forInit .tcdPageCode");
            } else {
                $rootScope.showToast(data.message);
            }
        }).error(function(data) {
            $rootScope.showToast('获取系统列表异常');
        });
    };
    $scope.getSystemList();

    // 2、查询系统列表
    // (1)获取部门列表--初始化调用
    $scope.getDepartmentMethod = function(obj) {
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/department/list/?format=json',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function(data) {
            if (data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            } else if (data.code === 200 || data.code === '200') {
                $scope.queryDepartmentList = data.result;
                $scope.departmentList = data.result;
            } else {
                $rootScope.showToast(data.message);
            }
        }).error(function(data) {
            $rootScope.showToast('获取部门列表异常');
        });
    };
    $scope.getDepartmentMethod();
    // (2)获取所选部门对应的产品列表--选择部门时触发
    $scope.queryProduct = function(callback) {
        if (!$scope.querySystemParam.department) return;
        getProduct($scope.querySystemParam.department.uuid, function(data) {
            $scope.queryProductList = data.result;
        })
    };
    // (3)获取产品对应的数据仓库列表--选择产品时触发
    $scope.queryWarehouse = function() {
        if (!$scope.querySystemParam.product) return;
        // 获取当前产品下的数据仓库
        getWarehouse($scope.querySystemParam.product.uuid, function(data) {
            $scope.queryWarehouseList = data && data.result;
        });
    };
    // (4)按条件执行查询--点击查询按钮触发
    $scope.queryCase = function() {
        $scope.pageNum = 1;
        $scope.forInitPage = false;
        $scope.department_case = $scope.querySystemParam.department ? $scope.querySystemParam.department.uuid : '';
        $scope.product_case = $scope.querySystemParam.product ? $scope.querySystemParam.product.uuid : '';
        $scope.warehouse_case = $scope.querySystemParam.warehouse ? $scope.querySystemParam.warehouse.uuid : '';
        $scope.systemName_case = $scope.querySystemParam.systemName;
        var sendData = {
            'department': $scope.department_case,
            'product': $scope.product_case,
            'warehouse': $scope.warehouse_case,
            'name': $scope.systemName_case,
            'is_active': 'all',
            'page': 1
        }
        $http({
            'method': 'GET',
            'url': interface_url + '/codeAnalysis/system/',
            'params': sendData,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function(data) {
            if (data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            } else if (data.code === 200 || data.code === '200') {
                $scope.systemList = data.result;
                $scope.initPageCompomentFun(data.allPage, ".forSearch .tcdPageCode");
            } else {
                $rootScope.showToast(data.message);
            }
        }).error(function(data) {
            $rootScope.showToast('查询失败');
        })
    };
    /* 系统列表页面变量和方法--end */


    /* 系统管理模态框页面变量和方法（包含删除和禁用）--start */
    $scope.productList = []; // 产品列表
    $scope.gitList = []; // 数据仓库的列表
    $scope.branchList = []; // 分支列表
    $scope.editSystemId = ''; // 修改时使用的系统id
    $scope.delSystemId = ''; // 删除时使用的系统id
    $scope.disableSystemId = ''; // 禁用时使用的系统id
    $scope.disableIndex = ''; // 禁用项在列表中的index
    // 模态框关闭时，清空scope中共用参数
    $('#systemModal').on('hide.bs.modal', function() {
        $scope.productList = []; // 产品列表
        $scope.gitList = []; // 数据仓库的列表
        $scope.branchList = []; // 分支列表
        initParam(); // 重置表单参数
        // $scope.$apply(); // 手动刷新
    })

    // 3.获取模态框中各选择框的列表内容
    // (1)获取所选部门对应的产品列表--模态框选择部门时触发
    $scope.getProductList = function() {
        if (!$scope.params.department) return;
        getProduct($scope.params.department.uuid, function(data) {
            $scope.productList = data.result;
        })
    };
    // (2)获取所选产品对应的git地址列表（数据仓库）--模态框选择产品时触发
    $scope.getWarehouseList = function() {
        if (!$scope.params.product) return;
        // 获取当前产品下的数据仓库
        getWarehouse($scope.params.product.uuid, function(data) {
            $scope.gitList = data && data.result;
        });
    };
    // (3)获取所选git地址对应的分支列表--模态框选择git地址（数据仓库）时触发
    $scope.getBranchList = function() {
        if (!$scope.params.git) return;
        getBranch($scope.params.git.uuid, function(data) {
            $scope.branchList = data.result;
        });
    };

    // 4.新增系统
    // (1)打开新增页面，初始化参数，配置dialog的内容--【新增系统】按钮触发
    $scope.addSystem = function() {
        initParam();
        $scope.dialog = {
            header: '新增系统',
            input_isClick: false,
            add: true,
            status: 'create'
        };
    };
    // (2)添加系统--点击模态框中【新增】按钮触发
    $scope.addSystemConfirm = function() {
        if (!$scope.params.product) {
            $rootScope.showToast('请选择产品');
            return;
        }
        if (!$scope.params.systemName) {
            $rootScope.showToast('请填写系统名称');
            return;
        }
        var paramsAll = {
            // 'product': $scope.params.product.uuid,
            // 'department': $scope.params.department.uuid,
            'name': $scope.params.systemName,
            'warehouse': $scope.params.git.uuid,
            'branch': $scope.params.branch.name,
            'is_active': $scope.params.is_active
        };
        $http({
            'method': 'POST',
            'url': interface_url + '/codeAnalysis/system/',
            'data': paramsAll,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function(data) {
            if (data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
                $('#systemModal').modal('hide');
            } else if (data.code === 201 || data.code === '201') {
                $rootScope.showToast('添加系统成功');
                $('#systemModal').modal('hide');
                $scope.getSystemList();
            } else {
                $rootScope.showToast(data.message);
            }
        }).error(function(data) {
            $rootScope.showToast(data.message);
        })
    };

    // 5.查看系统
    // (1)弹出查看模态框--点击【查看】按钮触发
    $scope.seeSystem = function(itemId) {
        $scope.dialog = {
            header: '查看',
            input_isClick: true,
            detail: true,
            status: 'see'
        };
        $scope.getSystemDetail(itemId);
    };
    // (2)通过系统id获取系统详情--查看和修改时调用，包含反显
    $scope.getSystemDetail = function(id) {
        $http({
            'method': 'GET',
            'url': interface_url + '/codeAnalysis/system/' + id + '/',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function(data) {
            if (data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            } else if (data.code === 200 || data.code === '200') {
                // $scope.params = data.result;
                var systemDetail = data.result;
                if ($scope.dialog.status === 'see' || $scope.dialog.status === 'modify') {
                    // 反显部门
                    for (var i = 0; i < $scope.queryDepartmentList.length; i++) {
                        if ($scope.queryDepartmentList[i].uuid === systemDetail.department) {
                            $scope.params.department = $scope.queryDepartmentList[i];
                        }
                    }
                    // 反显产品
                    getProduct(systemDetail.department, function(data) {
                        $scope.productList = data.result;
                        for (var i = 0; i < $scope.productList.length; i++) {
                            if ($scope.productList[i].uuid === systemDetail.product) {
                                $scope.params.product = $scope.productList[i];
                                break;
                            }
                        };
                    })
                    // 反显系统地址
                    $scope.params.systemName = systemDetail.name;
                    // 反显git地址
                    getWarehouse(systemDetail.product, function(data) {
                        $scope.gitList = data.result;
                        for (var i = 0; i < $scope.gitList.length; i++) {
                            if ($scope.gitList[i].uuid === systemDetail.warehouse) {
                                $scope.params.git = $scope.gitList[i];
                                break;
                            }
                        };
                    });
                    // 反显分支
                    getBranch(systemDetail.warehouse, function(data) {
                        $scope.branchList = data.result;
                        for (var i = 0; i < $scope.branchList.length; i++) {
                            if ($scope.branchList[i].name == systemDetail.branch) {
                                $scope.params.branch = $scope.branchList[i];
                                break;
                            }
                        };
                    });
                    // 反显启用状态
                    $scope.params.is_active = systemDetail.is_active;
                    if ($scope.dialog.status === 'see') {
                        // 反显创建用户
                        $scope.seeOnlyParams.creator_name = systemDetail.creator_name;
                        // 反显修改用户
                        $scope.seeOnlyParams.modifier_name = systemDetail.modifier_name;
                        // 反显创建时间
                        $scope.seeOnlyParams.create_time = systemDetail.create_time;
                        // 反显更新时间
                        $scope.seeOnlyParams.modify_time = systemDetail.modify_time;
                    }
                }
            } else {
                $rootScope.showToast(data.message);
            }
        }).error(function(data) {
            $rootScope.showToast('查看系统详情失败');
        });
    };

    // 6.修改系统
    // (1)打开修改模态框并获取所选系统的详情--列表页点击【修改】按钮触发
    $scope.editSystem = function(itemId) {
        $scope.dialog = {
            header: '修改',
            input_isClick: false,
            add: true,
            status: 'modify'
        };
        $scope.editSystemId = itemId;
        $scope.getSystemDetail(itemId);
    };
    // (2)确认修改系统--修改模态框【修改】按钮触发
    $scope.editSystemConfirm = function() {
        var paramsAll = {
            // 'product': $scope.params.product.uuid,
            // 'department': $scope.params.department.uuid,
            'name': $scope.params.systemName,
            'warehouse': $scope.params.git.uuid,
            'branch': $scope.params.branch.name,
            'is_active': $scope.params.is_active
        };
        $http({
            'method': 'POST',
            'url': interface_url + '/codeAnalysis/system/' + $scope.editSystemId + '/',
            'data': paramsAll,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function(data) {
            if (data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
                $('#systemModal').modal('hide');
            } else if (data.code === 202 || data.code === '202') {
                $rootScope.showToast('修改成功');
                $scope.getSystemList();
                $("#systemModal").modal('hide');
            } else {
                $rootScope.showToast(data.message);
            }
        }).error(function(data) {
            $rootScope.showToast('修改失败');
        })
    };

    // 7.删除系统
    // (1)打开删除模态框--列表页点击【删除】按钮触发
    $scope.delSystem = function(itemId, index) {
        $scope.delSystemId = itemId;
        $scope.dialog = {
            header: '删除',
            status: 'del'
        };
    };
    // (2)确认删除系统
    $scope.delSystemConfirm = function() {
        $http({
            'method': 'DELETE',
            'url': interface_url + '/codeAnalysis/system/' + $scope.delSystemId + '/',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function(data) {
            if (data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
                $('#DisableModel').modal('hide');
            } else if (data.code === 204 || data.code === '204') {
                $rootScope.showToast('删除成功');
                $("#DisableModel").modal('hide');
                $scope.getSystemList();
            } else {
                $rootScope.showToast(data.message);
            }
        }).error(function(data) {
            $rootScope.showToast('删除失败');
        })
    };

    // 8.禁用系统
    // (1)打开禁用模态框--列表页点击【禁用】按钮触发
    $scope.disableSystem = function(itemId, index) {
        console.log(itemId)
        $scope.dialog = {
            header: '禁用',
            status: 'disable'
        };
        $scope.disableSystemId = itemId;
        $scope.disableIndex = index;
    };
    // (2)确认禁用系统
    $scope.disableSystemConfirm = function() {
        $http({
            'method': 'POST',
            'url': interface_url + '/codeAnalysis/system/' + $scope.disableSystemId + '/',
            'data': {
                'is_active': false
            },
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function(data) {
            if (data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
                $('#DisableModel').modal('hide');
            } else if (data.code === 202 || data.code === '202') {
                $rootScope.showToast('禁用成功');
                $scope.systemList[$scope.disableIndex].is_active = false;
                $("#DisableModel").modal('hide');
            } else {
                $rootScope.showToast(data.message);
            }
        }).error(function(data) {
            $rootScope.showToast('禁用失败');
        });
    };
    /* 系统管理弹出框页面变量和方法（包含删除和禁用）--end */
    /* 几个通用方法 */
    // 初始化表单提交用的参数
    function initParam() {
        $scope.params = {
            department: {}, // 所选择的部门信息
            product: {}, // 所选择的产品信息
            systemName: '', // 系统名称
            git: {}, // 所选择的git数据仓库信息
            branch: {}, // 所选择的分支是信息
            sonarName: '', // sonar系统名称
            is_active: false // 是否启用
        };
        $scope.seeOnlyParams = {
            creator_name: '', // 创建用户，查看时显示用
            modifier_name: '', // 修改用户，查看时显示用
            created_time: '', // 创建时间，查看时显示用
            modified_time: '' // 更新时间，查看时显示用
        };
    };
    initParam(); // 页面初始化时执行一次
    // 通用方法，获取产品列表并执行回调函数
    function getProduct(departmentId, callback) {
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/product/list/?department_id=' + departmentId,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function(data) {
            if (data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            } else if (data.code === 200 || data.code === '200') {
                callback && callback(data);
            } else {
                $rootScope.showToast(data.message);
            }
        }).error(function(data) {
            $rootScope.showToast('获取产品列表异常');
        })
    };
    // 通用方法，获取数据仓库列表并执行回调函数
    function getWarehouse(productId, callback) {
        $http({
            'method': 'GET',
            'url': interface_url + '/gdc/warehouse/search/?product=' + productId,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function(data) {
            if (data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            } else {
                if (data.code === 200 || data.code === '200') {
                    callback && callback(data);
                } else {
                    $rootScope.showToast(data.message);
                }
            }
        }).error(function(data) {
            $rootScope.showToast(data.message);
        })
    };
    // 通用方法，根据gitId获取分支列表并执行回调函数
    function getBranch(gitId, callback) {
        $http({
            'method': 'GET',
            'url': interface_url + '/gdc/branch/?warehouse=' + gitId,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function(data) {
            if (data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            } else if (data.code === 200 || data.code === '200') {
                callback && callback(data);
            } else {
                $rootScope.showToast(data.message);
            }
        }).error(function(data) {
            $rootScope.showToast('获取分支列表异常');
        });
    };
}
/**
 * Pass all functions into module
 */
angular
    .module('inspinia')
    .controller('codeAnalySystem', codeAnalySystem) // 代码分析管理===系统管理
