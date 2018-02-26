/**
 * 代码分析管理=>代码分析策略页面-liudg-2017/10/19
 */
function codeAnaly($scope, $rootScope, $http, interface_url) {
    // 使新增、查看、修改的模态框在点击空白和键盘esc时不被关闭
    // $('#tacticsModal').modal({backdrop: 'static', keyboard: false});
    // $('#tacticsModal').modal('hide');
    /* 代码分析策略列表页面变量和方法--start */
    $scope.tacticsList = []; // 代码分析策略列表
    $scope.queryDepartmentList = []; // 部门列表，列表页面和模态框共用变量
    $scope.queryProductList = []; // 产品列表
    $scope.queryWarehouseList = []; // 数据仓库列表
    $scope.queryTacticsParam = {
        'department': {},
        'product': {},
        'warehouse': {},
        'system': {},
        'analyType': {}
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
    $scope.getOptType = function(type) {
        switch (type) {
            case '1':
                return '静态分析';
            case '2':
                return '动态分析';
            default:
                return '';
        }
    };
    /* 分页开始 */
    // 点击分页执行的函数
    $scope.changePageFun = function(pageNumber) {
        $http({
            'method': 'GET',
            'url': interface_url + '/codeAnalysis/tactics/',
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
                $scope.tacticsList = data.result;
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
    $scope.getTacticsList = function() {
        $scope.pageNum = 1;
        $scope.forInitPage = true;
        $http({
            'method': 'GET',
            'params': {
                'is_active': 'all',
                'page': 1
            },
            'url': interface_url + '/codeAnalysis/tactics/',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function(data) {
            if (data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            } else if (data.code === 200 || data.code === '200') {
                $scope.tacticsList = data.result;
                $scope.initPageCompomentFun(data.allPage, ".forInit .tcdPageCode");
            } else {
                $rootScope.showToast(data.message);
            }
        }).error(function(data) {
            $rootScope.showToast('获取代码分析策略列表异常');
        });
    };
    $scope.getTacticsList();

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
        if (!$scope.queryTacticsParam.department) return;
        getProduct($scope.queryTacticsParam.department.uuid, function(data) {
            $scope.queryProductList = data.result;
        })
    };
    // (3)获取产品对应的代码分析策略列表和数据仓库列表--选择产品时触发
    $scope.querySystem = function() {
        if (!$scope.queryTacticsParam.product) return;
        // 获取当前产品下的代码分析策略列表
        getSystem($scope.queryTacticsParam.product.uuid, function(data) {
            $scope.querySystemList = data && data.result;
        });
    };
    // (4)按条件执行查询--点击查询按钮触发
    $scope.queryCase = function() {
        $scope.pageNum = 1;
        $scope.forInitPage = false;
        $scope.department_case = $scope.queryTacticsParam.department ? $scope.queryTacticsParam.department.uuid : '';
        $scope.product_case = $scope.queryTacticsParam.product ? $scope.queryTacticsParam.product.uuid : '';
        $scope.system_case = $scope.queryTacticsParam.system ? $scope.queryTacticsParam.system.uuid : '';
        // $scope.warehouse_case = $scope.queryTacticsParam.warehouse ? $scope.queryTacticsParam.warehouse.uuid : '';
        $scope.analyType_case = $scope.queryTacticsParam.analyType ? $scope.queryTacticsParam.analyType.value : '';
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
            'url': interface_url + '/codeAnalysis/tactics/',
            'params': sendData,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function(data) {
            if (data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            } else if (data.code === 200 || data.code === '200') {
                $scope.tacticsList = data.result;
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
    $scope.systemList = []; // 系统列表
    $scope.envList = []; // 环境列表
    $scope.staticFlag = false; // 静态分析时输入框显示flag
    $scope.dynamicFlag = false; // 动态分析时输入框显示flag
    $scope.editTacticsId = ''; // 修改时使用的代码分析策略id
    $scope.delTacticsId = ''; // 删除时使用的代码分析策略id
    $scope.disableTacticsId = ''; // 禁用时使用的代码分析策略id
    $scope.disableIndex = ''; // 禁用项在列表中的index
    // 模态框关闭时，清空scope中共用参数
    $('#tacticsModal').on('hide.bs.modal', function() {
        $scope.productList = []; // 产品列表
        $scope.systemList = []; // 系统列表
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
    // (2)获取所选产品对应的系统列表--模态框选择产品时触发
    $scope.getSystemList = function() {
        if (!$scope.params.product) return;
        // 获取当前产品下的系统列表
        getSystem($scope.params.product.uuid, function(data) {
            $scope.systemList = data && data.result;
        });
    };

    // (3)根据所选择的代码分析类型，显示对应字段输入框
    $scope.selectedAnalyType = function() {
        if (!$scope.params.analyType) {
            $scope.dynamicFlag = false;
            $scope.staticFlag = false;
            return;
        }
        switch ($scope.params.analyType.value) {
            case '1': // 静态分析
                $scope.staticFlag = true;
                $scope.dynamicFlag = false;
                break;
            case '2': // 动态分析
                $scope.dynamicFlag = true;
                $scope.staticFlag = false;
                break;
            default:
                $scope.dynamicFlag = false;
                $scope.staticFlag = false;
                break;
        }
    };

    // 4.新增代码分析策略
    // (1)打开新增页面，初始化参数，配置dialog的内容--【新增代码分析策略】按钮触发
    $scope.addTactics = function() {
        initParam(); // 初始化表单提交参数
        getEnv(); // 获取环境列表
        $scope.dialog = {
            header: '新增代码分析策略',
            input_isClick: false,
            add: true,
            status: 'create'
        };
    };
    // (2)添加代码分析策略--点击模态框中【新增】按钮触发
    $scope.addTacticsConfirm = function() {
        // 表单提交项目验证
        if (checkParams() === false) return;
        // 提交表单
        var paramsAll = {
            'name': $scope.params.tacticsName,
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
            'url': interface_url + '/codeAnalysis/tactics/',
            'data': paramsAll,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function(data) {
            if (data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
                $('#tacticsModal').modal('hide');
            } else if (data.code === 201 || data.code === '201') {
                $rootScope.showToast('添加代码分析策略成功');
                $('#tacticsModal').modal('hide');
                $scope.getTacticsList();
            } else {
                $rootScope.showToast(data.message);
            }
        }).error(function(data) {
            $rootScope.showToast(data.message);
        })
    };

    // 5.查看代码分析策略
    // (1)弹出查看模态框--点击【查看】按钮触发
    $scope.seeTactics = function(itemId) {
        $scope.dialog = {
            header: '查看',
            input_isClick: true,
            detail: true,
            status: 'see'
        };
        $scope.getTacticsDetail(itemId);
    };
    // (2)通过代码分析策略id获取代码分析策略详情--查看和修改时调用，包含反显
    $scope.getTacticsDetail = function(id) {
        $http({
            'method': 'GET',
            'url': interface_url + '/codeAnalysis/tactics/' + id + '/',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function(data) {
            if (data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            } else if (data.code === 200 || data.code === '200') {
                var tacticsDetail = data.result;
                if ($scope.dialog.status === 'see' || $scope.dialog.status === 'modify') {
                    // 反显部门
                    for (var i = 0; i < $scope.queryDepartmentList.length; i++) {
                        if ($scope.queryDepartmentList[i].uuid === tacticsDetail.department_id) {
                            $scope.params.department = $scope.queryDepartmentList[i];
                        }
                    }
                    // 反显产品
                    getProduct(tacticsDetail.department_id, function(data) {
                        $scope.productList = data.result;
                        for (var i = 0; i < $scope.productList.length; i++) {
                            if ($scope.productList[i].uuid === tacticsDetail.product_id) {
                                $scope.params.product = $scope.productList[i];
                                break;
                            }
                        };
                    })
                    // 反显系统
                    getSystem(tacticsDetail.product_id, function(data) {
                        $scope.systemList = data.result;
                        for (var i = 0; i < $scope.systemList.length; i++) {
                            if ($scope.systemList[i].uuid === tacticsDetail.system) {
                                $scope.params.system = $scope.systemList[i];
                                break;
                            }
                        };
                    })
                    // 反显环境
                    getEnv(function(data) {
                        for (var i = 0; i < $scope.envList.length; i++) {
                            if ($scope.envList[i].uuid === tacticsDetail.env) {
                                $scope.params.env = $scope.envList[i];
                                break;
                            }
                        };
                    });
                    // 反显策略名称
                    $scope.params.tacticsName = tacticsDetail.name;
                    // 反显分析类型
                    $scope.queryAnalyTypeList = [{
                        name: '静态分析',
                        value: '1'
                    }, {
                        name: '动态分析',
                        value: '2'
                    }];
                    for (var i = 0; i < $scope.queryAnalyTypeList.length; i++) {
                        if ($scope.queryAnalyTypeList[i].value === tacticsDetail.option_type) {
                            $scope.params.analyType = $scope.queryAnalyTypeList[i];
                            $scope.selectedAnalyType();
                            break;
                        }
                    }
                    // 反显分析类型对应的参数
                    $scope.params.baseDir = tacticsDetail.base_dir;
                    $scope.params.sourceDir = tacticsDetail.source_dir;
                    $scope.params.pomPath = tacticsDetail.project_pom_path;
                    $scope.params.configXml = tacticsDetail.config_xml;
                    // 反显启用状态
                    $scope.params.is_active = tacticsDetail.is_active;
                    if ($scope.dialog.status === 'see') {
                        // 反显创建用户
                        $scope.seeOnlyParams.creator_name = tacticsDetail.creator_name;
                        // 反显修改用户
                        $scope.seeOnlyParams.modifier_name = tacticsDetail.modifier_name;
                        // 反显创建时间
                        $scope.seeOnlyParams.create_time = tacticsDetail.create_time;
                        // 反显更新时间
                        $scope.seeOnlyParams.modify_time = tacticsDetail.modify_time;
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
    $scope.editTactics = function(itemId) {
        $scope.dialog = {
            header: '修改',
            input_isClick: false,
            add: true,
            status: 'modify'
        };
        $scope.editTacticsId = itemId;
        $scope.getTacticsDetail(itemId);
    };
    // (2)确认修改代码分析策略--修改模态框【修改】按钮触发
    $scope.editTacticsConfirm = function() {
        var paramsAll = {
            'name': $scope.params.tacticsName,
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
            'url': interface_url + '/codeAnalysis/tactics/' + $scope.editTacticsId + '/',
            'data': paramsAll,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function(data) {
            if (data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
                $('#tacticsModal').modal('hide');
            } else if (data.code === 202 || data.code === '202') {
                $rootScope.showToast('修改成功');
                $scope.getTacticsList();
                $("#tacticsModal").modal('hide');
            } else {
                $rootScope.showToast(data.message);
            }
        }).error(function(data) {
            $rootScope.showToast('修改失败');
        })
    };


    // 7.删除代码分析策略
    // (1)打开删除模态框--列表页点击【删除】按钮触发
    $scope.delTactics = function(itemId, index) {
        $scope.delTacticsId = itemId;
        $scope.dialog = {
            header: '删除',
            status: 'del'
        };
    };
    // (2)确认删除代码分析策略
    $scope.delTacticsConfirm = function() {
        $http({
            'method': 'DELETE',
            'url': interface_url + '/codeAnalysis/tactics/' + $scope.delTacticsId + '/',
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
                $scope.getTacticsList();
            } else {
                $rootScope.showToast(data.message);
            }
        }).error(function(data) {
            $rootScope.showToast('删除失败');
        })
    };

    // 8.禁用代码分析策略
    // (1)打开禁用模态框--列表页点击【禁用】按钮触发
    $scope.disableTactics = function(itemId, index) {
        console.log(itemId)
        $scope.dialog = {
            header: '禁用',
            status: 'disable'
        };
        $scope.disableTacticsId = itemId;
        $scope.disableIndex = index;
    };
    // (2)确认禁用代码分析策略
    $scope.disableTacticsConfirm = function() {
        $http({
            'method': 'POST',
            'url': interface_url + '/codeAnalysis/tactics/' + $scope.disableTacticsId + '/',
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
                $scope.tacticsList[$scope.disableIndex].is_active = false;
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
            tacticsName: '', // 策略名称
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
    function getSystem(productId, callback) {
        $http({
            'method': 'GET',
            'url': interface_url + '/codeAnalysis/system/search/?product=' + productId,
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
    // 通用方法，获取获取环境列表并执行回调函数--模态框初始化时触发(新增触发、查看修改时反显触发)
    function getEnv(callback) {
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
                $scope.envList = data && data.result;
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
        } else if ($scope.params.tacticsName === '') {
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
    .controller('codeAnaly', codeAnaly) // 代码分析管理===代码分析策略
