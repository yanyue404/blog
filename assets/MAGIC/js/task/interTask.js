/**
 * 任务管理=>接口任务页面-liudg-2017/10/24
 */
function interTask($scope, $rootScope, $http, interface_url) {
    /* 代码分析策略列表页面变量和方法--start */
    $scope.tacticList = []; // 代码分析策略列表
    $scope.queryDepartmentList = []; // 部门列表，列表页面和模态框共用变量
    $scope.queryProductList = []; // 产品列表
    $scope.queryWarehouseList = []; // 数据仓库列表
    $scope.queryTaskParam = {
        'department': {},
        'product': {},
        'warehouse': {},
        'system': {},
        'env': {}
    };
    $scope.department_case = ''; // 查询用部门参数
    $scope.product_case = ''; // 查询用产品参数
    // $scope.warehouse_case = ''; // 查询用数据仓库参数
    $scope.system_case = ''; // 查询用系统参数
    $scope.analyType_case = '', // 查询用分析类型参数
    $scope.pageNum = 1; // 分页当前页码
    $scope.forInitPage = true; // 分页--是否初始化页面
    // 部署类型
    $scope.queryAnalyTypeList = [{
        name: '静态分析',
        value: '1'
    }, {
        name: '动态分析',
        value: '2'
    }];
    // dialog配置
    $scope.dialog = {
        header: '',
        input_isClick: false,
        detail: false,
        add: false,
        status: ''
    };
    $scope.getBusinessType = function(type) {
        switch (type) {
            case '1':
                return '接口';
            case '2':
                return '部署';
            case '3':
                return '业务';
            case '4':
                return '代码分析';
            case '5':
                return '邮件';
            default:
                return '';
        }
    };
    /* 分页开始 */
    // 点击分页执行的函数
    $scope.changePageFun = function(pageNumber) {
        $http({
            'method': 'GET',
            'url': interface_url + '/task/task/',
            'params': {
                'page': pageNumber,
                'is_active': 'all',
                'department': $scope.department_case,
                'product': $scope.product_case,
                'system': $scope.system_case,
                // 'warehouse': $scope.warehouse_case,
                'option_type': $scope.analyType_case,
            },
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function(data) {
            if (data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            } else if (data.code === 200 || data.code === '200') {
                $scope.tacticList = data.result;
            } else {
                $rootScope.showToast(data.message);
            }
        }).error(function(data) {
            console.error('获取列表方法-分页error');
        })
    };
    // 创建分页
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

    // 1、获取全部代码分析策略列表
    $scope.getTacticList = function() {
        $scope.pageNum = 1;
        $scope.forInitPage = true;
        $http({
            'method': 'GET',
            'params': {
                'is_active': 'all',
                'page': 1
            },
            'url': interface_url + '/task/task/',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function(data) {
            if (data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            } else if (data.code === 200 || data.code === '200') {
                $scope.tacticList = data.result;
                $scope.initPageCompomentFun(data.allPage, ".forInit .tcdPageCode");
            } else {
                $rootScope.showToast(data.message);
            }
        }).error(function(data) {
            $rootScope.showToast('获取代码分析策略列表异常');
        });
    };
    $scope.getTacticList();

    // 2、查询代码分析策略列表
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
        if (!$scope.queryTaskParam.department) return;
        getProduct($scope.queryTaskParam.department.uuid, function(data) {
            $scope.queryProductList = data.result;
        })
    };
    // (3)获取产品对应的数据仓库列表--选择产品时触发
    $scope.queryWarehouse = function() {
        if (!$scope.queryTaskParam.product) return;
        // 获取当前产品下的数据仓库
        getWarehouse($scope.queryTaskParam.product.uuid, function(data) {
            $scope.queryWarehouseList = data && data.result;
        });
    };
    // (4)获取数据仓库对应的系统列表--选择数据仓库时触发
    $scope.queryEnvList = function() {
        if (!$scope.queryTaskParam.warehouse) return;
        // 获取当前数据仓库下的系统列表
        getEnv($scope.queryTaskParam.warehouse.uuid, function(data) {
            $scope.queryEnvList = data && data.result;
        })
    }
    // (5)按条件执行查询--点击查询按钮触发
    $scope.queryCase = function() {
        $scope.pageNum = 1;
        $scope.forInitPage = false;
        $scope.department_case = $scope.queryTaskParam.department ? $scope.queryTaskParam.department.uuid : '';
        $scope.product_case = $scope.queryTaskParam.product ? $scope.queryTaskParam.product.uuid : '';
        $scope.system_case = $scope.queryTaskParam.system ? $scope.queryTaskParam.system.uuid : '';
        // $scope.warehouse_case = $scope.queryTaskParam.warehouse ? $scope.queryTaskParam.warehouse.uuid : '';
        $scope.analyType_case = $scope.queryTaskParam.env ? $scope.queryTaskParam.env.value : '';
        var sendData = {
            'department': $scope.department_case,
            'product': $scope.product_case,
            'system': $scope.system_case,
            // 'warehouse': $scope.warehouse_case,
            'option_type': $scope.analyType_case,
            'is_active': 'all',
            'page': 1
        }
        $http({
            'method': 'GET',
            'url': interface_url + '/task/task/',
            'params': sendData,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function(data) {
            if (data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            } else if (data.code === 200 || data.code === '200') {
                $scope.tacticList = data.result;
                $scope.initPageCompomentFun(data.allPage, ".forSearch .tcdPageCode");
            } else {
                $rootScope.showToast(data.message);
            }
        }).error(function(data) {
            $rootScope.showToast('查询失败');
        })
    };
    /* 代码分析策略列表页面变量和方法--end */


    /* 代码分析策略模态框页面变量和方法（包含删除和禁用）--start */
    $scope.productList = []; // 产品列表
    $scope.warehouseList = []; // 数据仓库列表
    // $scope.systemList = []; // 系统列表
    $scope.envList = []; // 环境列表
    $scope.staticFlag = false; // 静态分析时输入框显示flag
    $scope.dynamicFlag = false; // 动态分析时输入框显示flag
    $scope.editTacticId = ''; // 修改时使用的代码分析策略id
    $scope.delTacticId = ''; // 删除时使用的代码分析策略id
    $scope.disableTacticId = ''; // 禁用时使用的代码分析策略id
    $scope.disableIndex = ''; // 禁用项在列表中的index
    // 模态框关闭时，清空scope中共用参数
    $('#taskModal').on('hide.bs.modal', function() {
        $scope.productList = []; // 产品列表
        $scope.warehouseList = []; // 数据仓库列表
        // $scope.systemList = []; // 系统列表
        $scope.envList = []; // 环境列表
        $scope.staticFlag = false; // 静态分析时输入框显示flag
        $scope.dynamicFlag = false; // 动态分析时输入框显示flag
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
    // // (2)获取所选产品对应的系统列表--模态框选择产品时触发
    // $scope.getSystemList = function() {
    //     if (!$scope.params.product) return;
    //     // 获取当前产品下的系统列表
    //     getSystem($scope.params.product.uuid, function(data) {
    //         $scope.systemList = data && data.result;
    //     });
    // };
    // (2)获取所选产品对应的git地址列表（数据仓库）--模态框选择产品时触发
    $scope.getWarehouseList = function() {
        if (!$scope.params.product) return;
        // 获取当前产品下的数据仓库
        getWarehouse($scope.params.product.uuid, function(data) {
            $scope.warehosueList = data && data.result;
        });
    };
    // (3)获取数据仓库对应的系统列表--模态框选择数据仓库时触发
    $scope.getEnvList = function() {
        if (!$scope.params.warehouse) return;
        // 获取当前数据仓库下的系统列表
        getEnv($scope.params.warehouse.uuid, function(data) {
            $scope.envList = data && data.result;
        })
    };

    // // (3)根据所选择的代码分析类型，显示对应字段输入框
    // $scope.selectedAnalyType = function() {
    //     if (!$scope.params.analyType) {
    //         $scope.dynamicFlag = false;
    //         $scope.staticFlag = false;
    //         return;
    //     }
    //     switch ($scope.params.analyType.value) {
    //         case '1': // 静态分析
    //             $scope.staticFlag = true;
    //             $scope.dynamicFlag = false;
    //             break;
    //         case '2': // 动态分析
    //             $scope.dynamicFlag = true;
    //             $scope.staticFlag = false;
    //             break;
    //         default:
    //             $scope.dynamicFlag = false;
    //             $scope.staticFlag = false;
    //             break;
    //     }
    // };

    // 4.新增代码分析策略
    // (1)打开新增页面，初始化参数，配置dialog的内容--【新增代码分析策略】按钮触发
    $scope.addTactic = function() {
        initParam(); // 初始化表单提交参数
        $scope.dialog = {
            header: '新增代码分析策略',
            input_isClick: false,
            add: true,
            status: 'create'
        };
    };
    // (2)添加代码分析策略--点击模态框中【新增】按钮触发
    $scope.addTacticConfirm = function() {
        // 表单提交项目验证
        if (checkParams() === false) return;
        // 提交表单
        var paramsAll = {
            'name': $scope.params.tacticName,
            'system': $scope.params.system && $scope.params.system.uuid,
            'env': $scope.params.env && $scope.params.env.uuid,
            'option_type': $scope.params.analyType && $scope.params.analyType.value,
            // 'project_base_dir': $scope.params.baseDir,
            'source_dir': $scope.params.sourceDir,
            'project_pom_path': $scope.params.pomPath,
            'config_xml': $scope.params.configXml,
            'is_active': $scope.params.is_active
        };
        $http({
            'method': 'POST',
            'url': interface_url + '/task/task/',
            'data': paramsAll,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function(data) {
            if (data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
                $('#taskModal').modal('hide');
            } else if (data.code === 201 || data.code === '201') {
                $rootScope.showToast('添加代码分析策略成功');
                $('#taskModal').modal('hide');
                $scope.getTacticList();
            } else {
                $rootScope.showToast(data.message);
            }
        }).error(function(data) {
            $rootScope.showToast(data.message);
        })
    };

    // 5.查看代码分析策略
    // (1)弹出查看模态框--点击【查看】按钮触发
    $scope.seeTactic = function(itemId) {
        $scope.dialog = {
            header: '查看',
            input_isClick: true,
            detail: true,
            status: 'see'
        };
        $scope.getTacticDetail(itemId);
    };
    // (2)通过代码分析策略id获取代码分析策略详情--查看和修改时调用，包含反显
    $scope.getTacticDetail = function(id) {
        $http({
            'method': 'GET',
            'url': interface_url + '/task/task/' + id + '/',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function(data) {
            if (data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            } else if (data.code === 200 || data.code === '200') {
                var tacticDetail = data.result;
                if ($scope.dialog.status === 'see' || $scope.dialog.status === 'modify') {
                    // 反显部门
                    for (var i = 0; i < $scope.queryDepartmentList.length; i++) {
                        if ($scope.queryDepartmentList[i].uuid === tacticDetail.department_id) {
                            $scope.params.department = $scope.queryDepartmentList[i];
                        }
                    }
                    // 反显产品
                    getProduct(tacticDetail.department_id, function(data) {
                        $scope.productList = data.result;
                        for (var i = 0; i < $scope.productList.length; i++) {
                            if ($scope.productList[i].uuid === tacticDetail.product_id) {
                                $scope.params.product = $scope.productList[i];
                                break;
                            }
                        }
                    });
                    // 反显数据仓库
                    getWarehouse(tacticDetail.product_id, function(data) {
                        $scope.warehouseList = data.result;
                        for (var i = 0; i < $scope.warehouseList.length; i++) {
                            if ($scope.warehouseList[i].uuid === tacticDetail.system) {
                                $scope.params.warehouse = $scope.warehouseList[i];
                                break;
                            }
                        }
                    });
                    // 反显环境
                    getEnv(tacticDetail.warehouse_id, function(data){
                        for (var i = 0; i < $scope.envList.length; i++) {
                            if ($scope.envList[i].uuid === tacticDetail.env) {
                                $scope.params.env = $scope.envList[i];
                                break;
                            }
                        }
                    });
                    // 反显策略名称
                    $scope.params.tacticName = tacticDetail.name;
                    // 反显分析类型
                    $scope.queryAnalyTypeList = [{
                        name: '静态分析',
                        value: '1'
                    }, {
                        name: '动态分析',
                        value: '2'
                    }];
                    for (var i = 0; i < $scope.queryAnalyTypeList.length; i++) {
                        if ($scope.queryAnalyTypeList[i].value === tacticDetail.option_type) {
                            $scope.params.analyType = $scope.queryAnalyTypeList[i];
                            $scope.selectedAnalyType();
                            break;
                        }
                    }
                    // 反显分析类型对应的参数
                    $scope.params.baseDir = tacticDetail.base_dir;
                    $scope.params.sourceDir = tacticDetail.source_dir;
                    $scope.params.pomPath = tacticDetail.project_pom_path;
                    $scope.params.configXml = tacticDetail.config_xml;
                    // 反显启用状态
                    $scope.params.is_active = tacticDetail.is_active;
                    if ($scope.dialog.status === 'see') {
                        // 反显创建用户
                        $scope.seeOnlyParams.creator_name = tacticDetail.creator_name;
                        // 反显修改用户
                        $scope.seeOnlyParams.modifier_name = tacticDetail.modifier_name;
                        // 反显创建时间
                        $scope.seeOnlyParams.create_time = tacticDetail.create_time;
                        // 反显更新时间
                        $scope.seeOnlyParams.modify_time = tacticDetail.modify_time;
                    }
                }
            } else {
                $rootScope.showToast(data.message);
            }
        }).error(function(data) {
            $rootScope.showToast('查看代码分析策略详情失败');
        });
    };

    // 6.修改代码分析策略
    // (1)打开修改模态框并获取所选代码分析策略的详情--列表页点击【修改】按钮触发
    $scope.editTactic = function(itemId) {
        $scope.dialog = {
            header: '修改',
            input_isClick: false,
            add: true,
            status: 'modify'
        };
        $scope.editTacticId = itemId;
        $scope.getTacticDetail(itemId);
    };
    // (2)确认修改代码分析策略--修改模态框【修改】按钮触发
    $scope.editTacticConfirm = function() {
        var paramsAll = {
            'name': $scope.params.tacticName,
            'system': $scope.params.system && $scope.params.system.uuid,
            'env': $scope.params.env && $scope.params.env.uuid,
            'option_type': $scope.params.analyType && $scope.params.analyType.value,
            // 'project_base_dir': $scope.params.baseDir,
            'source_dir': $scope.params.sourceDir,
            'project_pom_path': $scope.params.pomPath,
            'config_xml': $scope.params.configXml,
            'is_active': $scope.params.is_active
        };
        $http({
            'method': 'POST',
            'url': interface_url + '/task/task/' + $scope.editTacticId + '/',
            'data': paramsAll,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function(data) {
            if (data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
                $('#taskModal').modal('hide');
            } else if (data.code === 202 || data.code === '202') {
                $rootScope.showToast('修改成功');
                $scope.getTacticList();
                $("#taskModal").modal('hide');
            } else {
                $rootScope.showToast(data.message);
            }
        }).error(function(data) {
            $rootScope.showToast('修改失败');
        })
    };


    // 7.删除代码分析策略
    // (1)打开删除模态框--列表页点击【删除】按钮触发
    $scope.delTactic = function(itemId, index) {
        $scope.delTacticId = itemId;
        $scope.dialog = {
            header: '删除',
            status: 'del'
        };
    };
    // (2)确认删除代码分析策略
    $scope.delTacticConfirm = function() {
        $http({
            'method': 'DELETE',
            'url': interface_url + '/task/task/' + $scope.delTacticId + '/',
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
                $scope.getTacticList();
            } else {
                $rootScope.showToast(data.message);
            }
        }).error(function(data) {
            $rootScope.showToast('删除失败');
        })
    };

    // 8.禁用代码分析策略
    // (1)打开禁用模态框--列表页点击【禁用】按钮触发
    $scope.disableTactic = function(itemId, index) {
        console.log(itemId)
        $scope.dialog = {
            header: '禁用',
            status: 'disable'
        };
        $scope.disableTacticId = itemId;
        $scope.disableIndex = index;
    };
    // (2)确认禁用代码分析策略
    $scope.disableTacticConfirm = function() {
        $http({
            'method': 'POST',
            'url': interface_url + '/task/task/' + $scope.disableTacticId + '/',
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
                $scope.tacticList[$scope.disableIndex].is_active = false;
                $("#DisableModel").modal('hide');
            } else {
                $rootScope.showToast(data.message);
            }
        }).error(function(data) {
            $rootScope.showToast('禁用失败');
        });
    };
    /* 代码分析策略弹出框页面变量和方法（包含删除和禁用）--end */
    /* 几个通用方法 */
    // 初始化表单提交用的参数
    function initParam() {
        $scope.params = {
            department: {}, // 所选择的部门信息
            product: {}, // 所选择的产品信息
            system: {}, // 所选择的系统信息
            env: {}, // 所选择的环境信息
            tacticName: '', // 策略名称
            analyType: {}, // 所选择的代码分析类型
            baseDir: '', // ProjectBaseDir
            sourceDir: '', // SourceDir
            pomPath: '', // ProjectPomPath
            configXml: '', // ConfigXml
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
    // 通用方法，获取系统列表并执行回调函数
    // function getSystem(productId, callback) {
    //     $http({
    //         'method': 'GET',
    //         'url': interface_url + '/task/system/search/?product=' + productId,
    //         'headers': {
    //             'Authorization': 'Token ' + localStorage.getItem('auth_token')
    //         }
    //     }).success(function(data) {
    //         if (data.code === 403 || data.code === '403') {
    //             $rootScope.showLogin();
    //         } else {
    //             if (data.code === 200 || data.code === '200') {
    //                 callback && callback(data);
    //             } else {
    //                 $rootScope.showToast(data.message);
    //             }
    //         }
    //     }).error(function(data) {
    //         $rootScope.showToast(data.message);
    //     })
    // };
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
    // 通用方法，获取获取环境列表并执行回调函数
    function getEnv() {
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/env/list/?format=json',
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
            $rootScope.showToast('获取环境列表异常');
        })
    };
    // 新增、修改时前端表单提交时的验证
    function checkParams() {
        if (!$scope.params.department.uuid) {
            $rootScope.showToast('请选择部门信息');
            return false;
        } else if (!$scope.params.product.uuid) {
            $rootScope.showToast('请选择产品信息');
            return false;
        } else if (!$scope.params.system.uuid) {
            $rootScope.showToast('请选择系统信息');
            return false;
        } else if (!$scope.params.env.uuid) {
            $rootScope.showToast('请选择环境信息');
            return false;
        } else if ($scope.params.tacticName === '') {
            $rootScope.showToast('请输入策略名称');
            return false;
        } else if (!$scope.params.analyType.value) {
            $rootScope.showToast('请选择分析类型');
            return false;
        } else if ($scope.params.analyType.value === '1') {
            if ($scope.params.baseDir === '') {
                $rootScope.showToast('请输入ProjectBaseDir');
                return false;
            } else if ($scope.params.sourceDir === '') {
                $rootScope.showToast('请输入SourceDir');
                return false;
            }
        } else if ($scope.params.analyType.value === '2') {
            if ($scope.params.pomPath === '') {
                $rootScope.showToast('请输入ProjectPomPath');
                return false;
            } else if ($scope.params.configXml === '') {
                $rootScope.showToast('请输入ConfigXml');
                return false;
            }
        } else {
            return true;
        }
    }
}
/**
 * Pass all functions into module
 */
angular
    .module('inspinia')
    .controller('interTask', interTask) // 代码分析管理===代码分析策略
