/**
 * Created by Administrator on 2017/6/6.
 */
/**
 * Created by Administrator on 2017/5/17.
 */
/**
 * 部署管理-->分支管理
 * @param {any} $scope
 * @param {any} $rootScope
 * @param {any} $http
 */
function branchManage($scope, $rootScope, $http, interface_url) {
    // 获取产品==zxh
    $scope.productList = [];
    $scope.getProductList = function () {
        if ($scope.productList.length == 0) {
            $http({
                'method': 'GET',
                'url': interface_url + '/interface/product/list/?format=json',
                'headers': {
                    'Authorization': 'Token ' + localStorage.getItem('auth_token')
                }
            }).success(function (data) {
                if (data.code === 403 || data.code === '403') {
                    $rootScope.showLogin();
                } else if (data.code === 200 || data.code === '200') {
                    $scope.productList = data.result;
                    $scope.queryProductList = data.result;
                } else {
                    $rootScope.showToast(data.message);
                }
                //console.info(data);
            }).error(function (data) {
                //console.info(data);
                $rootScope.showToast('获取产品列表失败');
            });
        }
    };
    $scope.getProductList();
    // 先选择产品，在选择系统，根据产em品选择系统
    // var querySystemList = [];
    $scope.queryFlag = '';
    $scope.getCaseSystem = function (productid, callback) {
        $http({
            'method': 'GET',
            'url': interface_url + '/gdc/system/?product_id=' + productid,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
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
        }).error(function (data) {
            $rootScope.showToast('获取失败');
        })
    };
    $scope.queryProduct = function () {
        if (!$scope.queryDetailParam.product) return;
        // 获取当前产品下的 系统
        $scope.queryFlag = 1;
        $scope.getCaseSystem($scope.queryDetailParam.product.uuid);
    };

    // 获取环境数据
    $scope.caseEnvlList = [];
    $scope.getEnvList = function () {
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/env/list/?format=json',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if (data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            } else if (data.code === 200 || data.code === '200') {
                $scope.caseEnvlList = data.result;
            } else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            $scope.caseEnvlList = data;
            $rootScope.showToast('获取环境列表失败');
        });
    };
    $scope.getEnvList(); //  渲染列表数据
    // 点击查询
    $scope.queryCaseJob = function () {
        $scope.pageNum = 1;
        $scope.forInitPage = false;
        $scope.product_id = $scope.queryDetailParam.product ? $scope.queryDetailParam.product.uuid : '';
        $scope.system_id = $scope.queryDetailParam.system ? $scope.queryDetailParam.system.uuid : '';
        $http({
            'method': 'GET',
            'url': interface_url + '/gdc/tactics/?format=json',
            'params': {
                'product': $scope.product_id,
                'system': $scope.system_id,
                // 'env_id': $scope.env_id,
                'page': 1,
                'is_active': 'all'
            },
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if (data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            } else if (data.code === 200 || data.code === '200') {
                if (data.result) {
                    $scope.jobConstructList = data.result;
                    $scope.initPageCompomentFun(data.allPage, ".forSearch .tcdPageCode");
                }
            }
        }).error(function (data) {
            $rootScope.showToast('查询失败');
        });
    };
    // 引用结束

    //从系统中获取warehouse参数
    // $scope.getWarehouse = function () {
    //     $scope.warehouseUuid = $scope.params.system.warehouse;
    // };
    // 获取分支列表,需要入参：warehouse
    $scope.sourceCodeBranchList = [];
    $scope.selectedSourceType = function () {
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
        }).success(function (data) {
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
                    for (var i = 0; i < $scope.sourceCodeBranchList.length; i++) {
                        if ($scope.branch_name === $scope.sourceCodeBranchList[i].name) {
                            $scope.params.branch_list = $scope.sourceCodeBranchList[i]
                        }
                    }
                }
            }
        }).error(function (data) {
            $rootScope.showToast('获取失败');
        })
    };

    //$scope.IsAdminUser = sessionStorage.getItem('IsAdminUser'); // 权限
    // 获取部署系统列表==bug134==zxh==0413
    $scope.deploySystemList = [];
    $scope.getDeploySystemList = function () {
        if ($scope.deploySystemList.length == 0) {
            $http({
                'method': 'GET',
                'url': interface_url + '/gdc/tactics/?format=json',
                'params': {
                    'system_type': 'gdc'
                },
                'headers': {
                    'Authorization': 'Token ' + localStorage.getItem('auth_token')
                }
            }).success(function (data) {
                if (data.code === 403 || data.code === '403') {
                    $rootScope.showLogin();
                } else if (data.code === 200 || data.code === '200') {
                    $scope.deploySystemList = data.result;
                } else {
                    $rootScope.showToast(data.message);
                }

            }).error(function (data) {});
        }
    };
    $scope.getDeploySystemList();
    $scope.selectedDeployCode = function () {
        if (!$scope.params.deploy_warehouse) return;
        $scope.getDeployCodeBranchList($scope.params.deploy_warehouse.uuid);
    }

   
    // 选择部署服务器
    $scope.selectServer = function () {
        //0414==zxh==bug146==任务--接口任务和部署任务，部分入参传入修改
        for (var i = 0; i < $scope.multiParams.length; i++) {
            for (var j = 0; j < $scope.multiParams[i].length; j++) {
                if ($scope.multiParams[i][j].key == 'deploy_server') {
                    $scope.multiParams[i][j].value = $scope.params.deploy_server.id;
                };
            };
        }
    };
    // 获取部署服务器列表==0412==zxh==bug112统一部署-任务，新增和修改界面的调整。
    $scope.deployServerList = [];
    $scope.getDeployServerList = function () {
        if ($scope.deployServerList.length == 0) {
            $http({
                'method': 'GET',
                'url': interface_url + '/interface/server/list/',
                'headers': {
                    'Authorization': 'Token ' + localStorage.getItem('auth_token')
                }
            }).success(function (data) {
                if (data.code === 403 || data.code === '403') {
                    $rootScope.showLogin();
                } else if (data.code === 200 || data.code === '200') {
                    $scope.deployServerList = data.result;
                } else {
                    $rootScope.showToast(data.message);
                }
            }).error(function (data) {});
        }
    };
    $scope.getDeployServerList();
    $scope.originParamsList = [];
    $scope.transToArrayOnly = function (str) {
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
    // 通过构建类型获取构建步骤0323
    $scope.stepList = [];
    $scope.searchResultFlag = false;
    $scope.getStepListMethod = function (buildType, callback) {
        /*$http({
         'method': 'GET',
         'url': interface_url + '/gdc/jobstep/?build_type=' + buildType,
         'headers': {
         'Authorization': 'Token ' + localStorage.getItem('auth_token')
         }
         }).success(function (data) {
         if (data.code === 200 || data.code === '200'){
         $scope.searchResult = $scope.stepList = data.result;
         if ($scope.stepList) {
         //console.log($scope.stepList.length)
         if($scope.stepList.length !== 0){
         $scope.searchResultFlag = true;
         }
         }
         callback && callback();
         }else {
         $rootScope.showToast(data.message);
         }
         }).error(function (data) {
         console.info('获取列表失败')
         })*/
    };
    // 保存搜索结果中被选择的item
    $scope.selectSearchResult = [];
    // 检索词汇
    $scope.searchWord = '';
    // 默认情况下，接口列表为隐藏
    $scope.searchResultIsShow = false;
    //  检测 searchWord，如果有变化，执行模糊搜索
    $scope.$watch('searchWord', function () {
        // console.log($scope.searchWord);
        // 检索词为空，返回； 若果加载页面，会执行一次，此时$scope.stepList尚未获取到，for循环的时候会报错；
        //$scope.searchResultIsShow = true;
        // 临时保存数组
        var tempArr = [];
        for (var i = 0; i < $scope.stepList.length; i++) {
            if ($scope.stepList[i].description.indexOf($scope.searchWord) > -1) {
                tempArr.push($scope.stepList[i]);
            }
        }
        // 更改搜索结果的数组数据，更新页面；
        $scope.searchResult = tempArr;
    });

    /**
     * 点击检索到的列表item，将该item放入   $scope.selectSearchResult
     * @param  {[string]}  [检错列表的索引 index]
     * @return {[type]}       [description]
     */
    $scope.selectSearchItem = function (index) {
        for (var i = 0; i < $scope.selectSearchResult.length; i++) {
            // 如果选中之后的列表中已经有改item，不再添加，拒绝重复;
            if ($scope.selectSearchResult[i].uuid === $scope.searchResult[index].uuid) {
                return false;
            }
        }
        $scope.selectSearchResult.push($scope.searchResult[index]);
    };
    /**
     * 整理选择排序后的 selectSearchResult，作为修改，增加case的参数
     * @return {[arr]} [description]
     */
    $scope.organizeCorr_data = function () {
        var arr = [];
        for (var i = 0; i < $scope.selectSearchResult.length; i++) {
            arr.push($scope.selectSearchResult[i].uuid);
        }
        return arr.toString();
    }
    // dialog配置
    $scope.dialog = {
        header: '',
        input_isClick: false,
        detail: false,
        add: false,
        edit: false,
        status: ''
    };
    // 初始化参数，清空新增完保存的数据
    $scope.initParam = function () {
        $scope.params = {
            name: '',
            job_name: '',
            deploy_system: '',
            jenkins: '',
            source_warehouse: '',
            source_branch: '',
            types_of: '',
            source_warehouse_subdirectory: '',
            deploy_warehouse: '',
            deploy_branch: '',
            deploy_warehouse_subdirectory: '',
            interface_warehouse: '',
            interface_branch: '',
            interface_warehouse_subdirectory: '',
            poll_scm: '',
            gitLab_hook_branch_name: '',
            build_type: '',
            deploy_server: '',
            job_step: '',
            is_active: false
        };
        // params
        $scope.multiParams = [
            [{
                key: '',
                value: '',
                isDisabled: true,
                is_select: false
            }]
        ];
    };
    // [plus 增加输入框]
    $scope.plus = function (current, index) {
        current.splice([index + 1], 0, {
            key: '',
            value: '',
            isDisabled: true,
            is_select: false
        });
    };
    // 点击减号框，删除本输入框
    $scope.minus = function (current, index) {
        var myKey = current.slice(index)[0].key;
        var displayFlag = true;
        for (var i = 0; i < $scope.originParamsList.length; i++) {
            if ($scope.originParamsList[i].key == myKey) {
                displayFlag = false;
                break;
            }
        }
        if (displayFlag) {
            if (current.length > 1) {
                current.splice(index, 1);
            }
        } else {
            $rootScope.showToast('原始参数，不能删除');
        }
    };
    // 转换为键值对;
    $scope.transKeyValue = function (arr) {
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
    $scope.transToArray = function (str) {
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
    $scope.jobConstructList = [];
    // 获取策略列表接口
    $scope.getJobConstructList = function () {
        $scope.pageNum = 1;
        $scope.forInitPage = true;
        $http({
            'method': 'GET',
            'url': interface_url + '/gdc/tactics/?format=json',
            'params': {
                'is_active': 'all',
                'page': 1
            },
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (resp) {
            if (resp.code === 403 || resp.code === '403') {
                $rootScope.showLogin();
            } else if (resp.code === 200 || resp.code === '200') {
                if (resp.result) {
                    $scope.jobConstructList = resp.result;
                    $scope.initPageCompomentFun(resp.allPage, ".forInit .tcdPageCode");
                }
            } else {
                $rootScope.showToast(resp.message)
            }
        }).error(function (data) {
            $rootScope.showToast('获取策略列表失败');
        });
    };
    // 调用job接口
    $scope.getJobConstructList();
    // 分页开始
    //点击分页执行的函数
    $scope.changePageFun = function (pageNumber) {
        $http({
            'method': 'GET',
            'url': interface_url + '/gdc/tactics/?format=json',
            'params': {
                'product_id': $scope.product_id ? $scope.product_id : '',
                'system_id': $scope.system_id ? $scope.system_id : '',
                'env_id': $scope.env_id ? $scope.env_id : '',
                'page': pageNumber,
                'is_active': 'all'
            },
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (resp) {
            if (resp.code === 403 || resp.code === '403') {
                $rootScope.showLogin();
            } else if (resp.code === 200 || resp.code === '200') {
                $scope.jobConstructList = resp.result;
            } else {
                $rootScope.showToast(resp.message)
            }
        }).error(function (data) {
            //console.info('执行结果列表方法-分页error');
        })
    };
    //创建分页
    $scope.initPageCompomentFun = function (count, select) {
        $(select).createPage({
            pageCount: count,
            current: 1,
            backFn: function (page_number) {
                $scope.pageNum = page_number;
                $scope.changePageFun(page_number);
            }
        })
    };
    // 分页结束
    //把返回的对象转化为数组   guo4.20
    $scope.getAllParams = function () {
        $scope.multiParams = [];
        // console.log($scope.allParamsArr.length);
        if ($scope.allParamsArr) {
            for (var i = 0; i < $scope.allParamsArr.length; i++) {

                var obj = $scope.allParamsArr[i]
                var singleParam = [];
                for (var j in obj) {
                    singleParam.push({
                        key: j,
                        value: obj[j]
                    });
                }
                $scope.multiParams.push(singleParam);
                // console.log( singleParam);
            };
        };
    };
    $scope.getJobConstructDetail = function (obj, itemId, callback) {
    // 查看某条详情的方法
        $http({
            'method': 'GET',
            'url': interface_url + '/gdc/tactics/' + itemId + '/?format=json',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if (data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            } else {
                $scope[obj] = data.result;
                $scope.params = data.result;

                $scope.params.branch_type = data.result.branch_type;
                $scope.branch_name = data.result.branch_name;
                // 获取系统的uuid
                console.log(data.system)
                var systemUuid = data.result.system;
                // 调用接口通过系统的uuid获取该系统的所有信息
                $http({
                    'method': 'GET',
                    'url': interface_url + '/gdc/system/' + systemUuid + '/',
                    'headers': {
                        'Authorization': 'Token ' + localStorage.getItem('auth_token')
                    }
                }).success(function (data) {
                    if (data.code === 403 || data.code === '403') {
                        $rootScope.showLogin();
                    } else if (data.code === 200 || data.code === '200') {
                        // 取得当前系统对应的数据仓库的uuid并存储到scope中
                        $scope.warehouseUuid = data.result.warehouse;
                        // $scope.sourceCodeBranchList = [];
                           
                        // 通过warehouse的uuid获取分支列表
                        $scope.selectedSourceType();
                    } else {
                        $rootScope.showToast(data.message);
                    }

                }).error(function (data) {
                    $rootScope.showToast('获取系统详情异常');
                })
                callback ? callback(data) : '';

            }

        }).error(function (data) {
            $rootScope.showToast('查看Job失败');
        })
    };

    // 通过id查看代码分支的方法
    /*$scope.getDeployTypeDetail = function (id) {
     $http({
     'method': 'GET',
     'url': interface_url + '/gdc/build/type/' + id + '/',
     'headers': {
     'Authorization': 'Token ' + localStorage.getItem('auth_token')
     }
     }).success(function (data) {
     $scope.params = data.result;
     // 查看某个代码分支的情况下，将之前保存的数据渲染出来
     if ($scope.dialog.status === 'see' || $scope.dialog.status === 'modify') {
     // 渲染数据仓库

     }
     }).error(function (data) {
     $rootScope.showToast('查看代码分支失败');
     });
     };*/

    // 要修改的id
    $scope.editJobConstructId = '';
    /**
     * [editCase 修改情况下]
     * @param  {[string]} itemId [修改代码分支的id
     * @return {[type]}        [description]
     */
    $scope.detailJobConstruct = function (itemId) {
        $scope.dialog = {
            header: '详情',
            input_isClick: true,
            add: true,
            edit: true,
            // status: 'see'
        };
        $scope.editJobConstructId = itemId;
        $scope.multiParams = [];
        $scope.getJobConstructDetail('seeJobConstructVal', itemId, function (data) {
            // $scope.paramsArr = JSON.parse($scope.seeJobConstructVal.params);
            // $scope.allParamsArr = $scope.paramsArr;
            // $scope.getAllParams(); //修改部署
            // // 修改部署任务多个入参       guo
            // $scope.addParamsFun = function () {
            //     var beforeParama = $scope.multiParams[0].concat();
            //     for (var i = 0; i < beforeParama.length; i++) {
            //         beforeParama[i] = JSON.parse(JSON.stringify(beforeParama[i]));
            //     };
            //     $scope.multiParams.push(beforeParama);
            // };
            // $scope.reduceParamsFun = function () {
            //     if ($scope.multiParams.length > 1) {
            //         $scope.multiParams.pop();
            //     };
            // };
        });
    };
    $scope.editJobConstruct = function (itemId) {
        $scope.dialog = {
            header: '修改',
            input_isClick: false,
            add: true,
            edit: true,
            status: 'modify'
        };
        $scope.editJobConstructId = itemId;
        $scope.multiParams = [];
        $scope.getJobConstructDetail('editJobConstructVal', itemId, function () {
            if ($scope.editJobConstructVal.params) {
                $scope.paramsArr = JSON.parse($scope.editJobConstructVal.params);
            }
            $scope.allParamsArr = $scope.paramsArr;
            $scope.getAllParams(); //修改部署
        });
    };
    // 确认修改Job
    $scope.editJobConstructConfirm = function () {
        // 把输入的key value数组转换为object
        var ArrForParam = [];
        for (var i = 0; i < $scope.multiParams.length; i++) {
            var now = $scope.transKeyValue($scope.multiParams[i]);
            ArrForParam.push(JSON.parse(now));
        };
        var params = {
            // name: $scope.params.name,
            // system: $scope.params.system_name,
            // env: $scope.params.env,
            branch_type: $scope.params.branch_type,
            branch_name: $scope.params.branch_list.name,
            // is_active: $scope.params.is_active
        };
        $http({
            'method': 'POST',
            'url': interface_url + '/gdc/tactics/' + $scope.editJobConstructId + '/',
            'data': params,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
            
        }).success(function (data) {
            if (data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
                $("#myModal").modal('hide');
            } else if (data.code === 202 || data.code === '202') {
                $rootScope.showToast('修改Job成功');
                // 初始化页面调用代码分支列表
                $scope.getJobConstructList();
                //  `$scope.sourceCodeBranchList = [];
                //  $scope.selectedSourceType ();`
                
                $("#myModal").modal('hide');
            } else {
                $rootScope.showToast(data.message);
            }

        }).error(function (data) {
            $rootScope.showToast('修改Job失败');
        })
    };
}
/**
 * Pass all functions into module
 */
angular
    .module('inspinia')
    .controller('branchManage', branchManage) // 部署管理-->分支管理