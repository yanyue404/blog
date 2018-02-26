/**
 * Created by Administrator on 2017/4/26.
 */
/**
 * 用例管理->用例
 * @param {any} $scope
 * @param {any} $rootScope
 * @param {any} $http
 * @param {any} interface_url
 */
function backDetail($scope, $rootScope, $http, interface_url) {
    $scope.formData = {
        dataTypeCookie: 'form-data',
        dataTypeParams: 'form-data',
        dataTypeHeaders: 'form-data',
        dataTypeBody: 'form-data',
        dataTypeExpect: 'form-data',
        dataTypeMock: 'form-data'
    };
    // 0311==zxh ==过滤显示
    $scope.levelType = function (input) {
        if (input === '1') {
            return '高级';
        }
        if (input === '2') {
            return '重要';
        }
        if (input === '3') {
            return '一般';
        }
    };
    // 0314==zxh==校验用例名称不能输入中文
    $scope.checkCase = function (val) {
        $scope.reg= /^[^\u4E00-\u9FA5]+$/;
        //return $scope.reg.test(val);
        if ($scope.reg.test(val)) {

        }else {
            $rootScope.showToast('用例名称不能输入中文');
        }
    };
    $scope.checkCaseName = function () {
        if ($scope.addDetailParam.name){
            $scope.checkCase($scope.addDetailParam.name);
        }
        if ($scope.EditDetailVal.name){
            $scope.checkCase($scope.EditDetailVal.name);
        }
    };
    // 0311==zxh==页面初始化显示详情列表
    //  详情列表
    $scope.caseinfoList = [];
    // 获取详情列表
    $scope.caseinfoListMethod = function () {
        $scope.pageNum=1;
        $scope.forInitPage = true;
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/caseinfo/list/?format=json',
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
                $scope.caseinfoList = data.result;
                $scope.initPageCompomentFun(data.allPage,".forInit .tcdPageCode");
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('获取列表失败');
        });
    };
    $scope.caseinfoListMethod(); // 渲染页面列表
    // 分页开始
    //点击分页执行的函数
    $scope.changePageFun = function (pageNumber) {
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/caseinfo/list/?format=json',
            'params': {
                'page': pageNumber,
                'is_active': 'all',
                'product_id': $scope.product_id,
                'system_id':$scope.system_id ,
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
                $scope.caseinfoList = data.result;
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

    /**
     * 新增用例0311
     */
        // 获取产品==zxh
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
            });
        }
    };
    $scope.getProductList();
    // 先选择产品，在选择系统，根据产品选择系统
    $scope.selectedProduct = function () {
        if (!$scope.addDetailParam.product && !$scope.EditDetailProduct)return;
        // 获取当前产品下的 系统
        $scope.queryFlag = '';
        if ($scope.addDetailParam.product.id) {
            $scope.getCaseSystem($scope.addDetailParam.product.id);
        }
        if ($scope.EditDetailProduct.id) {
            $scope.getCaseSystem($scope.EditDetailProduct.id);
        }
    };
    $scope.queryFlag = 1;
    $scope.queryProduct = function (callback) {
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
                callback && callback();
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
                callback && callback();
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
        })
    };
    $scope.selectedSystem = function () {
        if (!$scope.addDetailParam.system && !$scope.EditDetailSystem)return;
        // 当前系统 获取所有模块
        $scope.queryFlag = '';
        if ($scope.addDetailParam.system.id) {
            $scope.getCaseModel($scope.addDetailParam.system.id);
            // 当前系统 获取所有接口
            // $scope.getUseCaseList_system($scope.addDetailParam.system.id);
        }
        if ($scope.EditDetailSystem.id) {
            $scope.getCaseModel($scope.EditDetailSystem.id);
            // 当前系统 获取所有接口
            // $scope.getUseCaseList_system($scope.EditDetailSystem.id);
        }
    };
    $scope.querySystem = function () {
        if (!$scope.queryDetailParam.system)return;
        // 当前系统 获取所有模块
        $scope.queryFlag = 1;
        $scope.getCaseModel($scope.queryDetailParam.system.id);

    };
    // 存储模块的数据
    $scope.caseModelList = [];
    // 获取某个系统下的模块
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
                $scope.caseModelList = data.result;
                if ($scope.queryFlag === 1 || $scope.queryFlag === '1'){
                    $scope.queryCaseModelList = data.result;
                }
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
        })
    };
    $scope.selectedModel = function(){
        if (!$scope.addDetailParam.model && !$scope.EditDetailModel)return;
        // 当前系统 获取所有模块
        $scope.queryFlag = '';
        if ($scope.addDetailParam.model.id) {
            // 当前系统 获取所有接口
            $scope.getUseCaseList_system($scope.addDetailParam.model.id);
        }
        if ($scope.EditDetailModel.id) {
            // 当前系统 获取所有接口
            $scope.getUseCaseList_system($scope.EditDetailModel.id);
        }
    };
    $scope.selectedModelEdit = function(){
        if (!$scope.EditDetailModel)return;
        $scope.getUseCaseList_systemEdit($scope.EditDetailModel.id);
    };
    // 用例列表
    $scope.caseList = [];
    $scope.caseListarr = [];
    // 获取用例列表的方法
    $scope.searchResultFlag = false;
    $scope.getUseCaseList_system = function (modelid, callback) {
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/case/list/?model=' + modelid,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
            if (data.code === 200 || data.code === '200'){
                $scope.caseList = data.result;
                 //$scope.caseListarr = data.result;
                $scope.interface_system_list = data.result;
                if ($scope.interface_system_list) {
                    $scope.searchResultFlag = true;
                }
            }else {
                $rootScope.showToast(data.message);
            }
            /*$scope.caseList = $scope.interface_system_list = data;
             if ($scope.interface_system_list) {
             $scope.searchResultFlag = true;
             }*/
            //$scope.searchResult = data;
            callback && callback();
        }}).error(function (data) {
            console.info('获取用例列表失败')
        })
    };
    $scope.getUseCaseList_systemEdit = function (modelid, callback) {
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/case/list/?model=' + modelid,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
            if (data.code === 200 || data.code === '200'){
                //$scope.caseList = data.result;
                $scope.caseListarr = data.result;
                $scope.interface_system_list = data.result;
                if ($scope.interface_system_list) {
                    $scope.searchResultFlag = true;
                }
            }else {
                $rootScope.showToast(data.message);
            }
            callback && callback();
        }}).error(function (data) {
            console.info('获取用例列表失败')
        })
    };
    // 获取前置接口列表==0412==zxh==bug7用例添加前置接口不应该可选自身接口
    $scope.selectedRelateInter = function (callback) {
        if (!$scope.addDetailParam.model)return;
        if (!$scope.addDetailParam.case)return;
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/case/list/?model=' + $scope.addDetailParam.model.id,
            'params': {
                'exceptFlag': true,
                'case_id': $scope.addDetailParam.case.id
            },
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
            if (data.code === 200 || data.code === '200'){
                $scope.searchResult = data.result;
                //$scope.selectSearchResult = data.result;
                $scope.interface_system_list = data.result;
                if ($scope.interface_system_list) {
                    $scope.searchResultFlag = true;
                }
                callback && callback();
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            console.info('获取用例列表失败')
        })
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
        // 检索词为空，返回； 若果加载页面，会执行一次，此时$scope.interface_system_list尚未获取到，for循环的时候会报错；
        //$scope.searchResultIsShow = true;
        // 临时保存数组
        var tempArr = [];
        if($scope.interface_system_list){
            for (var i = 0; i < $scope.interface_system_list.length; i++) {
                if ($scope.interface_system_list[i].description.indexOf($scope.searchWord) > -1) {
                    tempArr.push($scope.interface_system_list[i]);
                }
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
    $scope.reset = function (obj, arrString, arrBoolean) {
        for (var j = 0; j < arrString.length; j++) {
            obj[arrString[j]] = '';
        }
        for (var i = 0; i < arrBoolean.length; i++) {
            obj[arrBoolean[i]] = false;
        }
        return obj;
    };

// 获取用例列表的方法
    /* $scope.getUseCaseList = function (obj) {
     $http({
     'method': 'GET',
     'url': interface_url + '/interface/case/list/?format=json',
     'headers': {
     'Authorization': 'Token ' + localStorage.getItem('auth_token')
     }
     }).success(function (data) {
     $scope[obj] = data;
     }).error(function (data) {
     console.info('获取用例列表失败')
     })
     };
     $scope.getUseCaseList('caseList');*/
    // 级别
    $scope.level = [
        {L: '高级', value: "1"},
        {L: '中级', value: '2'},
        {L: '一般', value: '3'}
    ];
    //查询用例详情==0331==zxh
    $scope.initQueryParam = function () {
        $scope.queryDetailParam = {
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
        $scope.product_id = $scope.queryDetailParam.product.id;
        $scope.system_id = $scope.queryDetailParam.system?$scope.queryDetailParam.system.id:'';
        $scope.model_id = $scope.queryDetailParam.model?$scope.queryDetailParam.model.id:'';
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/caseinfo/list/?format=json',
            'params': {
                'product_id': $scope.product_id,
                'system_id':$scope.system_id ,
                'model': $scope.model_id,
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
                $scope.caseinfoList = data.result;
                $scope.initPageCompomentFun(data.allPage,".forSearch .tcdPageCode");
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('查询失败');
        })
    };
    // 新增详情时的参数
    $scope.initAddParam = function () {
        $scope.addDetailParam = {
            product:'',
            system:'',
            model:'',
            case: '',
            name: '',
            description: '',
            seq: '',
            corr_case: '',
            is_main: false,
            is_active: false,
            level: 1,
            depend_data: "",
            is_parameterized: false,
            parameterized_data: ""
        };
        // cookies
        $scope.cookiesArr = [{
            key: '',
            value: '',
            is_select: false
        }];
        // params
        $scope.paramsArr = [{
            key: '',
            value: '',
            is_select: false
        }];
        // header
        $scope.headersArr = [{
            key: '',
            value: '',
            is_select: false
        }];
        // body
        $scope.bodyArr = [{
            key: '',
            value: '',
            is_select: false
        }];
        $scope.expectation_dataArr = [{
            key: '',
            value: '',
            is_select: false
        }];
        $scope.corr_caseArr = [{
            key: '',
            value: '',
            is_select: false
        }];
        $scope.mock_dataArr = [{
            key: '',
            value: '',
            is_select: false
        }];
        $scope.parameterized_dataArr = [{
            key: '',
            value: '',
            is_select: false
        }];
    };
    $scope.initAddParam();

    // 正向用例
    $scope.forwardIsActive = function () {
        $scope.addDetailParam.is_main = !$scope.addDetailParam.is_main;
    };
    // 是否启用
    $scope.detailIsActive = function () {
        $scope.addDetailParam.is_active = !$scope.addDetailParam.is_active;
    };
    // 是否参数化
    $scope.detailIsAarameterized = function () {
        $scope.addDetailParam.is_parameterized = !$scope.addDetailParam.is_parameterized;
    };

    // 保存增加详情 里面的各个参数的值；
    // ------
    /**
     * [plus 增加输入框]
     * @param  {[type]} name  [description]
     * @param  {[type]} index [description]
     * @return {[type]}       [description]
     */
    $scope.plus = function (name, index) {
        // console.log('plus');
        $scope[name][$scope[name].length] = {
            key: '',
            value: '',
            is_select: false
        };
    };
    // 点击减号框，删除本输入框
    /**
     * [minus description]
     * @param  {[string]} name  [params,header,body,expectation_data,corr_case,mock_data]
     * @param  {[number]} index [索引]
     * @return {[type]}       [description]
     */
    $scope.minus = function (name, index) {
        // console.log('minus');
        // console.log(index);
        if ($scope[name].length > 1) {
            $scope[name].splice(index, 1);
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
    $scope.transToArray = function (str) {
        // 由于数组解析错误，导致数据展示不出来 -- lk bug号（MAG-69）
        if (str){
            var obj = JSON.parse(str);
            var resArr = [];
            for (var i in obj) {
                resArr.push({key: i, value: obj[i]});
            }
            return resArr;
        } else {
            var resArr = [];
            resArr.push({key: '', value: ''});
            return resArr;
        }
        // console.log(str);
        // var reg = /^.+\{.+\}.+$/;
        // if (!str || !reg.test(str)) {
        //     return [{
        //         key: '',
        //         value: '',
        //         is_select: false
        //     }];
        // }
        // var obj = JSON.parse(str);
        // var resArr = []
        // for (var i in obj) {
        //     /*if (reg.test(obj[i])) {
        //      resArr.push({key: i, value: obj[i], is_select: true});
        //      } else {
        //      resArr.push({key: i, value: obj[i]});
        //      }*/
        //     resArr.push({key: i, value: obj[i]});
        // }
        //
        // return resArr;
    };
    $scope.allAssociation = [];
    // 获取关联数据
    $scope.getAllAssociation = function () {
        // 0413==bug87==zxh【用例管理】【用例】【新增用例】Params关联信息未做过滤
        if($scope.addDetailParam.system.id){
            var systemid = $scope.addDetailParam.system.id;
        }
        if($scope.EditDetailSystem.id){
            var systemid = $scope.EditDetailSystem.id;
        }
        if($scope.addDetailParam.model){
            var modelid = $scope.addDetailParam.model.id;
        }
        if($scope.EditDetailModel){
            var modelid = $scope.EditDetailModel.id;
        }
        if ($scope.allAssociation.length === 0) {
            $http({
                'method': 'GET',
                'url': interface_url + '/interface/association/list/?system_id=' + systemid,
                'headers': {
                    'Authorization': 'Token ' + localStorage.getItem('auth_token')
                }
            }).success(function (data) {
                if(data.code === 403 || data.code === '403'){
                    $rootScope.showLogin();
                }else if (data.code === 200 || data.code === '200'){
                    $scope.allAssociation = data.result;
                }else {
                    $rootScope.showToast(data.message);
                }
                /*angular.forEach($scope.allAssociation, function(name, i) {
                 $scope.allAssociation[i].name = '${' +  $scope.allAssociation[i].name + '}$'
                 });*/
                //console.info('获取服务器地址成功' + data);
            }).error(function (data) {
                console.info('获取服务器地址失败:' + data);
            });
        }
    };
    //  --------

    // 确定添加详情
    $scope.addDetail = function () {
        //console.log($scope.paramsArr);
        // console.log($scope.headersArr);
        // console.log($scope.bodyArr);
        // console.log($scope.expectation_dataArr);
        // console.log($scope.corr_caseArr);
        // console.log($scope.mock_dataArr);
        var sendData = {
            'dataTypeCookie':$scope.formData.dataTypeCookie,
            'dataTypeParams':$scope.formData.dataTypeParams,
            'dataTypeHeaders':$scope.formData.dataTypeHeaders,
            'dataTypeBody':$scope.formData.dataTypeBody,
            'dataTypeExpect':$scope.formData.dataTypeExpect,
            'dataTypeMock':$scope.formData.dataTypeMock,
            'product': $scope.addDetailParam.product.id,
            'system': $scope.addDetailParam.system.id,
            'model': $scope.addDetailParam.model.id,
            'case': $scope.addDetailParam.case.id,
            'name': $scope.addDetailParam.name,
            'description': $scope.addDetailParam.description,
            'cookies': $scope.formData.dataTypeCookie === 'raw'?$scope.cookies:$scope.transKeyValue($scope.cookiesArr),
            'params': $scope.formData.dataTypeParams === 'raw'?$scope.params:$scope.transKeyValue($scope.paramsArr),
            'headers': $scope.formData.dataTypeHeaders === 'raw'?$scope.headers:$scope.transKeyValue($scope.headersArr),
            'body': $scope.formData.dataTypeBody === 'raw'?$scope.body:$scope.transKeyValue($scope.bodyArr),
            'expectation_data': $scope.formData.dataTypeExpect === 'raw'?$scope.expect:$scope.transKeyValue($scope.expectation_dataArr),
            //'corr_case': $scope.transKeyValue($scope.corr_caseArr),
            'corr_case': $scope.organizeCorr_data(),
            'seq': $scope.addDetailParam.seq,
            'mock_data': $scope.formData.dataTypeMock === 'raw'?$scope.mock:$scope.transKeyValue($scope.mock_dataArr),
            'is_main': $scope.addDetailParam.is_main,
            'is_active': $scope.addDetailParam.is_active,
            'level': $scope.addDetailParam.level.value,
            'depend_data': $scope.addDetailParam.depend_data,
            'is_parameterized': $scope.addDetailParam.is_parameterized,
            'parameterized_data': $scope.transKeyValue($scope.parameterized_dataArr)
        };
        $http({
            'method': 'POST',
            'url': interface_url + '/interface/caseinfo/add/',
            'data': sendData,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $("#myModal").hide('hide');
                $rootScope.showLogin();
            }else {
            if (data.code === 201 || data.code === '201'){
                $rootScope.showToast('添加用例成功');
                $("#myModal").modal('hide');
                $scope.reset($scope.addDetailParam, [
                    'product', 'system', 'model', 'case', 'name', 'description', 'cookies',
                    'params', 'headers', 'body', 'expectation_data', 'corr_case', 'seq',
                    'mock_data', 'level'], ['is_main', 'is_active']); // 重置默认参数
                $scope.caseinfoListMethod(); // 渲染页面列表
                // 初始化添加数据;
                $scope.initAddParam();
            } else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast(data);
        })
    };
    // 某条详情对应的默认值
    $scope.seeDetailVal = {};
    // 查看详情 ，匹配id渲染各个数据
    $scope.seeDetailDes = function (itemId) {
        $scope.detailId = itemId;
        $scope.getDetailMethond('seeDetailVal', itemId, function () {
            //$scope.seeDetailVal.corr_case_c = $scope.transToArray($scope.seeDetailVal.corr_case);
            $scope.seeDetailVal.expectation_data_c = $scope.transToArray($scope.seeDetailVal.expectation_data);
            $scope.seeDetailVal.cookies_c = $scope.transToArray($scope.seeDetailVal.cookies);
            $scope.seeDetailVal.params_c = $scope.transToArray($scope.seeDetailVal.params);
            $scope.seeDetailVal.headers_c = $scope.transToArray($scope.seeDetailVal.headers);
            $scope.seeDetailVal.body_c = $scope.transToArray($scope.seeDetailVal.body);
            $scope.seeDetailVal.mock_data_c = $scope.transToArray($scope.seeDetailVal.mock_data);
            $scope.seeDetailVal.parameterized_data_c = $scope.transToArray($scope.seeDetailVal.parameterized_data);
        });
    };

    // 查看某条详情的方法
    $scope.getDetailMethond = function (obj, itemId, callback) {
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/caseinfo/detail/' + itemId + '/?format=json',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (resp) {
            if(resp.code === 403 || resp.code === '403'){
                $rootScope.showLogin();
            }else {
            var data = resp.result;
            if (resp.code === 200 || resp.code === '200'){
                $scope[obj] = data;
                $scope.formData.dataTypeCookie = data.dataTypeCookie;
                $scope.formData.dataTypeParams = data.dataTypeParams;
                $scope.formData.dataTypeHeaders = data.dataTypeHeaders;
                $scope.formData.dataTypeBody = data.dataTypeBody;
                $scope.formData.dataTypeExpect = data.dataTypeExpect;
                $scope.formData.dataTypeMock = data.dataTypeMock;
                $scope.cookies = data.cookies;
                $scope.params = data.params;
                $scope.headers = data.headers;
                $scope.body = data.body;
                $scope.expect = data.expectation_data;
                $scope.mock = data.mock;
                // 只执行一次就好吧  不用callback && callback(data) 这样写吧  -- lk
                callback(data);
                // console.log($scope.seeDetailVal.params_c);
                // 0327==查看用例渲染用例前置接口
                // 获取系统下的所有接口，并在获取到所有接口之后，将corrdata渲染出来
                $scope.getUseCaseList_system(data.case_model_id, function () {
                    //$scope.interface_system_list
                    if (!data.corr_case)return;
                    // 保存之前选择的接口
                    var blankArr = [];
                    // 将返回的data.corr_case 从字符串转为数组
                    var tempArr = data.corr_case.match(/\d+/g);
                    if (tempArr) {
                        for (var j = 0; j < tempArr.length; j++) {
                            for (var i = 0; i < $scope.interface_system_list.length; i++) {
                                if ($scope.interface_system_list[i].id == tempArr[j]) {
                                    blankArr.push($scope.interface_system_list[i]);
                                }
                            }
                        }
                    }
                    //console.log(blankArr)
                    $scope.selectSearchResult = blankArr;
                });
            }else {
                $rootScope.showToast(resp.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('查看用例失败');
        })
    };

    // 某条详情的id
    $scope.editdetailId = "";
    // 某条详情对应的默认值
    $scope.EditDetailVal = {};
    // 保存关联用例的值
    $scope.EditDetailProduct = {};
    $scope.EditDetailSystem = {};
    $scope.EditDetailModel = {};
    $scope.EditDetailCase = {};
    // 保存级别的值
    $scope.EditDetailLevel = {};
    /**
     * [editplus 修改情况下增加参数输入框]
     * @param  {[string]} name  [description]
     * @param  {[number]} index [description]
     * @return {[type]}       [description]
     */
    $scope.editplus = function (name, index) {
        // console.log('plus');
        $scope.EditDetailVal[name][$scope.EditDetailVal[name].length] = {
            key: '',
            value: '',
            is_select: false
        };
    };
    /**
     * [editplus 修改情况下减少参数输入框]
     * @param  {[string]} name  [description]
     * @param  {[number]} index [description]
     * @return {[type]}       [description]
     */
    $scope.editminus = function (name, index) {
        // console.log('minus');
        // console.log(index);
        if ($scope.EditDetailVal[name].length > 1) {
            $scope.EditDetailVal[name].splice(index, 1);
        }

    };
    // 修改某条详情
    $scope.editDetail = function (itemId) {
        $scope.editdetailId = itemId;
        $scope.getDetailMethond('EditDetailVal', itemId, function (data) {
            // 渲染产品
            for (var i = 0; i < $scope.productList.length; i++) {
                if (data.product_id == $scope.productList[i].id) {
                    $scope.EditDetailProduct = $scope.productList[i];
                }
            }
            // 渲染系统(通过产品查到系统)
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
                        callback ? callback(data.result) : '';
                        for (var i = 0; i < $scope.systemList.length; i++) {
                            if ($scope.systemList[i].id == systemId) {
                                $scope.EditDetailSystem = $scope.systemList[i];
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
            // 渲染渲染模块
            var modelId = data.case_model_id;
            $scope.getCaseModelName = function (systemid, callback) {
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
                        $scope.caseModelList = data.result;
                        callback ? callback(data.result) : '';
                        // 渲染模块
                        for (var i = 0; i < $scope.caseModelList.length; i++) {
                            if ($scope.caseModelList[i].id == modelId) {
                                $scope.EditDetailModel = $scope.caseModelList[i];
                                break;
                            }
                        }
                    }else {
                        $rootScope.showToast(data.message);
                    }
                }}).error(function (data) {
                })
            };
            $scope.getCaseModelName(data.system_id);
            // 渲染用例
            var caseId = data.case_id;
            $scope.caseListarr = [];
            $scope.getCase = function (modelid, callback) {
                $http({
                    'method': 'GET',
                    'url': interface_url + '/interface/case/list/?model=' + modelid,
                    'headers': {
                        'Authorization': 'Token ' + localStorage.getItem('auth_token')
                    }
                }).success(function (data) {
                    if(data.code === 403 || data.code === '403'){
                        $rootScope.showLogin();
                    }else {
                    if (data.code === 200 || data.code === '200'){
                        $scope.caseListarr = data.result;
                        // 渲染用例
                        for (var i = 0; i < $scope.caseListarr.length; i++) {
                            if ($scope.caseListarr[i].id == caseId) {
                                $scope.EditDetailCase = $scope.caseListarr[i];
                                break;
                            }
                        }
                    }else {
                        $rootScope.showToast(data.message);
                    }
                }}).error(function (data) {
                })
            };
            $scope.getCase(data.case_model_id);

            // 获取前置接口列表==0413=zxh==bug7【用例管理】【用例】修改用例时，前置接口不显示
            $scope.selectedRelateInter = function (callback) {
                if (!caseId)return;
                $http({
                    'method': 'GET',
                    'url': interface_url + '/interface/case/list/?model=' + modelId,
                    'params': {
                        'exceptFlag': true,
                        'case_id': $scope.EditDetailCase?$scope.EditDetailCase.id:caseId
                    },
                    'headers': {
                        'Authorization': 'Token ' + localStorage.getItem('auth_token')
                    }
                }).success(function (data) {
                    if(data.code === 403 || data.code === '403'){
                        $rootScope.showLogin();
                    }else {
                    if (data.code === 200 || data.code === '200'){
                        $scope.searchResult = data.result;
                        $scope.interface_system_list = data.result;
                        if ($scope.interface_system_list) {
                            $scope.searchResultFlag = true;
                        }
                        callback && callback();
                    }else {
                        $rootScope.showToast(data.message);
                    }
                }}).error(function (data) {
                    console.info('获取用例列表失败')
                })
            };
            $scope.selectedRelateInter();
            // 渲染职级
            for (var i = 0; i < $scope.level.length; i++) {
                if (data.level === $scope.level[i].value) {
                    $scope.EditDetailLevel = $scope.level[i];
                }
            }
            // 获取系统下的所有接口，并在获取到所有接口之后，将corrdata渲染出来
            $scope.getUseCaseList_system(data.case_model_id, function () {
                // for (var i = 0; i < $scope.caseList.length; i++) {
                //     if ($scope.caseList[i].id == data.case_id) {
                //         $scope.EditDetailCasecc = $scope.caseList[i];
                //         break;
                //     }
                // }
                //$scope.interface_system_list
                if (!data.corr_case)return;
                // 保存之前选择的接口
                var blankArr = [];
                // 将返回的data.corr_case 从字符串转为数组
                var tempArr = data.corr_case.match(/\d+/g);
                // 循环获取对应的接口，然后保存在blankArr
                if (tempArr) {
                    for (var j = 0; j < tempArr.length; j++) {
                        for (var i = 0; i < $scope.interface_system_list.length; i++) {
                            if ($scope.interface_system_list[i].id === tempArr[j]) {

                                blankArr.push($scope.interface_system_list[i]);
                            }
                        }
                    }
                }
                //console.log(blankArr)
                $scope.selectSearchResult = blankArr;
            });
            // 将从接口获取的输入框数据，转为可以渲染的数据
            //$scope.EditDetailVal.corr_case_c = $scope.transToArray($scope.EditDetailVal.corr_case);
            $scope.EditDetailVal.expectation_data_c = $scope.transToArray($scope.EditDetailVal.expectation_data);
            $scope.EditDetailVal.cookies_c = $scope.transToArray($scope.EditDetailVal.cookies);
            $scope.EditDetailVal.params_c = $scope.transToArray($scope.EditDetailVal.params);
            $scope.EditDetailVal.headers_c = $scope.transToArray($scope.EditDetailVal.headers);
            $scope.EditDetailVal.body_c = $scope.transToArray($scope.EditDetailVal.body);
            $scope.EditDetailVal.mock_data_c = $scope.transToArray($scope.EditDetailVal.mock_data);
            $scope.EditDetailVal.parameterized_data_c = $scope.transToArray($scope.EditDetailVal.parameterized_data);
        });
    };
    // 是否是正向用例
    $scope.EditforwardIsActive = function () {
        $scope.EditDetailVal.is_main = !$scope.EditDetailVal.is_main;
    };
    // 是否启用
    $scope.EditdetailIsActive = function () {
        $scope.EditDetailVal.is_active = !$scope.EditDetailVal.is_active;
    };
    // 是否参数化
    $scope.EditIsAarameterized = function () {
        $scope.EditDetailVal.is_parameterized = !$scope.EditDetailVal.is_parameterized;
    };
    // 确认修改
    $scope.editDetailMethod = function () {
        // console.log($scope.transKeyValue($scope.EditDetailVal.corr_case_c ));
        // console.log($scope.transKeyValue($scope.EditDetailVal.expectation_data_c));
        // console.log($scope.transKeyValue($scope.EditDetailVal.params_c ));
        // console.log($scope.transKeyValue($scope.EditDetailVal.headers_c ));
        // console.log($scope.transKeyValue($scope.EditDetailVal.body_c ));
        // console.log($scope.transKeyValue($scope.EditDetailVal.mock_data_c ));

        var params = {
            'dataTypeCookie':$scope.formData.dataTypeCookie,
            'dataTypeParams':$scope.formData.dataTypeParams,
            'dataTypeHeaders':$scope.formData.dataTypeHeaders,
            'dataTypeBody':$scope.formData.dataTypeBody,
            'dataTypeExpect':$scope.formData.dataTypeExpect,
            'dataTypeMock':$scope.formData.dataTypeMock,
            "product": $scope.EditDetailProduct?$scope.EditDetailProduct.id:"",
            "system": $scope.EditDetailSystem?$scope.EditDetailSystem.id:"",
            "model": $scope.EditDetailModel?$scope.EditDetailModel.id:"",
            "case": $scope.EditDetailCase?$scope.EditDetailCase.id:"",
            "name": $scope.EditDetailVal.name,
            "description": $scope.EditDetailVal.description,
            "cookies": $scope.formData.dataTypeCookie === 'raw'?$scope.cookies:$scope.transKeyValue($scope.EditDetailVal.cookies_c),
            "params": $scope.formData.dataTypeParams === 'raw'?$scope.params:$scope.transKeyValue($scope.EditDetailVal.params_c),
            "headers": $scope.formData.dataTypeHeaders === 'raw'?$scope.headers:$scope.transKeyValue($scope.EditDetailVal.headers_c),
            "body": $scope.formData.dataTypeBody === 'raw'?$scope.body:$scope.transKeyValue($scope.EditDetailVal.body_c),
            "expectation_data": $scope.formData.dataTypeExpect === 'raw'?$scope.expect:$scope.transKeyValue($scope.EditDetailVal.expectation_data_c),
            //"corr_case": $scope.transKeyValue($scope.EditDetailVal.corr_case_c),
            'corr_case': $scope.organizeCorr_data(),
            "mock_data": $scope.formData.dataTypeMock === 'raw'?$scope.mock:$scope.transKeyValue($scope.EditDetailVal.mock_data_c),
            'seq': $scope.EditDetailVal.seq,
            "is_main": $scope.EditDetailVal.is_main,
            "level": $scope.EditDetailLevel.value,
            "is_active": $scope.EditDetailVal.is_active,
            'depend_data': $scope.EditDetailVal.depend_data,
            'is_parameterized': $scope.EditDetailVal.is_parameterized,
            'parameterized_data': $scope.transKeyValue($scope.EditDetailVal.parameterized_data_c)
        };
        $http({
            'method': 'PATCH',
            'url': interface_url + '/interface/caseinfo/detail/' + $scope.editdetailId + '/update/',
            'data': params,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else if (data.code === 202 || data.code === '202'){
                $rootScope.showToast('修改成功');
                $("#editDetail").modal('hide');
                $scope.queryCase(); // 渲染页面列表
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            $rootScope.showToast('修改失败');
        })
    };
    //要删除的某条id
    $scope.deleteDetailId = '';
    // 删除某条详情
    /**
     * [delDetail description]
     * @param  {[type]} itemId [description]
     * @param  {[type]} index  [description]
     * @return {[type]}        [description]
     */
    $scope.delDetail = function (itemId, index) {
        $scope.deleteDetailId = itemId;
        $scope.delIndex = index;
    };
    // 确认删除
    $scope.sureDelDetail = function () {
        $http({
            'method': 'DELETE',
            'url': interface_url + '/interface/caseinfo/detail/' + $scope.deleteDetailId + '/del/',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
            if (data.code === 204 || data.code === '204'){
                $rootScope.showToast('删除成功');
                // $scope.caseinfoList.splice($scope.delIndex, 1);
                $scope.caseinfoListMethod(); // 渲染页面列表
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('删除失败');
        });
    };


    // 禁用某条详情的id
    $scope.disableDetailId = '';
    $scope.disableDetail = function (itemId, index) {
        $scope.disableDetailId = itemId;
        $scope.disableIndex = index;
    };
    // 确认禁用某条用例
    $scope.disableDetailItem = function () {
        $http({
            'method': 'PATCH',
            'url': interface_url + '/interface/caseinfo/detail/' + $scope.disableDetailId + '/update/',
            'data': {
                'is_active': false
            },
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
            if (data.code === 202 || data.code === '202'){
                $rootScope.showToast('禁用成功');
                $scope.caseinfoList[$scope.disableIndex].is_active = false;
                //$scope.caseinfoListMethod(); // 渲染页面列表
                $("#disableModel").modal('hide');
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('禁用失败');
        })
    };
}
/**
 * Pass all functions into module
 */
angular
    .module('inspinia')
    .controller('backDetail', backDetail); // 用例管理===用例
