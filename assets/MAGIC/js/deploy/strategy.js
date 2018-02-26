/**
 * Created by Administrator on 2017/9/14.
 */
/**
 * 部署管理-->部署策略
 */
function strategy($scope, $rootScope, $http, interface_url) {
    // 部署类型
    $scope.deployType = [{
        type: 'maven-tomcat'
    }, {
        type: 'maven-java'
    }, {
        type: 'android'
    }, {
        type: 'ios'
    }, {
        type: 'h5'
    }];
    // 分页开始
    //点击分页执行的函数
    $scope.changePageFun = function(pageNumber) {
        $http({
            'method': 'GET',
            'url': interface_url + '/gdc/tactics/',
            'params': {
                'page': pageNumber,
                'is_active': 'all',
                'product': $scope.product_case,
                'system': $scope.system_case,
            },
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function(data) {
            if (data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            } else if (data.code === 200 || data.code === '200') {
                $scope.strategyList = data.result;
            } else {
                $rootScope.showToast(data.message);
            }
        }).error(function(data) {
            console.info('获取列表方法-分页error');
        })
    };
    //创建分页
    $scope.initPageCompomentFun = function(count, select) {
        $(select).createPage({
            pageCount: count,
            current: 1,
            backFn: function(page_number) {
                console.log(page_number);
                $scope.pageNum = page_number;
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
    // 1、获取策略列表
    $scope.strategyList = [];
    $scope.getStrategyList = function() {
        $scope.pageNum = 1;
        $scope.forInitPage = true;
        $http({
            'method': 'GET',
            'params': {
                'is_active': 'all',
                'page': 1
            },
            'url': interface_url + '/gdc/tactics/',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function(data) {
            if (data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            } else if (data.code === 200 || data.code === '200') {
                $scope.strategyList = data.result;
                $scope.initPageCompomentFun(data.allPage, ".forInit .tcdPageCode");
            } else {
                $rootScope.showToast(data.message);
            }
        }).error(function(data) {});
    };
    $scope.getStrategyList();
    // 2、查询系统列表
    // 获取部门列表
    //获取产品列表
    $scope.productList = [];
    $scope.getProductMethod = function() {
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/product/list/?format=json',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function(data) {
            if (data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            } else if (data.code === 200 || data.code === '200') {
                $scope.productList = data.result;
                $scope.queryProductList = data.result;
            } else {
                $rootScope.showToast(data.message);
            }
        }).error(function(data) {
            $rootScope.showToast('获取产品列表失败');
        });
    };
    $scope.getProductMethod();
    // 先选择产品，在选择系统，根据产品选择系统，系统中获取到warehouse参数，把warehouse作为入参到分支接口中
    $scope.queryFlag = '';
    $scope.getSystemMethod = function(productid, callback) {
        // if (!$scope.querySystemParam.department)return;
        // // 获取部门下的产品列表
        // $scope.queryFlag = 1;
        // var departmentid = $scope.querySystemParam.department.id;
        $http({
            'method': 'GET',
            'url': interface_url + '/gdc/system/?product=' + productid,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function(data) {
            if (data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            } else {
                if (data.code === 200 || data.code === '200') {
                    $scope.systemList = data.result;
                    if ($scope.queryFlag === 1 || $scope.queryFlag === '1') {
                        $scope.querySystemList = data.result;
                    }
                    callback && callback();
                } else {
                    $rootScope.showToast(data.message);
                }
            }
        }).error(function(data) {
            $rootScope.showToast('获取失败');
        })
    };
    $scope.queryProduct = function() {
        if (!$scope.querySystemParam.product) return;
        // 获取当前产品下的 系统
        $scope.queryFlag = 1;
        $scope.getSystemMethod($scope.querySystemParam.product.uuid);
    };
    // 从选择的系统中获取warehouse参数
    $scope.getWarehouse = function() {
        $scope.warehouseUuid = $scope.params.system && $scope.params.system.warehouse;
    };
    // 点击查询
    $scope.queryCase = function() {
        $scope.pageNum = 1;
        $scope.forInitPage = false;
        $scope.product_case = $scope.querySystemParam.product ? $scope.querySystemParam.product.uuid : '';
        $scope.system_case = $scope.querySystemParam.system ? $scope.querySystemParam.system.uuid : '';
        var sendData = {
            'system': $scope.system_case,
            'product': $scope.product_case,
            'is_active': 'all',
            'page': 1
        }
        $http({
            'method': 'GET',
            'url': interface_url + '/gdc/tactics/?format=json',
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

    // 初始化参数，清空新增完保存的数据
    $scope.initParam = function() {
        $scope.params = {
            product: '',
            system: '',
            env: '',
            name: '',
            branch_type: '',
            branch_name: '',
            build_type: '',
            source_path: '',
            compile_path: '',
            compile_file: '',
            compile_source_path: '',
            compile_source_branch: '',
            deploy_type: '',
            scheme_name: '',
            configuration: '',
            sdk: '',
            server: '',
            upBagName: '',
            upPath: '',
            proPath: '',
            is_active: false
            // board: '',
            // sort_priority: ''
        };
    };
    // 打开新增页面，初始化参数，配置dialog的内容
    $scope.openStrategy = function() {
        $scope.initParam();
        $scope.params.board = $scope.boardShow[0];
        $scope.dialog = {
            header: '新增策略',
            input_isClick: false,
            add: true,
            status: 'create'
        };
        // 编译自定义参数
        $scope.complieCustomParams = [ // 初始为空
            // {
            //     key: '',
            //     value: '',
            //     is_select: false
            // }
        ];
        // 编译参数组
        $scope.compileParams = [ // 编译参数组第一组、第二组...
            {
                compile_file: '',
                compile_path: '',
                is_select: false
            }
        ];
        // 服务器自定义参数组
        $scope.serverParams = [ // 服务器第一组、第二组...
            {
                server: '', // 部署服务器
                upBagName: '', // 上传报名
                upPath: '', // 上传路径
                proPath: '', // 进程路径
                params: [ // 自定义参数第一组、第二组... 初始为空
                    // {
                    //     key: '',
                    //     value: '',
                    //     is_select: false
                    // }
                ]
            }
        ];
    };
    $scope.productNameList = []; // 所有产品的列表
    // 获取产品的接口
    $http({
        'method': 'GET',
        'url': interface_url + '/interface/product/list/?format=json',
        'headers': {
            'Authorization': 'Token ' + localStorage.getItem('auth_token')
        }
    }).success(function(data) {
        if (data.code === 403 || data.code === '403') {
            $rootScope.showLogin();
        } else if (data.code === 200 || data.code === '200') {
            $scope.productNameList = data.result;
        } else {
            $rootScope.showToast(data.message);
        }
    }).error(function(data) {
        $rootScope.showToast("获取失败");
    });
    $scope.warehouseList = []; // 数据仓库的列表
    // 获取某个产品下的系统====zxh
    $scope.getSystem = function(productid, callback) {
        $http({
            'method': 'GET',
            'url': interface_url + '/gdc/system/search/?product=' + productid,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function(data) {
            if (data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            } else if (data.code === 200 || data.code === '200') {
                $scope.systemList = data.result;
                callback && callback();
            } else {
                $rootScope.showToast(data.message);
            }
        }).error(function(data) {})
    };
    // 先选择产品，再根据产品选择数据仓库
    $scope.selectedProduct = function() {
        if (!$scope.params.product) return;
        //根据产品选择系统
        if ($scope.params.product) {
            $scope.getSystem($scope.params.product.uuid);
        }
    };
    //获取环境数据
    $scope.envlList = [];
    $scope.getEnvList = function() {
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/env/list/?format=json',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function(data) {

            // console.log(data.result)
            if (data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            } else if (data.code === 200 || data.code === '200') {
                // console.log(data.result)
                $scope.envList = data.result;
            } else {
                $rootScope.showToast(data.message);
            }
        }).error(function(data) {
            // $scope.caseEnvlList = data;
            $rootScope.showToast('获取环境列表失败');
        });
    };
    $scope.getEnvList();

    // 获取分支列表,需要入参：warehouse
    $scope.sourceCodeBranchList = [];
    $scope.selectedSourceType = function(warehouseid) {
        $scope.sourceCodeBranchList = [];
        $http({
            'method': 'GET',
            'params': {
                'warehouse': $scope.warehouseUuid
            },
            'url': interface_url + '/gdc/branch/',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function(data) {
            if (data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            } else if (data.code === 200 || data.code === '200') {
                if (data.result) {
                    // 将data.result中types_of和当前选择的分支类型一致的项，存入sourceCodeBranchresult中(判断是否一一对应)
                    for (var i = 0; i < data.result.length; i++) {
                        if ($scope.params.branch_type === data.result[i].types_of) {
                            $scope.sourceCodeBranchList.push(data.result[i]);
                        }
                    }
                }
            }
        }).error(function(data) {
            $rootScope.showToast('获取失败');
        })
    };
    // 获取部署服务器列表
    $scope.serverList = [];
    $scope.geServerList = function() {
        if ($scope.serverList.length == 0) {
            $http({
                'method': 'GET',
                'url': interface_url + '/interface/server/list/',
                'headers': {
                    'Authorization': 'Token ' + localStorage.getItem('auth_token')
                }
            }).success(function(data) {
                if (data.code === 403 || data.code === '403') {
                    $rootScope.showLogin();
                } else if (data.code === 200 || data.code === '200') {
                    $scope.serverList = data.result;
                } else {
                    $rootScope.showToast(data.message);
                }
            }).error(function(data) {});
        }
    };
    $scope.geServerList();
    //判断部署类型
    $scope.isIOS = false;
    $scope.marven = false;
    $scope.selectDeployType = function() {
        $scope.isIOS = false;
        $scope.marven = false;
        if (!$scope.params.deploy_type) return;
        if ($scope.params.deploy_type.type === 'ios') {
            $scope.isIOS = true;
        } else if ($scope.params.deploy_type.type === 'maven-tomcat' || $scope.params.deploy_type.type === 'maven-java') {
            $scope.isIOS = false;
            $scope.marven = true;
        }
    }
    // 编译文件名和编译路径组合点击加号，增加组合输入框
    $scope.compliePlus = function () {
        $scope.compileParams.push({
            compile_file: '',
            compile_path: '',
            is_select: false
        });
    };
    // 编译文件名和编译路径组合点击减号框，删除最后一个组合输入框
    $scope.complieMinus = function () {
        if ($scope.compileParams.length > 1) {
            $scope.compileParams.splice($scope.compileParams.length - 1, 1);
        } else {
            $rootScope.showToast('原始参数，不能删除');
        }
    };
    // 增加服务器组合
    $scope.addServer = function () {
        // 服务器自定义参数组
        $scope.serverParams.push({
            server: '', // 部署服务器
            upBagName: '', // 上传报名
            upPath: '', // 上传路径
            proPath: '', // 进程路径
            params: [] // 自定义参数第一组、第二组...初始化为空
        });
    };
    // 删除最后一个服务器组合
    $scope.reduceServer = function () {
        if ($scope.serverParams.length > 1) {
            $scope.serverParams.splice($scope.serverParams.length - 1, 1);
        } else {
            $rootScope.showToast('原始参数，不能删除');
        }
    };
    // 自定义参数点击加号，增加输入框（编译用）
    $scope.complieCustomPlus = function (name, index) {
        $scope[name].push({
            key: '',
            value: '',
            is_select: false
        });
    };
    // 自定义参数点击减号框，删除本输入框（编译用）
    $scope.complieCustomMinus = function (name, index) {
        if ($scope[name].length > 0) {
            $scope[name].splice(index, 1);
        }
    };
    /**
     * 服务器部署自定义参数，增加输入框（服务器用）
     * @param  {string} name1  serverParams 服务器组
     * @param  {string} name2  params 自定义参数组
     * @param  {int} index1 服务器组中的index
     * @param  {int} index2 自定义参数组中的index
     * @return 给指定自定义参数组中加入一组参数
     */
    $scope.serverCustomPlus = function (name1, name2, index1, index2) {
        if (!$scope[name1][index1]) return;
        $scope[name1][index1][name2].push({
            key: '',
            value: '',
            is_select: false
        });
    };
    /**
     * 服务器部署自定义参数，删除输入框（服务器用）
     * @param  {string} name1  serverParams 服务器组
     * @param  {string} name2  params 自定义参数组
     * @param  {int} index1 服务器组中的index
     * @param  {int} index2 自定义参数组中的index
     * @return 给指定自定义参数组中减少一组参数
     */
    $scope.serverCustomMinus = function (name1, name2, index1, index2) {
        if (!$scope[name1][index1]) return;
        if ($scope[name1][index1][name2].length > 0) {
            $scope[name1][index1][name2].splice(index2, 1);
        }
    };
    // 转换为键值对;
    $scope.transKeyValue = function(arr) {
        if (!arr) return;
        var res = {}; //0311==没有值的时候传空字符串==zxh
        for (var i = 0; i < arr.length; i++) {
            // console.log(arr);
            if (arr[i].is_select) {
                if (arr[i].key === '') {
                    res = '';
                } else {
                    res[arr[i].key] = '${' + arr[i].value + '}$';
                }
            } else {
                if (arr[i].key === '') {
                    res = '';
                } else {
                    res[arr[i].key] = arr[i].value;
                }
            }
            //res[arr[i].key] = '${' + arr[i].value + '}$';
        }
        if (res === '') {
            return res;
        } else {
            return JSON.stringify(res);
        }
    };
    // 将字符串json  转换为数组 用来 ng-repeat
    $scope.transToArray = function(str) {
        if ($scope.dialog.status === 'create') {
            if (str) {
                var obj = JSON.parse(str);
                var resArr = [];
                for (var i in obj) {
                    resArr.push({
                        key: i,
                        value: '',
                        valueHide: obj[i]
                    });
                }
                //$scope.originParamsList = resArr;
                return resArr;
            } else {
                var resArr = [];
                resArr.push({
                    key: '',
                    value: '',
                    valueHide: '',
                    isDisabled: true
                });
                //$scope.originParamsList = resArr;
                return resArr;
            }
        } else {
            if (str) {
                var obj = JSON.parse(str);
                var resArr = [];
                for (var i in obj) {
                    resArr.push({
                        key: i,
                        value: obj[i],
                        valueHide: ''
                    });
                }
                //$scope.originParamsList = resArr;
                return resArr;
            } else {
                var resArr = [];
                resArr.push({
                    key: '',
                    value: '',
                    valueHide: '',
                    isDisabled: true
                });
                //$scope.originParamsList = resArr;
                return resArr;
            }
        }
    };

    // 是否显示看板选项
    $scope.boardShow = [{
            is_board_display: true,
            description: '是'
        },
        {
            is_board_display: false,
            description: '否'
        }
    ];
    // 3、添加策略
    $scope.addStrategyConfirm = function() {
        if (!$scope.params.product) {
            $rootScope.showToast('请选择产品');
            return;
        }
        if (!$scope.params.system) {
            $rootScope.showToast('请填写系统名称');
            return;
        }
        if (!$scope.params.branch_name && !$scope.params.branchInputName) {
            $rootScope.showToast('如果没有想选择的分支名字，请手动输入');
            return;
        }
        //编译参数
        var compile_params = {
            'compile_file': $sceop.params.compile_file,
            'compile_path': $sceop.params.compile_path
        }
        //部署服务器参数
        var deploy_params = {
            'server': $scope.params.server,
            'upload_package_name': $scope.params.upBagName,
            'upload_path': $scope.params.upPath,
            'progress': $scope.params.proPath
        }
        //添加系统需要的入参
        var paramsAll = {
            'name': $scope.params.name, //策略
            'env': $scope.params.env.uuid, //环境
            'system': $scope.params.system, //系统
            'branch_type': $scope.params.branch_type, //分支类型
            'branch_name': $scope.params.branch_name ? $scope.params.branch_name.name : $scope.params.branchInputName, //分支名字
            'build_type': $scope.params.deploy_type, //部署类型(写死)
            'compile_params': $scope.compile_params, //编译参数(包含编译文件名和编译路径,key:value形式存在)(compile_file:'',compile_path:'')
            'source_path': $scope.params.source_path, //源码路径
            'compile_source_path': $scope.params.compile_source_path, //编译源码路径
            'compile_source_branch': $scope.params._source_branch, //编译源码分支
            'scheme_name': $scope.params.scheme_name, //部署类型为ios时
            'configuration': $scope.params.configuration, // 部署类型为iOS时
            'sdk': $scope.params.sdk, //部署类型为iOS时
            'deploy_params': $scope.deploy_params, //部署服务器参数4个(key:value形式)(server:'',upload_package_name:'',upload_path:'',progress:'')
            // 'deploy_params':$scope.params.deploy_params,  //部署服务器的接口：http://ip:port/interface/server/list/
            'is_active': $scope.params.is_active
        };
        $http({
            'method': 'POST',
            'url': interface_url + '/gdc/tactics/',
            'data': paramsAll,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function(data) {
            if (data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
                $('#myModal').modal('hide');
            } else if (data.code === 201 || data.code === '201') {
                $rootScope.showToast('添加系统成功');
                $('#myModal').modal('hide');
                //$scope.seeSystem(data.result.uuid);
                $scope.getStrategyList();
            } else {
                $rootScope.showToast(data.message);
            }
        }).error(function(data) {
            $rootScope.showToast(data.message);
        })
    };
    /**
     * 3、查看策略
     * @param  {[string]} itemId [查看的id]
     * @return {[type]}        [description]
     */
    $scope.seeStrategy = function(itemId) {
        $scope.dialog = {
            header: '查看',
            input_isClick: true,
            detail: true,
            status: 'see'
        };
        $scope.getStrategyDetail(itemId);
    };
    // 通过id查看策略详情的方法
    $scope.getStrategyDetail = function(id) {
        $http({
            'method': 'GET',
            'url': interface_url + '/gdc/tactics/' + id + '/',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function(data) {
            if (data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            } else if (data.code === 200 || data.code === '200') {
                $scope.params = data.result;
                $scope.params.systemName = data.result.name;
                $scope.params.systemDes = data.result.description;
                if ($scope.dialog.status === 'see' || $scope.dialog.status === 'modify') {
                    // 渲染产品
                    for (var i = 0; i < $scope.productNameList.length; i++) {
                        if ($scope.productNameList[i].id == data.result.product) {
                            $scope.params.productName = $scope.productNameList[i];
                            break;
                        }
                    };
                    // 是否显示看板
                    for (var j = 0; j < $scope.boardShow.length; j++) {
                        if ($scope.boardShow[j].is_board_display == data.result.is_board_display) {
                            $scope.params.board = $scope.boardShow[j];
                            break;
                        }
                    };
                    //20170829渲染数据仓库
                    var productId = data.result.product;
                    var warehouseId = data.result.warehouse;
                    $http({
                        'method': 'GET',
                        'url': interface_url + '/gdc/warehouse/?product_id=' + productId,
                        'headers': {
                            'Authorization': 'Token ' + localStorage.getItem('auth_token')
                        }
                    }).success(function(data) {
                        if (data.code === 403 || data.code === '403') {
                            $rootScope.showLogin();
                        } else {
                            if (data.code === 200 || data.code === '200') {
                                $scope.warehouseList = data.result;
                                for (var i = 0; i < $scope.warehouseList.length; i++) {
                                    if ($scope.warehouseList[i].id == warehouseId) {
                                        $scope.params.warehouse = $scope.warehouseList[i].name;
                                        break;
                                    }
                                }
                            } else {
                                $rootScope.showToast(data.message);
                            }
                        }
                    }).error(function(data) {
                        $rootScope.showToast("渲染数据仓库失败");
                    })
                }
            } else {
                $rootScope.showToast(data.message);
            }
        }).error(function(data) {
            $rootScope.showToast('查看系统详情失败');
        });
    };

    // 4、要修改的id
    $scope.editStrategyId = '';
    /**
     * [editCase 修改情况下]
     * @param  {[string]} itemId [修改的id
     * @return {[type]}        [description]
     */
    $scope.editStrategy = function(itemId) {
        $scope.dialog = {
            header: '修改',
            input_isClick: false,
            add: true,
            status: 'modify'
        };
        $scope.editStrategyId = itemId;
        $scope.getStrategyDetail(itemId);
    };
    // 确认修改策略
    $scope.editStrategyConfirm = function() {
        var paramsAll = {
            'name': $scope.params.name, //策略
            'env': $scope.params.env, //环境
            'system': $scope.params.system, //系统
            'branch_type': $scope.params.branch_type, //分支类型
            'branch_name': $scope.params.branch_name, //分支名字
            'build_type': $scope.params.deploy_type.uuid, //部署类型(写死)
            'compile_params': $scope.params.compile_params, //编译参数(包含编译文件名和编译路径,key:value形式存在)(compile_file:'',compile_path:'')
            'source_path': $scope.params.source_path, //源码路径
            'compile_source_path': $scope.params.compile_source_path, //编译源码路径
            'compile_source_branch': $scope.params.compile_source_branch, //编译源码分支
            'scheme_name': $scope.params.scheme_name, //部署类型为ios时
            'configuration': $scope.params.configuration, // 部署类型为iOS时
            'sdk': $scope.params.sdk, //部署类型为iOS时
            'deploy_params': $scope.params.deploy_params, //部署参数4个(key:value形式)(server:'',upload_package_name:'',upload_path:'',progress:'')
            // 'deploy_params':$scope.params.deploy_params,  //部署服务器的接口：http://ip:port/interface/server/list/
            'is_active': $scope.params.is_active
        };
        $http({
            'method': 'POST',
            'url': interface_url + '/gdc/tactics/' + $scope.editStrategyId + '/',
            'data': paramsAll,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function(data) {
            if (data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
                $('#myModal').modal('hide');
            } else if (data.code === 202 || data.code === '202') {
                $rootScope.showToast('修改成功');
                $scope.getStrategyList();
                $("#myModal").modal('hide');
            } else {
                $rootScope.showToast(data.message);
            }
        }).error(function(data) {
            $rootScope.showToast('修改失败');
        })
    };
    // 删除
    $scope.delStrategyId = '';
    // 获取某条要删除系统的id
    $scope.delStrategy = function(itemId, index) {
        $scope.delStrategyId = itemId;
        $scope.delIndex = index;
        $scope.dialog = {
            header: '删除',
            status: 'del'
        };
    };
    // 确认删除
    $scope.delStrategyConfirm = function() {
        $http({
            'method': 'DELETE',
            'url': interface_url + '/gdc/tactics/' + $scope.delStrategyId + '/',
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
                $scope.getStrategyList();
            } else {
                $rootScope.showToast(data.message);
            }
        }).error(function(data) {
            $rootScope.showToast('删除失败');
        })
    };

    // 禁用某条代码分支
    $scope.disableStrategyId = '';
    $scope.disableStrategy = function(itemId, index) {
        console.log(itemId)
        $scope.dialog = {
            header: '禁用',
            status: 'disable'
        };
        $scope.disableStrategyId = itemId;
        $scope.disableIndex = index;
    };
    // 确认禁用
    $scope.disableStrategyConfirm = function() {
        $http({
            'method': 'POST',
            'url': interface_url + '/gdc/tactics/' + $scope.disableStrategyId + '/',
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
                $scope.strategyList[$scope.disableIndex].is_active = false;
                $("#DisableModel").modal('hide');
            } else {
                $rootScope.showToast(data.message);
            }
        }).error(function(data) {
            $rootScope.showToast('禁用失败');
        });
    };
}
/**
 * Pass all functions into module
 */
angular
    .module('inspinia')
    .controller('strategy', strategy) // 部署管理-->部署策略
