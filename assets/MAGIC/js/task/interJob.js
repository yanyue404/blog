/**
 * Created by Administrator on 2017/4/27.
 */
/**
 * 用例管理-->接口job==0317
 * @param {any} $scope
 * @param {any} $rootScope
 * @param {any} $http
 * @param interface_url
 */
function backUseCase_JobInterface($scope, $rootScope, $http, interface_url) {
    // 引用 用例页面的搜索
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
                if (data.code === 403 || data.code === '403'){
                    $rootScope.showLogin();
                }else if (data.code === 200 || data.code === '200'){
                    $scope.productList = data.result;
                    $scope.queryProductList = data.result;
                }else {
                    $rootScope.showToast(data.message);
                }
            }).error(function (data) {
            });
        }
    };
    $scope.getProductList();
    // 先选择产品，在选择系统，根据产品选择系统
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
    $scope.queryProduct = function () {
        if (!$scope.queryDetailParam.product)return;
        // 获取当前产品下的 系统
        $scope.queryFlag = 1;
        var productid = $scope.queryDetailParam.product.id;
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/system/list/?product_id=' + productid,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                    $rootScope.showLogin();
                }else {
            if (data.code === 200 || data.code === '200'){
                $scope.querySystemList = data.result;
                $scope.queryCaseModelList = [];
                // callback && callback();
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
        })
    };
    // 获取某个产品下的系统====zxh
    $scope.getCaseSystem = function (productid, callback) {
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/system/list/?product_id=' + productid,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                    $rootScope.showLogin();
                }else {
            if (data.code === 200 || data.code === '200'){
                $scope.systemList = data.result;
                // callback && callback();
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
        })
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
            if(data.code === 403 || data.code === '403'){
                    $rootScope.showLogin();
                }else {
            if (data.code === 200 || data.code === '200'){
                $scope.caseEnvlList = data.result;
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $scope.caseEnvlList = data.result;
            $rootScope.showToast('获取环境列表失败');
        });
    };
    $scope.getEnvList(); //  渲染列表数据
    // 点击查询
    $scope.queryCaseJob = function () {
        $scope.pageNum=1;
        $scope.forInitPage = false;
        $scope.product_id = $scope.queryDetailParam.product.id;
        $scope.system_id = $scope.queryDetailParam.system?$scope.queryDetailParam.system.id:'';
        $scope.env_id = $scope.queryDetailParam.Env?$scope.queryDetailParam.Env.id:'';
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/jobs/',
            'params': {
                'product_id': $scope.product_id,
                'system_id': $scope.system_id,
                'env_id': $scope.env_id,
                'page': 1,
                'is_active': 'all'
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
                    $scope.jobInterfaceList = data.result;
                    $scope.initPageCompomentFun(data.allPage,".forSearch .tcdPageCode");
                }
            }
        }}).error(function (data) {
            $rootScope.showToast('查询失败');
        });
    };

    // 引用结束
    //$scope.IsAdminUser = sessionStorage.getItem('IsAdminUser'); // 权限
    // 获取部署系统列表
    $scope.deploySystemList = [];
    $scope.getDeploySystemList = function () {
        if ($scope.deploySystemList.length === 0) {
            $http({
                'method': 'GET',
                'url': interface_url + '/interface/envinfo/list/?format=json',
                'params': {
                    'system_type': 'tmc'
                },
                'headers': {
                    'Authorization': 'Token ' + localStorage.getItem('auth_token')
                }
            }).success(function (data) {
                if(data.code === 403 || data.code === '403'){
                    $rootScope.showLogin();
                }else {
                if (data.code === 200 || data.code === '200'){
                    $scope.deploySystemList = data.result;
                }else {
                    $rootScope.showToast(data.message);
                }
            }}).error(function (data) {
            });
        }
    };
    $scope.getDeploySystemList();
    // 获取jenkins列表
    $scope.jenkinsList = [];
    $scope.getJenkinsList = function () {
        if ($scope.jenkinsList.length === 0) {
            $http({
                'method': 'GET',
                'url': interface_url + '/gdc/jenkins/server/?format=json',
                'headers': {
                    'Authorization': 'Token ' + localStorage.getItem('auth_token')
                }
            }).success(function (data) {
                if(data.code === 403 || data.code === '403'){
                    $rootScope.showLogin();
                }else {
                if (data.code === 200 || data.code === '200'){
                    if (data.result) {
                        $scope.jenkinsList = data.result;
                    }
                }
            }}).error(function (data) {
            });
        }
    };
    $scope.getJenkinsList();
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
                    if (data.result) {
                        $scope.dataStorageList = data.result;
                        // console.log($scope.dataStorageList);
                    }
                }
            }}).error(function (data) {
            });
        }
    };
    $scope.getDataStorageList();
    // 获取邮件组列表==bug111==0412==zxh
    $scope.sendMailList = [];
    $scope.getSendMailList = function () {
        if ($scope.sendMailList.length === 0) {
            $http({
                'method': 'GET',
                'url': interface_url + '/gdc/sendmail/',
                'headers': {
                    'Authorization': 'Token ' + localStorage.getItem('auth_token')
                }
            }).success(function (data) {
                if(data.code === 403 || data.code === '403'){
                    $rootScope.showLogin();
                }else {
                if (data.code === 200 || data.code === '200'){
                    if (data.result) {
                        $scope.sendMailList = data.result;
                    }
                }
            }}).error(function (data) {
            });
        }
    };
    $scope.getSendMailList();
    // 根据选择的数据仓库选择分支selectedCode
    /*$scope.selectedCode = function () {
     if (!$scope.params.source_warehouse && !$scope.params.deploy_warehouse && !$scope.params.interface_warehouse)return;
     // 获取当前产品下的 系统
     if($scope.params.source_warehouse.uuid) {
     $scope.getSourceCodeBranchList($scope.params.source_warehouse.uuid);
     } else if ($scope.params.deploy_warehouse.uuid) {
     $scope.getDeployCodeBranchList($scope.params.deploy_warehouse.uuid);
     } else if($scope.params.interface_warehouse.uuid) {
     $scope.getInterCodeBranchList($scope.params.interface_warehouse.uuid);
     }
     };*/
    $scope.selectedSourceCode = function(){
        if (!$scope.params.source_warehouse)return;
        $scope.getSourceCodeBranchList($scope.params.source_warehouse.uuid);
    };
    $scope.selectedDeployCode = function(){
        if (!$scope.params.deploy_warehouse)return;
        $scope.getDeployCodeBranchList($scope.params.deploy_warehouse.uuid);
    };
    $scope.selectedInterfaceCode = function(){
        if (!$scope.params.interface_warehouse)return;
        $scope.getInterCodeBranchList($scope.params.interface_warehouse.uuid);
    };
    // 获取y源代码分支列表
    $scope.sourceCodeBranchList = [];
    $scope.getSourceCodeBranchList = function (warehouseid, callback) {
        $http({
            'method': 'GET',
            'url': interface_url + '/gdc/branch/?warehouse=' + warehouseid,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                    $rootScope.showLogin();
                }else {
            if (data.code === 200 || data.code === '200'){
                if (data.result) {
                    $scope.sourceCodeBranchList = data.result;
                    callback && callback();
                }
            }
        }}).error(function (data) {
        })
    };
    // 获取部署代码分支列表
    $scope.deployCodeBranchList = [];
    $scope.getDeployCodeBranchList = function (warehouseid, callback) {
        $http({
            'method': 'GET',
            'url': interface_url + '/gdc/branch/?warehouse=' + warehouseid,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                    $rootScope.showLogin();
                }else {
            if (data.code === 200 || data.code === '200'){
                if (data.result) {
                    $scope.deployCodeBranchList = data.result;
                    callback && callback();
                }
            }
        }}).error(function (data) {
        })
    };
    // 获取接口代码分支列表
    $scope.interfaceCodeBranchList = [];
    $scope.getInterCodeBranchList = function (warehouseid, callback) {
        $http({
            'method': 'GET',
            'url': interface_url + '/gdc/branch/?warehouse=' + warehouseid,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                    $rootScope.showLogin();
                }else {
            if (data.code === 200 || data.code === '200'){
                if (data.result) {
                    $scope.interfaceCodeBranchList = data.result;
                    callback && callback();
                }
            }
        }}).error(function (data) {
        })
    };
    // 获取构建类型列表
    $scope.buildTypeList = [];
    $scope.getBuildTypeList = function () {
        if ($scope.buildTypeList.length === 0) {
            $http({
                'method': 'GET',
                'url': interface_url + '/gdc/build/type/?format=json',
                'params': {
                    'type_hood': 'tmc'
                }, // bug116==0411==zxh==新建job时，构建类型的选项要过滤
                'headers': {
                    'Authorization': 'Token ' + localStorage.getItem('auth_token')
                }
            }).success(function (data) {
                if(data.code === 403 || data.code === '403'){
                    $rootScope.showLogin();
                }else {
                if (data.code === 200 || data.code === '200'){
                    if (data.result) {
                        $scope.buildTypeList = data.result;
                    }
                }
            }}).error(function (data) {
            });
        }
    };
    $scope.getBuildTypeList();
    $scope.originParamsList = [];
    $scope.selectedBuildType = {};
    $scope.selectedBuildType = function (m) {
        $scope.multiParams = [];
        if (!$scope.params.build_type)return;
        $scope.paramsArr = $scope.transToArrayOnly($scope.params.build_type.format_param);
        $scope.multiParams.push($scope.paramsArr);
        $scope.originParamsList = $scope.transToArrayOnly($scope.params.build_type.format_param);
        // 选择构建类型后获取数据仓库及分支的state状态，判断是否显示，写死（0331），等后台返回之后再改
        // 根据返回的数据动态判断是否显示 -- lk   bug号-MAG-8==bug94==zxh
        $scope.params.send_mail_state = $scope.params.build_type.send_mail_uuid_status;
        $scope.params.source_state = $scope.params.build_type.source_status;
        $scope.params.deploy_state = $scope.params.build_type.deploy_status;
        $scope.params.interface_state = $scope.params.build_type.interface_status;
        // 接口任务添加多个入参       guo
        $scope.addParamsFun = function (){
            var beforeParama = $scope.transToArrayOnly(m.format_param);
            $scope.multiParams.push( beforeParama );
        };
        $scope.reduceParamsFun = function () {
            if($scope.multiParams.length > 1) {
                $scope.multiParams.pop();
            }
        };
    };


    $scope.selectMail = function(){
        /*console.log($scope.params.send_mail.uuid)
         console.log($scope.paramsArr);*/
        //0414==zxh==bug146==任务--接口任务和部署任务，部分入参传入修改
        for (var i = 0; i < $scope.multiParams.length; i++) {
            for (var j = 0; j < $scope.multiParams[i].length; j++) {
                if ($scope.multiParams[i][j].key === 'send_mail_uuid') {
                    $scope.multiParams[i][j].value = $scope.params.send_mail.uuid;
                }
            }
        }
    };
    // 通过构建类型获取构建步骤0323
    $scope.stepList = [];
    $scope.searchResultFlag = false;
    $scope.getStepListMethod = function (callback) {
        $http({
            'method': 'GET',
            'url': interface_url + '/gdc/jobs/',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if (data.code === 200 || data.code === '200'){
                $scope.searchResult = $scope.stepList = data.result;
                if ($scope.stepList) {
                    if ($scope.stepList.length!==0){
                        $scope.searchResultFlag = true;
                    }
                }
                callback && callback();
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            // console.info('获取列表失败')
        })
    };
    $scope.getStepListMethod();
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
            if ($scope.stepList[i].name.indexOf($scope.searchWord) > -1) {
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
                $rootScope.showToast("已添加")
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
    };

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
            build_type:'',
            send_mail_uuid:'',
            system_info: '',
            jenkins: '',
            source_warehouse: '',
            source_branch: '',
            source_warehouse_subdirectory: '',
            deploy_warehouse: '',
            deploy_branch: '',
            deploy_warehouse_subdirectory: '',
            interface_warehouse: '',
            interface_branch: '',
            interface_warehouse_subdirectory: '',
            poll_scm: '',
            gitLab_hook_branch_name: '',
            job_step:'',
            is_active: false,
            gdc_job: ''
        };
        // params
        $scope.multiParams = [[{
            key: '',
            value: '',
            isDisabled: true,
            is_select: false
        }]];
    };
    // [plus 增加输入框] ==bug10==0411==zxh==新建job，入参添加不应添加至最后，哪条入参添加应添加至该入参后
    $scope.plus = function (currenArr, index) {
        currenArr.splice([index+1], 0, {
            key: '',
            value: '',
            isDisabled: true,
            is_select: false
        });

    };
    // 点击减号框，删除本输入框
    $scope.minus = function (currenArr, index) {
        var myKey =  currenArr.slice(index)[0].key;
        var displayFlag = true;
        for (var i = 0; i < $scope.originParamsList.length; i++) {
            if ($scope.originParamsList[i].key === myKey) {
                displayFlag = false;
                break;
            }
        }
        if (displayFlag){
            if (currenArr.length > 1) {
                currenArr.splice(index, 1);
            }
        } else {
            $rootScope.showToast('原始参数，不能删除');
        }
    };

    // 转换为键值对;
    $scope.transKeyValue = function (arr) {
        if (!arr)return;
        var res = {};  //0311==没有值的时候传空字符串==zxh
        for (var i = 0; i < arr.length; i++) {
            // console.log(arr);
            if (arr[i].is_select){
                if (arr[i].key===''){
                    res = '';
                } else {
                    res[arr[i].key] =  '${' + arr[i].value + '}$';
                }
            } else {
                if (arr[i].key===''){
                    res = '';
                } else {
                    res[arr[i].key] =  arr[i].value ;
                }
            }
            //res[arr[i].key] = '${' + arr[i].value + '}$';
        }
        if (res === ''){
            return res;
        } else {
            return JSON.stringify(res);
        }
    };
    // 将字符串json  转换为数组 用来 ng-repeat
    /* $scope.transToArray = function (str) {
     var obj = JSON.parse(str);
     var resArr = [];
     var Flag = true;
     console.log(222222);
     console.log($scope.originParamsList);
     for (var i in obj) {
     console.log(obj[i]);
     for (var j = 0; j < $scope.originParamsList.length; j++) {
     if ($scope.originParamsList[j].key == obj[i]) {
     Flag = false;
     break;
     }
     }
     console.log(Flag);
     if (Flag) {
     resArr.push({key: i, value: obj[i]});
     } else {
     resArr.push({key: i, value: obj[i], isDisabled: false});
     }
     }
     return resArr;
     };*/
    // 0413==zxh==bug103新建job，选择构建类型，自动带出构建类型中设置的入参，构建类型中的value在入参中应该是提醒字段，而非真实的value值。
    $scope.transToArrayOnly = function (str) {
        if ($scope.dialog.status === 'create'){
            if (str){
                var obj = JSON.parse(str);
                var resArr = [];
                for (var i in obj) {
                    resArr.push({key: i, value: '', valueHide:obj[i]});
                }
                //$scope.originParamsList = resArr;
                return resArr;
            } else {
                var resArr = [];
                resArr.push({key: '', value: '', valueHide: '', isDisabled: true});
                //$scope.originParamsList = resArr;
                return resArr;
            }
        } else {
            if (str){
                var obj = JSON.parse(str);
                var resArr = [];
                for (var i in obj) {
                    resArr.push({key: i, value: obj[i], valueHide:''});
                }
                //$scope.originParamsList = resArr;
                return resArr;
            } else {
                var resArr = [];
                resArr.push({key: '', value: '', valueHide: '', isDisabled: true});
                //$scope.originParamsList = resArr;
                return resArr;
            }
        }

    };
    // 打开新增页面，初始化参数，配置dialog的内容
    $scope.openJobInterface = function () {
        $scope.initParam();
        $scope.selectSearchResult = [];
        $scope.dialog = {
            header: '新增Job',
            input_isClick: false,
            add: true,
            status: 'create'
        };
    };
    $scope.jobInterfaceList = [];
    // 获取Job列表接口
    $scope.getJobInterfaceList = function () {
        $scope.pageNum=1;
        $scope.forInitPage = true;
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/jobs/',
            'params': {
                'is_active': 'all',
                'page': 1
            },
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (resp) {
            if(resp.code === 403 || resp.code === '403'){
                    $rootScope.showLogin();
                }else {
            if (resp.code === 200 || resp.code === '200'){
                if (resp.result) {
                    $scope.jobInterfaceList = resp.result;
                    $scope.initPageCompomentFun(resp.allPage,".forInit .tcdPageCode");
                }
            }else {
                $rootScope.showToast(resp.message);
            }
        }}).error(function (resp) {
            $rootScope.showToast('获取Job列表失败');
        });
    };
    // 调用job接口
    $scope.getJobInterfaceList();
    // 分页开始
    //点击分页执行的函数
    $scope.changePageFun = function (pageNumber) {
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/jobs/',
            'params': {
                'product_id': $scope.product_id?$scope.product_id:'',
                'system_id': $scope.system_id?$scope.system_id:'',
                'env_id': $scope.env_id?$scope.env_id:'',
                'page': pageNumber,
                'is_active': 'all'
            },
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (resp) {
            if (resp.code === 200 || resp.code === '200'){
                $scope.jobInterfaceList = resp.result;
            }else {
                $rootScope.showToast(resp.message);
            }
        }).error(function (resp) {
            console.info('执行结果列表方法-分页error');
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
    $scope.addJobInterfaceConfirm = function () {
        // 把输入的key value数组转换为object
        var ArrForParam = [];
        for (var i = 0; i < $scope.multiParams.length; i++) {
            var now = $scope.transKeyValue($scope.multiParams[i]);
            ArrForParam.push( JSON.parse(now) );
        }
        var params = {
            name: $scope.params.name,
            job_name: $scope.params.job_name,
            build_type:$scope.params.build_type.uuid,
            send_mail_uuid:$scope.params.send_mail?$scope.params.send_mail.uuid:'',
            system_info: $scope.params.system_info.id,
            jenkins: $scope.params.jenkins.uuid,
            source_warehouse: $scope.params.source_warehouse.uuid,
            source_branch: $scope.params.source_branch.uuid,
            source_warehouse_subdirectory: $scope.params.source_warehouse_subdirectory,
            deploy_warehouse: $scope.params.deploy_warehouse.uuid,
            deploy_branch: $scope.params.deploy_branch.uuid,
            deploy_warehouse_subdirectory: $scope.params.deploy_warehouse_subdirectory,
            interface_warehouse: $scope.params.interface_warehouse.uuid,
            interface_branch: $scope.params.interface_branch.uuid,
            interface_warehouse_subdirectory: $scope.params.interface_warehouse_subdirectory,
            // job_step:$scope.organizeCorr_data(),
            poll_scm: $scope.params.poll_scm,
            gitLab_hook_branch_name: $scope.params.gitLab_hook_branch_name,
            params: JSON.stringify(ArrForParam),
            is_active: $scope.params.is_active,
            gdc_job: $scope.organizeCorr_data()?JSON.stringify($scope.organizeCorr_data().match(/([\da-zA-Z\-])+/g)):'[]'
        };
        $http({
            'method': 'POST',
            'url': interface_url + '/interface/jobs/',
            'data': params,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                    $rootScope.showLogin();
                }else {
            if (data.code === 201 || data.code === '201'){
                $rootScope.showToast('添加Job成功');
                $('#myModal').modal('hide');
                $scope.getJobInterfaceList();
            } else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast(data);
            // $('#myModal').modal('hide');
        })
    };
    // 转换为键值对;
    $scope.transKeyValue = function (arr) {
        if (!arr)return;
        var res = {};  //0311==没有值的时候传空字符串==zxh
        for (var i = 0; i < arr.length; i++) {
            // console.log(arr);
            if (arr[i].is_select){
                if (arr[i].key===''){
                    res = '';
                } else {
                    res[arr[i].key] =  '${' + arr[i].value + '}$';
                }
            } else {
                if (arr[i].key===''){
                    res = '';
                } else {
                    res[arr[i].key] =  arr[i].value ;
                }
            }
            //res[arr[i].key] = '${' + arr[i].value + '}$';
        }
        if (res === ''){
            return res;
        } else {
            return JSON.stringify(res);
        }
    };

    /**
     * 查看Job
     * @param  {[string]} itemId [查看某条代码分支的id]
     * @return {[type]}        [description]
     */
        // 某条详情对应的默认值
    $scope.seeJobInterfaceVal = {};
    $scope.seeJobInterface = function (itemId) {
        $scope.initParam();
        $scope.dialog = {
            header: '查看',
            input_isClick: true,
            detail: true,
            status: 'see'
        };
        $scope.seeJobInterfaceId = itemId;
        $scope.getJobInterfaceDetail('seeJobInterfaceVal', itemId, function (){
            $scope.allParamsArr = JSON.parse($scope.seeJobInterfaceVal.params);
            $scope.getAllParams();              //这里是为查看写的
        });
    };
    //把返回的对象转化为数组   guo4.20
    $scope.getAllParams = function () {
        $scope.multiParams = [];
        for(var i = 0; i < $scope.allParamsArr.length; i++) {
            var obj = $scope.allParamsArr[i];
            var singleParam = [];
            for (var j in obj) {
                singleParam.push({key: j, value: obj[j]});
            }
            $scope.multiParams.push(singleParam);
        };
    };

    // 查看某条详情的方法
    $scope.getJobInterfaceDetail = function (obj, itemId, callback) {
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/jobs/' + itemId + '/',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                    $rootScope.showLogin();
                }else {
            $scope[obj] = data.result;
            $scope.params = data.result;       //这里是一个被查看和修改共用的方法
            // $scope.allParamsArr = JSON.parse($scope.params.params);
            // $scope.getAllParams();
            /*$scope.params.send_mail_state = $scope.params.build_type.send_mail_uuid_status;
             $scope.params.source_state = $scope.params.build_type.source_status;
             $scope.params.deploy_state = $scope.params.build_type.deploy_status;
             $scope.params.interface_state = $scope.params.build_type.interface_status;*/
            if($scope.params.send_mail_state){
                $scope.params.send_mail_state = true;
            }
            if($scope.params.source_branch){
                $scope.params.source_state = true;
            }
            if($scope.params.deploy_branch){
                $scope.params.deploy_state = true;
            }
            if($scope.params.interface_branch){
                $scope.params.interface_state = true;
            }
            callback && callback(data);
            if ($scope.dialog.status === 'see' || $scope.dialog.status === 'modify') {
                // 渲染部署系统
                for (var i = 0; i < $scope.deploySystemList.length; i++) {
                    if ($scope.deploySystemList[i].description === data.result.system_info) {
                        $scope.params.system_info = $scope.deploySystemList[i];
                        break;
                    }
                }
                // 渲染jenkins
                for (var i = 0; i < $scope.jenkinsList.length; i++) {
                    if ($scope.jenkinsList[i].name === data.result.jenkins) {
                        $scope.params.jenkins = $scope.jenkinsList[i];
                        break;
                    }
                }
                // 源码渲染源码仓库
                //console.log($scope.dataStorageList);
                for (var i = 0; i < $scope.dataStorageList.length; i++) {
                    if ($scope.dataStorageList[i].uuid === data.result.source_warehouse) {
                        $scope.params.source_warehouse = $scope.dataStorageList[i];
                        break;
                    }
                }
                // 获取y源代码分支列表
                $scope.sourceCodeBranchList = [];
                $scope.sourceBranch = data.result.source_branch;
                $scope.getSourceCodeBranchList = function (warehouseid, callback) {
                    $http({
                        'method': 'GET',
                        'url': interface_url + '/gdc/branch/?warehouse=' + warehouseid,
                        'headers': {
                            'Authorization': 'Token ' + localStorage.getItem('auth_token')
                        }
                    }).success(function (data) {
                        if(data.code === 403 || data.code === '403'){
                            $rootScope.showLogin();
                        }else {
                        if (data.code === 200 || data.code === '200'){
                            if (data.result) {
                                $scope.sourceCodeBranchList = data.result;
                                callback && callback();
                                // 源码渲染源码分支
                                if ($scope.sourceCodeBranchList) {
                                    for (var i = 0; i < $scope.sourceCodeBranchList.length; i++) {
                                        if ($scope.sourceCodeBranchList[i].uuid === $scope.sourceBranch) {
                                            $scope.params.source_branch = $scope.sourceCodeBranchList[i];
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }}).error(function (data) {
                    })
                };
                if(data.result.source_warehouse){
                    //console.log(data.result.source_warehouse.uuid)
                    $scope.getSourceCodeBranchList(data.result.source_warehouse.uuid);
                }

                // 源码部署仓库
                for (var i = 0; i < $scope.dataStorageList.length; i++) {
                    if ($scope.dataStorageList[i].uuid === data.result.deploy_warehouse) {
                        $scope.params.deploy_warehouse = $scope.dataStorageList[i];
                        break;
                    }
                }
                // 获取部署代码分支列表
                $scope.deployCodeBranchList = [];
                $scope.deployBranch = data.result.deploy_branch;
                $scope.getDeployCodeBranchList = function (warehouseid, callback) {
                    $http({
                        'method': 'GET',
                        'url': interface_url + '/gdc/branch/?warehouse=' + warehouseid,
                        'headers': {
                            'Authorization': 'Token ' + localStorage.getItem('auth_token')
                        }
                    }).success(function (data) {
                        if(data.code === 403 || data.code === '403'){
                            $rootScope.showLogin();
                        }else {
                        if (data.code === 200 || data.code === '200'){
                            if (data.result) {
                                $scope.deployCodeBranchList = data.result;
                                callback && callback();
                                // 源码部署分支
                                for (var i = 0; i < $scope.deployCodeBranchList.length; i++) {
                                    if ($scope.deployCodeBranchList[i].uuid === $scope.deployBranch) {
                                        $scope.params.deploy_branch = $scope.deployCodeBranchList[i];
                                        break;
                                    }
                                }
                            }
                        }
                    }}).error(function (data) {
                    })
                };
                if(data.result.deploy_warehouse){
                    $scope.getDeployCodeBranchList(data.result.deploy_warehouse.uuid);
                }

                // 源码接口仓库
                for (var i = 0; i < $scope.dataStorageList.length; i++) {
                    if ($scope.dataStorageList[i].uuid === data.result.interface_warehouse) {
                        $scope.params.interface_warehouse = $scope.dataStorageList[i];
                        break;
                    }
                }
                // 获取接口代码分支列表
                $scope.interfaceCodeBranchList = [];
                $scope.interfaceBranch = data.result.interface_branch;
                $scope.getInterCodeBranchList = function (warehouseid, callback) {
                    $http({
                        'method': 'GET',
                        'url': interface_url + '/gdc/branch/?warehouse=' + warehouseid,
                        'headers': {
                            'Authorization': 'Token ' + localStorage.getItem('auth_token')
                        }
                    }).success(function (data) {
                        if(data.code === 403 || data.code === '403'){
                            $rootScope.showLogin();
                        }else {
                        if (data.code === 200 || data.code === '200'){
                            if (data.result) {
                                $scope.interfaceCodeBranchList = data.result;
                                callback && callback();
                                // 源码接口分支
                                for (var i = 0; i < $scope.interfaceCodeBranchList.length; i++) {
                                    if ($scope.interfaceCodeBranchList[i].uuid === $scope.interfaceBranch) {
                                        $scope.params.interface_branch = $scope.interfaceCodeBranchList[i];
                                        break;
                                    }
                                }
                            }
                        }
                    }}).error(function (data) {
                    })
                };
                if(data.result.interface_warehouse){
                    $scope.getInterCodeBranchList(data.result.interface_warehouse.uuid);
                }

                // 渲染构建类型
                for (var i = 0; i < $scope.buildTypeList.length; i++) {
                    if ($scope.buildTypeList[i].uuid === data.result.build_type) {
                        $scope.params.build_type = $scope.buildTypeList[i];
                        break;
                    }
                }
                // 渲染邮件组
                for (var i = 0; i < $scope.sendMailList.length; i++) {
                    if ($scope.sendMailList[i].uuid === data.result.send_mail) {
                        $scope.params.send_mail = $scope.sendMailList[i];
                        break;
                    }
                }
                $scope.originParamsList=[];
                if ($scope.params.build_type){
                    $scope.originParamsList = $scope.transToArrayOnly($scope.params.build_type.format_param);
                    $scope.params.send_mail_state = $scope.params.build_type.send_mail_uuid_status;
                }
                // 0414====zxh==渲染邮箱组==bug146
                $scope.getSendMailList();
                $scope.findMailList=[];
                if ($scope.params.params){
                    $scope.currentparams = JSON.parse($scope.params.params);
                    $scope.findMailList = $scope.transToArrayOnly(JSON.stringify($scope.currentparams[0]));
                    for (var i = 0; i < $scope.findMailList.length; i++) {
                        if ($scope.findMailList[i].key === 'send_mail_uuid') {
                            var uuid = $scope.findMailList[i].value;
                            if($scope.findMailList[i].value){
                                for (var j = 0; j < $scope.sendMailList.length; j++) {
                                    if ($scope.sendMailList[j].uuid === uuid) {
                                        $scope.params.send_mail = $scope.sendMailList[j];
                                        break;
                                    }
                                }
                            }
                            break;
                        }
                    }
                }
                //前置接口渲染出来guo0726
                $scope.temJobSteps = data.result.gdc_job;
                $scope.selectSearchResult = [];
                $scope.getStepListMethod(function () {
                    $scope.originParamsList = $scope.transToArrayOnly($scope.params.build_type.format_param);
                    if (!data.result.gdc_job)return;
                    // 保存之前选择的接口
                    var blankArr = [];
                    // 将返回的data.corr_case 从字符串转为数组
                    var tempArr = $scope.temJobSteps.match(/([\da-zA-Z\-])+/g);
                    // 循环获取对应的接口，然后保存在blankArr
                    if (tempArr) {
                        for (var j = 0; j < tempArr.length; j++) {
                            if ($scope.stepList) {
                                for (var i = 0; i < $scope.stepList.length; i++) {
                                    if ($scope.stepList[i].uuid === tempArr[j]) {
                                        blankArr.push($scope.stepList[i]);
                                    }
                                }
                            }
                        }
                    }
                    $scope.selectSearchResult = blankArr;
                });
            }
        }}).error(function (data) {
            $rootScope.showToast('查看Job失败');
        })
    };

    // 要修改的id
    $scope.editJobInterfaceId = '';
    /**
     * [editCase 修改情况下]
     * @param  {[string]} itemId [修改代码分支的id
     * @return {[type]}        [description]
     */
    $scope.editJobInterface = function (itemId) {
        $scope.dialog = {
            header: '修改',
            input_isClick: false,
            add:true,
            edit:true,
            status: 'modify'
        };
        $scope.editJobInterfaceId = itemId;
        $scope.multiParams = [];
        $scope.getJobInterfaceDetail('seeJobInterfaceVal', itemId, function (){
            $scope.paramsArr = JSON.parse($scope.seeJobInterfaceVal.params);
            $scope.allParamsArr = $scope.paramsArr;     //这里是点击修改时用的
            $scope.getAllParams();
            // 修改接口任务添加多个入参       guo
            $scope.addParamsFun = function (){
                var beforeParama = $scope.multiParams[0].concat();
                for (var i = 0; i < beforeParama.length; i++) {
                    beforeParama[i] = JSON.parse(JSON.stringify(beforeParama[i]));
                };
                $scope.multiParams.push( beforeParama );
            };
            $scope.reduceParamsFun = function () {
                if($scope.multiParams.length > 1) {
                    $scope.multiParams.pop();
                }
            };
        });
    };
    // 确认修改Job
    $scope.editJobInterfaceConfirm = function () {
        // 把输入的key value数组转换为object
        var ArrForParam = [];
        for (var i = 0; i < $scope.multiParams.length; i++) {
            var now = $scope.transKeyValue($scope.multiParams[i]);
            ArrForParam.push( JSON.parse(now) );
        }
        var params = {
            name: $scope.params.name,
            job_name: $scope.params.job_name,
            build_type:$scope.params.build_type?$scope.params.build_type.uuid:'',
            send_mail_uuid:$scope.params.send_mail?$scope.params.send_mail.uuid:'',
            system_info: $scope.params.system_info?$scope.params.system_info.id:'',
            jenkins: $scope.params.jenkins?$scope.params.jenkins.uuid:'',
            source_warehouse: $scope.params.source_warehouse?$scope.params.source_warehouse.uuid:'',
            source_branch: $scope.params.source_branch?$scope.params.source_branch.uuid:'',
            source_warehouse_subdirectory: $scope.params.source_warehouse_subdirectory,
            deploy_warehouse: $scope.params.deploy_warehouse? $scope.params.deploy_warehouse.uuid:'',
            deploy_branch: $scope.params.deploy_branch?$scope.params.deploy_branch.uuid:'',
            deploy_warehouse_subdirectory: $scope.params.deploy_warehouse_subdirectory,
            interface_warehouse: $scope.params.interface_warehouse?$scope.params.interface_warehouse.uuid:'',
            interface_branch: $scope.params.interface_branch?$scope.params.interface_branch.uuid:'',
            interface_warehouse_subdirectory: $scope.params.interface_warehouse_subdirectory,
            // job_step: $scope.organizeCorr_data(),
            poll_scm: $scope.params.poll_scm,
            gitLab_hook_branch_name: $scope.params.gitLab_hook_branch_name,
            params: JSON.stringify(ArrForParam),
            is_active: $scope.params.is_active,
            gdc_job: $scope.organizeCorr_data()?JSON.stringify($scope.organizeCorr_data().match(/([\da-zA-Z\-])+/g)):'[]'
        };
        $http({
            'method': 'POST',
            'url': interface_url + '/interface/jobs/' + $scope.editJobInterfaceId +'/',
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
                $rootScope.showToast('修改Job成功');
                // 初始化页面调用代码分支列表
                $scope.getJobInterfaceList();
                $("#myModal").modal('hide');
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast(data);
        })
    };
    // 删除某条Job
    $scope.delJobInterfaceId = '';
    // 获取某条要删除job的id
    $scope.delJobInterface = function (itemId, index) {
        $scope.delJobInterfaceId = itemId;
        $scope.delIndex = index;
        $scope.dialog = {
            header: '删除',
            status: 'del'
        };
    };
    // 确认删除job
    $scope.delJobInterfaceConfirm = function () {
        $http({
            'method': 'DELETE',
            'url': interface_url + '/interface/jobs/' + $scope.delJobInterfaceId + '/',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $("#DisableModel").modal('hide');
                $rootScope.showLogin();
                }else {
            if (data.code === 204 || data.code === '204'){
                $rootScope.showToast('删除job成功');
                $scope.getJobInterfaceList();
                $("#DisableModel").modal('hide');
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('删除job失败');
        })
    };

    // 禁用某条代码分支
    $scope.disableJobInterfaceId = '';
    $scope.disableJobInterface = function (itemId, index) {
        $scope.disableJobInterface = itemId;
        $scope.disableIndex = index;
        $scope.dialog = {
            header: '禁用',
            status: 'disable'
        };
    };
    // 确认禁用某条job
    $scope.disableJobInterfaceConfirm = function () {
        $http({
            'method': 'POST',
            'url': interface_url + '/interface/jobs/' + $scope.disableJobInterface + '/',
            'data': {
                'is_active': false
            },
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $("#DisableModel").modal('hide');
                $rootScope.showLogin();
                }else {
            if (data.code === 202 || data.code === '202'){
                $rootScope.showToast('禁用job成功');
                $scope.jobInterfaceList[$scope.disableIndex].is_active = false;
                $("#DisableModel").modal('hide');
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('禁用job失败');
        });
    };
}
/**
 * Pass all functions into module
 */
angular
    .module('inspinia')
    .controller('backUseCase_JobInterface', backUseCase_JobInterface); // 任务==接口任务
