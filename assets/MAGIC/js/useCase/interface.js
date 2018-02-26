/**
 * Created by Administrator on 2017/4/26.
 */
/**
 * 用例管理----->接口
 * @param {any} $scope
 * @param {any} $rootScope
 * @param {any} $http
 * @param interface_url
 */
function useCase($scope, $rootScope, $http, interface_url) {
    /**
     * 重置基本参数
     * @param {any} obj [需要放入到该对象里面]
     * @param {any} arr [分别要重置的值]
     * @returns
     */
        // 数据类型
    $scope.dateType = [{type: 'form'}, {type: 'file'}, {type: 'data'}];
    // 请求类型
    $scope.reqType = [{type: 'get'}, {type: 'post'}, {type: 'put'}, {type: 'delete'}, {type: 'patch'}];
    // 请求用例模块列表
    $scope.caseModelList = [];
    // 选择的数据类型
    $scope.selectedDataType = {};
    // 选择的请求类型
    $scope.selectedReqType = {};
    // 所有的系统列表
    $scope.systemList = [];
    // 选择的产品
    $scope.selectedProduct = {};
    // 选择的系统
    $scope.selectedSystem = {};
    // 选择的用例模型
    $scope.selectedCaseModel = {};
    // dialog配置
    $scope.dialog = {
        header: '',
        input_isClick: false,
        status: ''
    };
    // 初始化参数，清空新增完保存的数据
    $scope.initParam = function () {
        $scope.params = {
            name: '',
            description: '',
            url: '',
            data_method: {},
            data_type: {},
            service: '',
            seq: '',
            corr_data: '',
            is_active: false,
            is_init: false,
            system: '',
            model: ''
        };
    };
    // 打开新增页面，初始化参数，配置dialog的内容
    $scope.openAdd = function () {
        $scope.initParam();
        $scope.dialog = {
            header: '新增',
            input_isClick: false,
            status: 'create'
        };
    };
// 请求用例模块列表接口
    $scope.getModelList = function () {
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/casemodel/list/?format=json',
            'params': {
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
                $scope.caseModelList = data.result;
                $scope.arrCon = [1, 2, 3, 4, 5];
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('获取用例模块接口数据失败');
        });
    };
    // $scope.getModelList();
    // 获取产品==0309==zxh
    $scope.productList = [];
    $scope.getProductList = function () {
        if ($scope.productList.length === 0) {
            $http({
                'method': 'GET',
                'url': interface_url + '/interface/product/list/?format=json',
                'headers': {
                    'Authorization': 'Token ' + localStorage.getItem('auth_token')
                }
            }).success(function (data) {
                if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
                if (data.code === 200 || data.code === '200'){
                    $scope.productList = data.result;
                    $scope.queryProductList = data.result;
                }else {
                    $rootScope.showToast(data.message);
                }
            }}).error(function (data) {
                //console.info(data);
            });
        }
    };
    $scope.getProductList();
    /**
     * 获取某个产品下的系统==0309==zxh
     * @param productid
     * @param  {Function} callback [获取到用例模块后，执行的回调，一般用在查看与新盖的情况下]
     * @return {[type]}            [description]
     */
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
                if ($scope.queryFlag === 1 || $scope.queryFlag === '1'){
                    $scope.querySystemList = data.result;
                    $scope.queryCaseModelList = [];
                }
                callback && callback();
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
        })
    };
    // 先选择产品，在选择系统，根据产品选择系统
    $scope.selectedProduct = function () {
        $scope.queryFlag = '';
        if (!$scope.params.product)return;
        // 获取当前产品下的 系统
        $scope.getCaseSystem($scope.params.product.id);
    };
    $scope.queryFlag = 1;
    $scope.queryProduct = function () {
        if (!$scope.queryInterfaceParam.product)return;
        // 获取当前产品下的 系统
        $scope.queryFlag = 1;
        $scope.getCaseSystem($scope.queryInterfaceParam.product.id);
    };
    // 获取用例模块
    /**
     * 获取某个系统下的用例模块
     * @param  {[string]}   systemid [description]
     * @param  {Function} callback [获取到用例模块后，执行的回调，一般用在查看与新盖的情况下]
     * @return {[type]}            [description]
     */
    $scope.sitUrl=''; // bug131==zxh==0413==链接样式
    $scope.getCaseModel = function (systemid, callback) {
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/casemodel/list/?system_id=' + systemid,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
            if (data.code === 200 || data.code === '200'){
                if (data.result){
                    $scope.caseModelList = data.result;
                    $scope.sitUrl = data.result[0]?data.result[0].sit_url: '';
                    if ($scope.queryFlag === 1 || $scope.queryFlag === '1'){
                        $scope.queryCaseModelList = data.result;
                    }
                } else {
                    $scope.caseModelList = $scope.queryCaseModelList = [];
                }

            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
        })
    };
    // 请求接口获取某个系统下的接口，保存在 interface_system_list 中
    $scope.interface_system_list = [];
    $scope.searchResultFlag = false;
    $scope.getUseCaseList_system = function (systemid, callback) {
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/case/list/?system_id=' + systemid,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
            if (data.code === 200 || data.code === '200'){
                $scope.searchResult = $scope.interface_system_list = data.result;
                if ($scope.interface_system_list) {
                    $scope.searchResultFlag = true;
                }
                callback && callback();
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            // console.info('获取用例列表失败')
        })
    };
    // 选择某个系统 ng-change 获取该系统下的所有模型与 所有接口
    $scope.selectedSystem = function () {
        $scope.queryFlag = '';
        if (!$scope.params.system)return;
        // 当前系统 获取所有模块
        $scope.getCaseModel($scope.params.system.id);
        // 当前系统 获取所有接口
        $scope.getUseCaseList_system($scope.params.system.id);
    };
    $scope.querySystem = function () {
        if (!$scope.queryInterfaceParam.system)return;
        // 当前系统 获取所有模块
        $scope.queryFlag = 1;
        $scope.getCaseModel($scope.queryInterfaceParam.system.id);

    };
    // 获取用例列表的方法
    $scope.getUseCaseList = function () {
        $scope.pageNum=1;
        $scope.forInitPage = true;
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/case/list/?format=json',
            'params': {
                'is_active': 'all',
                'page': 1
            },
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
            if (data.code === 200 || data.code === '200'){
                $scope.useCaseList = data.result;
                $scope.initPageCompomentFun(data.allPage,".forInit .tcdPageCode");
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            //console.info('获取用例列表失败')
        })
    };
    // 初始化页面调用用例列表
    $scope.getUseCaseList();
    // 分页开始
    //点击分页执行的函数
    $scope.changePageFun = function (pageNumber) {
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/case/list/?format=json',
            'params': {
                'page': pageNumber,
                'is_active': 'all',
                'product_id': $scope.product_id?$scope.product_id:'',
                'system_id': $scope.system_id?$scope.system_id:'',
                'model': $scope.model_id?$scope.model_id:''
            },
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
            if (data.code === 200 || data.code === '200'){
                $scope.useCaseList = data.result;
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            console.info('获取列表方法-分页error');
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
    //查询用例详情==0331==zxh
    $scope.initQueryParam = function () {
        $scope.queryInterfaceParam = {
            product:'',
            system:'',
            model:''
        };
    };
    $scope.initQueryParam();
    // 点击查询
    $scope.queryCase = function () {
        $scope.pageNum=1;
        $scope.forInitPage = false;
        $scope.product_id = $scope.queryInterfaceParam.product.id;
        $scope.system_id = $scope.queryInterfaceParam.system?$scope.queryInterfaceParam.system.id:'';
        $scope.model_id = $scope.queryInterfaceParam.model?$scope.queryInterfaceParam.model.id:'';

        $http({
            'method': 'GET',
            'url': interface_url + '/interface/case/list/?format=json',
            'params': {
                'page': 1,
                'is_active': 'all',
                'product_id': $scope.product_id,
                'system_id': $scope.system_id,
                'model': $scope.model_id
            },
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
            if (data.code === 200 || data.code === '200'){
                $scope.useCaseList = data.result;
                $scope.initPageCompomentFun(data.allPage,".forSearch .tcdPageCode");
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('查询失败');
        })
    };
    /**
     * 获取所有的系统
     * @param  {Function} callback [获取到用例模块后，执行的回调，一般用在查看与新盖的情况下]
     * @return {[type]}            [description]
     */
    /*$scope.getAllSystem = function(callback){
     $http({
     'method': 'GET',
     'url': interface_url+'/interface/system/list/',
     'headers': {
     'Authorization': 'Token ' + localStorage.getItem('auth_token')
     }
     }).success(function(data) {
     $scope.systemList = data;
     callback &&callback();
     }).error(function(data) {
     console.info('获取系统列表失败');
     });
     };
     $scope.getAllSystem();*/


    // 保存搜索结果中被选择的item
    $scope.selectSearchResult = [];
    // 检索词汇
    $scope.searchWord = '';
    // 默认情况下，接口列表为隐藏
    $scope.searchResultIsShow = false;
    //  检测 searchWord，如果有变化，执行模糊搜索
    $scope.$watch('searchWord', function () {
        // console.log($scope.searchWord);
        // 检索词为空，返回； 若果加载页面，会执行一次，此时$scope.interface_system_list尚未获取到，for循环的时候会报错；
        //$scope.searchResultIsShow = true;
        // 临时保存数组
        var tempArr = [];
        for (var i = 0; i < $scope.interface_system_list.length; i++) {
            if ($scope.interface_system_list[i].description.indexOf($scope.searchWord) > -1) {
                tempArr.push($scope.interface_system_list[i]);
            }
        }
        // 更改搜索结果的数组数据，更新页面；
        $scope.searchResult = tempArr;
    });

    /**
     * 点击检索到的列表item，将该item放入   $scope.selectSearchResult
     * @return {[type]}       [description]
     * @param index
     */
    $scope.selectSearchItem = function (index) {
        for (var i = 0; i < $scope.selectSearchResult.length; i++) {
            // 如果选中之后的列表中已经有改item，不再添加，拒绝重复;
            if ($scope.selectSearchResult[i].id === $scope.searchResult[index].id) {
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
            arr.push($scope.selectSearchResult[i].id);
        }
        return '[' + arr.toString() + ']';
    };


    // 添加用例
    $scope.CaseAdd = function () {
        // console.log($scope.organizeCorr_data());
        var params = {
            name: $scope.params.name,
            description: $scope.params.description,
            product: $scope.params.product_name,
            url: $scope.params.url,
            data_method: $scope.params.data_method.type,
            data_type: $scope.params.data_type.type,
            service: $scope.params.service,
            seq: $scope.params.seq,
            corr_data: $scope.organizeCorr_data(),
            is_active: $scope.params.is_active,
            is_init: $scope.params.is_init,
            model: $scope.params.model.id,
            system: $scope.params.system.id
        };
        // console.log(params);
        $http({
            'method': 'POST',
            'url': interface_url + '/interface/case/add/',
            'data': params,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $('#myModal').modal('hide');
                $rootScope.showLogin();
            }else {
            if (data.code === 201 || data.code === '201'){
                $rootScope.showToast('添加用例成功');
                $('#myModal').modal('hide');
                $scope.getUseCaseList();
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            if(data.message){
                $rootScope.showToast(data.message);
            } else {
                $rootScope.showToast(data);
            }
        })
    };
    /**
     * 查看用例
     * @param  {[string]} itemId [查看某条用例的id]
     * @return {[type]}        [description]
     */
    $scope.seeCaseDes = function (itemId) {
        $scope.dialog = {
            header: '查看',
            input_isClick: true,
            status: 'see'
        };
        $scope.getCaseDetail(itemId);
    };

    // 查看某条用例的方法
    $scope.getCaseDetail = function (id) {
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/case/detail/' + id + '/?format=json',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (resp) {
            if(resp.code === 403 || resp.code === '403'){
                $rootScope.showLogin();
            }else {
            var data = resp.result;
            $scope.params = data;
            // 查看某个用例的情况下，将之前保存的数据渲染出来
            if ($scope.dialog.status === 'see' || $scope.dialog.status === 'modify') {
                //渲染产品 产品没有返回，不能回显==03100==zxh
                for (var i = 0; i < $scope.productList.length; i++) {
                    if ($scope.productList[i].id == data.product_id) {
                        $scope.params.product = $scope.productList[i];
                        break;
                    }
                }
                var systemId = data.system_id;
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
                            callback && callback();
                            // 渲染系统==0310==zxh==修改时不能回显
                            for (var i = 0; i < $scope.systemList.length; i++) {
                                if ($scope.systemList[i].id == systemId) {
                                    $scope.params.system = $scope.systemList[i];
                                    break;
                                }
                            }
                        }else {
                            $rootScope.showToast(data.message);
                        }
                    }}).error(function (data) {
                    })
                };
                $scope.getCaseSystem(data.product_id);
                //通过ID查询模块==0411==zxh
                var caseModelId = data.case_model_id
                $scope.getModelName = function (systemId, callback) {
                    $http({
                        'method': 'GET',
                        'url': interface_url + '/interface/casemodel/list/?system_id=' + systemId,
                        'headers': {
                            'Authorization': 'Token ' + localStorage.getItem('auth_token')
                        }
                    }).success(function (data) {
                        if(data.code === 403 || data.code === '403'){
                            $rootScope.showLogin();
                        }else {
                        if (data.code === 200 || data.code === '200'){
                            $scope.caseModelList = data.result;
                            //$scope.sitUrl = data[0].sit_url?data[0].sit_url: '';
                            //if ($scope.queryFlag === 1 || $scope.queryFlag === '1'){
                            //    $scope.queryCaseModelList = data;
                            //}
                            // 渲染出模块
                            //0413==zxh===bug140【用例管理】【接口】接口链接不回显
                            $scope.sitUrl = data.result[0].sit_url?data.result[0].sit_url: '';
                            for (var i = 0; i < $scope.caseModelList.length; i++) {
                                if ($scope.caseModelList[i].id == caseModelId) {
                                    $scope.params.model = $scope.caseModelList[i];
                                    break;
                                }
                            }
                        }else {
                            $rootScope.showToast(data.message);
                        }
                    }}).error(function (data) {
                    })
                };
                $scope.getModelName(data.system_id);

                /*$scope.getCaseModel($scope.params.system_id,function(){
                 // console.log("===========");
                 // console.log(data.case_model_id);
                 for (var i = 0; i <$scope.caseModelList.length; i++) {
                 if($scope.caseModelList[i].id == data.case_model_id){
                 $scope.params.model = $scope.caseModelList[i];
                 break;
                 }
                 }
                 })*/

                // 渲染请求类型
                for (var i = 0; i < $scope.reqType.length; i++) {
                    if ($scope.reqType[i].type == data.data_method) {
                        $scope.params.data_method = $scope.reqType[i];
                        break;
                    }
                }
                // 渲染数据类型
                for (var i = 0; i < $scope.dateType.length; i++) {
                    if ($scope.dateType[i].type == data.data_type) {
                        $scope.params.data_type = $scope.dateType[i];
                        break;
                    }
                }
                // 获取系统下的所有接口，并在获取到所有接口之后，将corrdata渲染出来
                $scope.getUseCaseList_system(data.system_id, function () {
                    //$scope.interface_system_list
                    if (!data.corr_data)return;
                    // 保存之前选择的接口
                    var blankArr = [];
                    // 将返回的data.corr_case 从字符串转为数组
                    var tempArr = data.corr_data.match(/\d+/g);
                    // 循环获取对应的接口，然后保存在blankArr
                    if (tempArr) {
                        for (var j = 0; j < tempArr.length; j++) {
                            if ($scope.interface_system_list) {
                                for (var i = 0; i < $scope.interface_system_list.length; i++) {
                                    if ($scope.interface_system_list[i].id == tempArr[j]) {
                                        blankArr.push($scope.interface_system_list[i]);
                                    }
                                }
                            }
                        }
                    }
                    $scope.selectSearchResult = blankArr;
                });
            }
        }}).error(function (data) {
            $rootScope.showToast('查看用例失败');
        });
    };

    // 要修改的id
    $scope.editCaseId = '';
    /**
     * [editCase 修改情况下]
     * @param  {[string]} itemId [修改用例接口的id
     * @return {[type]}        [description]
     */
    $scope.editCase = function (itemId) {
        $scope.dialog = {
            header: '修改',
            input_isClick: false,
            status: 'modify'
        };
        $scope.editCaseId = itemId;
        $scope.getCaseDetail(itemId);
    };
    // 确认修改
    $scope.editCaseMethod = function () {
        var params = {
            name: $scope.params.name,
            description: $scope.params.description,
            url: $scope.params.url,
            data_method: $scope.params.data_method.type,
            data_type: $scope.params.data_type.type,
            service: $scope.params.service,
            seq: $scope.params.seq,
            corr_data: $scope.organizeCorr_data(),
            is_active: $scope.params.is_active,
            is_init: $scope.params.is_init,
            model: $scope.params.model.id,
            system: $scope.params.system.id
        };
        // console.log(params);
        $http({
            'method': 'PATCH',
            'url': interface_url + '/interface/case/detail/' + $scope.editCaseId + '/update/',
            'data': params,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $('#myModal').modal('hide');
                $rootScope.showLogin();
            }else {
            if (data.code === 202 || data.code === '202'){
                $rootScope.showToast('修改用例成功');
                // 初始化页面调用用例列表
                $scope.getUseCaseList();
                $("#myModal").modal('hide');
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast(data);
        })
    };
    // 删除某条用例
    $scope.delCaseId = '';
    // 获取某条要删除用例的id
    $scope.delCase = function (itemId, index) {
        $scope.delCaseId = itemId;
        $scope.delIndex = index;
        $scope.dialog = {
            header: '删除',
            status: 'del'
        };
    };
    // 确认删除
    $scope.sureDelCase = function () {
        $http({
            'method': 'DELETE',
            'url': interface_url + '/interface/case/detail/' + $scope.delCaseId + '/del/',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $("#disableModel").modal('hide');
                $rootScope.showLogin();
            }else {
            if (data.code === 204 || data.code === '204'){
                $rootScope.showToast('删除用例成功');
                // 初始化页面调用用例列表
                $scope.getUseCaseList();
                // $scope.useCaseList.splice($scope.delIndex, 1);
                $("#DisableCase").modal('hide');
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('删除用例失败');
        })
    };

    // 禁用某条用例
    $scope.disableCaseId = '';
    $scope.DisableCase = function (itemId, index) {
        $scope.disableCaseId = itemId;
        $scope.disableIndex = index;
        $scope.dialog = {
            header: '禁用',
            status: 'disable'
        };
    };
    // 确认禁用某条用例
    $scope.disableCaseMethod = function () {
        $http({
            'method': 'PATCH',
            'url': interface_url + '/interface/case/detail/' + $scope.disableCaseId + '/update/',
            'data': {
                'is_active': false
            },
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $("#disableModel").modal('hide');
                $rootScope.showLogin();
            }else {
            if (data.code === 202 || data.code === '202'){
                $rootScope.showToast('禁用用例成功');
                $scope.useCaseList[$scope.disableIndex].is_active = false;
                $("#DisableCase").modal('hide');
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('禁用用例失败');
        });
    };
}
/**
 * Pass all functions into module
 */
angular
    .module('inspinia')
    .controller('useCase', useCase); // 后台用例管理==接口
