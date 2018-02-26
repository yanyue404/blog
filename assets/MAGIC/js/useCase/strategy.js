/**
 * 用例管理->设计
 * @param {any} $scope
 * @param {any} $rootScope
 * @param {any} $http
 * @param {any} interface_url
 */
function backDesign($scope, $rootScope, $http, interface_url) {
//  策略列表
$scope.designList = [];
// 获取策略列表
$scope.getDesignList = function () {
    $scope.pageNum = 1;
    $scope.forInitPage = true;
    $http({
        'method': 'GET',
        'url': interface_url + '/interface/casesuite/list/?format=json',
        'params': {
            'is_active': 'all',
            'page': 1
        },
        'headers': {
            'Authorization': 'Token ' + localStorage.getItem('auth_token')
        }
    }).success(function (data) {
        if (data.code === 403 || data.code === '403') {
            $rootScope.showLogin();
        } else {
            if (data.code === 200 || data.code === '200') {
                $scope.designList = data.result;
                $scope.initPageCompomentFun(data.allPage, ".forInit .tcdPageCode");
            } else {
                $rootScope.showToast(data.message);
            }
        }
    }).error(function (data) {
        $rootScope.showToast('获取列表失败');
    });
};
$scope.getDesignList(); // 渲染页面列表
// 分页开始
//点击分页执行的函数
$scope.changePageFun = function (pageNumber) {
    $http({
        'method': 'GET',
        'url': interface_url + '/interface/casesuite/list/?format=json',
        'params': {
            'product_id': $scope.product_id ? $scope.product_id : '',
            'system_id': $scope.system_id ? $scope.system_id : '',
            'page': pageNumber,
            'is_active': 'all'
        },
        'headers': {
            'Authorization': 'Token ' + localStorage.getItem('auth_token')
        }
    }).success(function (data) {
        if (data.code === 403 || data.code === '403') {
            $rootScope.showLogin();
        } else {
            if (data.code === 200 || data.code === '200') {
                $scope.designList = data.result;
            } else {
                $rootScope.showToast(data.message);
            }
        }
    }).error(function (data) {
        console.info('获取列表方法-分页error');
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
//查询用例详情==0331==zxh
$scope.initQueryParam = function () {
    $scope.queryDesignParam = {
        product: '',
        system: ''
    };
};
$scope.initQueryParam();
// 点击查询
$scope.queryCase = function () {
    $scope.pageNum = 1;
    $scope.forInitPage = false;
    $scope.product_id = $scope.queryDesignParam.product ? $scope.queryDesignParam.product.uuid : '';
    $scope.system_id = $scope.queryDesignParam.system ? $scope.queryDesignParam.system.uuid : '';
    $http({
        'method': 'GET',
        'url': interface_url + '/interface/casesuite/list/?format=json',
        'params': {
            'product_id': $scope.product_id,
            'system_id': $scope.system_id,
            'page': 1,
            'is_active': 'all'
        },
        'headers': {
            'Authorization': 'Token ' + localStorage.getItem('auth_token')
        }
    }).success(function (data) {
        if (data.code === 403 || data.code === '403') {
            $rootScope.showLogin();
        } else {
            if (data.code === 200 || data.code === '200') {
                $scope.designList = data.result;
                $scope.initPageCompomentFun(data.allPage, ".forSearch .tcdPageCode");
            } else {
                $rootScope.showToast(data.message);
            }
        }
    }).error(function (data) {
        $rootScope.showToast('查询失败');
    })
};
// 弹出框状态
$scope.dialog = {
    header: '',
    product_isShow: false,
    system_isShow: false,
    env_select_isShow: false,
    input_isClick: false,
    selectAll_isShow: false,
    status: ''
};
// 添加设计
/**
 * 初始化增加设计的参数
 * @return {[type]} [description]
 */
$scope.initAddParam = function () {
    $scope.addDesign = {
        env: '',
        name: '',
        description: '',
        case_detail: '',
        is_active: false,
        product: '',
        system: ''
    };
    $scope.modelList = []; // 当前模块列表
    $scope.curModel = {}; // 当前操作模块
    $scope.curCaseList = []; // 当前接口 列表
    $scope.curCaseInfoList = []; // 当前用例列表
    $scope.curCase = {}; // 当前操作的接口
    $scope.curCaseInfo = {}; // 当前操作的用例
    $scope.modelIndex = 0; // 当前model索引
    $scope.caseIndex = 0; // 当前用例case的索引
    $scope.model_select_all = false; // 全选按钮  模型
    $scope.case_select_all = false; // 全选按钮  接口
    $scope.caseInfo_select_all = false; // 全选按钮  用例
};
// 打开新增窗口
$scope.addItem = function () {
    $scope.dialog = {
        header: '新增',
        product_isShow: true,
        system_isShow: true,
        env_select_isShow: true,
        input_isClick: false,
        selectAll_isShow: true,
        status: 'create'
    }
};
$scope.initAddParam();
// 获取产品列表 => 直接调用接口获取，储存在$scope.productList中
$scope.productList = [];
$scope.getProductList = function () {
    if ($scope.productList.length === 0){
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/product/list/?format=json',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if (data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            } else
            if (data.code === 200 || data.code === '200') {
                $scope.productList = data.result;
                $scope.queryProductList = data.result;
            } else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {});
    }
};
$scope.getProductList();
// 获取某产品下的系统列表 => 选择产品后根据产品id调用接口获取系统列表
$scope.productId = '';
$scope.systemList = [];
$scope.getSystemListMethod = function (productid, callback) {
    $http({
        'method': 'GET',
        'url': interface_url + '/interface/system/list/?product=' + productid,
        'headers': {
            'Authorization': 'Token ' + localStorage.getItem('auth_token')
        }
    }).success(function (data) {
        if (data.code === 403 || data.code === '403') {
            $rootScope.showLogin();
        } else {
            if (data.code === 200 || data.code === '200') {
                $scope.systemList = data.result;
                callback ? callback() : ''; // 如果存在回调函数，执行该函数
                if ($scope.queryFlag === 1 || $scope.queryFlag === '1') {
                    $scope.querySystemList = data.result;
                }
            } else {
                $rootScope.showToast(data.message);
            }
        }
    }).error(function (data) {
        $scope.systemListArr = data.result;
    });
};
// 获取环境列表，直接调用接口获取，储存在$scope.envList中
$scope.envList = [];
$scope.getEvnListMethod = function () { //  获取系统列表
    $http({
        'method': 'GET',
        'url': interface_url + '/interface/env/list/',
        'headers': {
            'Authorization': 'Token ' + localStorage.getItem('auth_token')
        }
    }).success(function (data) {
        if (data.code === 403 || data.code === '403') {
            $rootScope.showLogin();
        } else {
            if (data.code === 200 || data.code === '200') {
                $scope.envList = data.result;
            } else {
                $rootScope.showToast(data.message);
            }
        }
    }).error(function (data) {
        $rootScope.showToast(data.message);
    });
};
$scope.getEvnListMethod();
// 获取产品下的系统
$scope.selectProduct = function () {
    $scope.queryFlag = '';
    // 根据当前页面功能（新增／修改）取得product的uuid
    var product = $scope.dialog.status === 'create' ? $scope.addDesign.product : ($scope.dialog.status === 'modify' ? $scope.editDesign.product : '');
    //“===”严谨判断
    if (product === '' || product === null || typeof(product) === 'undefined') return;
    $scope.getSystemListMethod(product.uuid);
};
// 获取系统下的环境o
$scope.selectSystem = function () {
    // 根据当前页面功能（新增／修改）取得product的uuid
    var system = $scope.dialog.status === 'create' ? $scope.addDesign.system : ($scope.dialog.status === 'modify' ? $scope.editDesign.system : '');
    //“===”严谨判断    
    if (system === '' || system === null || typeof(system) === 'undefined') return;
    // $scope.getEvnListMethod(system.uuid);
    $scope.getModelList(system.uuid)
};
$scope.queryFlag = '';
// 策略管理页面产品select框选择后触发（非弹出框页面）
$scope.queryProduct = function () {
    if (!$scope.queryDesignParam.product) return;
    // 获取当前产品下的 系统
    $scope.queryFlag = 1;
    $scope.getSystemListMethod($scope.queryDesignParam.product.uuid);
};
// 查出所有'模块','用例','用例详情';
$scope.getModelList = function (systemid) {
    $scope.modelList = []; // 初始化
    $scope.curCaseInfoList = [];
    $scope.curCaseList = [];
    $http({
        'method': 'GET',
        'url': interface_url + '/interface/casemodel/caselist/?format=json&system=' + systemid,
        'headers': {
            'Authorization': 'Token ' + localStorage.getItem('auth_token')
        }
    }).success(function (data) {
        if (data.code === 403 || data.code === '403') {
            $rootScope.showLogin();
        } else {
            $scope.modelList = data.result;
            //$scope.curCaseList = data.interface_model;
            // 该循环给数据添加 isSelect 字段 表示是否被选中;
            // 如果是新增，所有的isSelect默认为false;
            if ($scope.dialog.status === 'create') {
                for (var i = 0; i < $scope.modelList.length; i++) {
                    $scope.modelList[i].isSelect = false;
                    if ($scope.modelList[i].interface_model) {
                        for (var j = 0; j < $scope.modelList[i].interface_model.length; j++) {
                            $scope.modelList[i].interface_model[j].isSelect = false;
                            for (var l = 0; l < $scope.modelList[i].interface_model[j].case_info_interface.length; l++) {
                                $scope.modelList[i].interface_model[j].case_info_interface[l].isSelect = false;
                            }
                        }
                    }
                }
                // 修改默认显示，默认显示第一个列表;
                //$scope.selectModel('',$scope.curModel);
            } else {
                // 如果是查看，与修改，根据返回的结果，修改isSelect;
                // 查看时使用变量seeDesignDetail，修改时使用变量editDesign
                var detail = $scope.dialog.status === 'see' ? $scope.seeDesignDetail : ($scope.dialog.status === 'modify' ? $scope.editDesign : '');
                if (detail === '') return false; // 未取到选择项的详细信息或者取出来的值未空字符串
                var selected = JSON.parse(detail.case_detail);
                var tempI = null; //  临时变量
                var tempJ = null; // 临时变量
                for (var i = 0; i < $scope.modelList.length; i++) {
                    $scope.modelList[i].isSelect = false;
                    tempI = null;
                    tempJ = null;
                    // 循环返回的case_detail
                    for (var m in selected) {
                        if (m == $scope.modelList[i].id) {
                            $scope.modelList[i].isSelect = true;
                            //  如若id匹配 保存 model索引到tempI
                            var tempI = i;
                            break;
                        }
                    }

                    for (var j = 0; j < $scope.modelList[i].interface_model.length; j++) {
                        $scope.modelList[i].interface_model[j].isSelect = false;
                        // 当循环过程中 当tempI 与i的情况下，循环下层的id
                        if (i == tempI) {
                            for (var n in selected[m]) {
                                if (n == $scope.modelList[i].interface_model[j].id) {
                                    $scope.modelList[i].interface_model[j].isSelect = true;
                                    // 如若id匹配 保存 case索引到tempI
                                    var tempJ = j;
                                    break;
                                }
                            }
                        }

                        for (var l = 0; l < $scope.modelList[i].interface_model[j].case_info_interface.length; l++) {
                            $scope.modelList[i].interface_model[j].case_info_interface[l].isSelect = false;
                            // 当case下饿case_info【l】的id 与返回的一致，改为true
                            if (j == tempJ) {
                                for (var o in selected[m][n]) {
                                    if (selected[m][n][o] == $scope.modelList[i].interface_model[j].case_info_interface[l].id) {
                                        $scope.modelList[i].interface_model[j].case_info_interface[l].isSelect = true;
                                    }
                                }
                            }
                        }
                    }
                }
                /*// 修改默认显示，以首个被选择的为选中的默认显示
                 for(var i = 0;i<$scope.modelList.length;i++){
                 if($scope.modelList[i].isSelect){
                 $scope.curModel = $scope.modelList[i]
                 $scope.curCaseList = $scope.modelList[i].interface_model;
                 // console.log(1231413)
                 if($scope.curCaseList.length>0){
                 $scope.curCaseInfoList = $scope.curCaseList[0].case_info_interface;
                 $scope.curCase = $scope.curCaseList[0];
                 }else{
                 $scope.curCaseInfoList = [];
                 }
                 break;
                 }
                 }*/
            }
            // 在默认情况下，设定第一个model为当前model
            $scope.modelIndex = 0;
            // 默认情况下，设定第一个case为当前case
            $scope.caseIndex = 0;

            if ($scope.modelList.length) {
                // 设定当前curCaseList
                $scope.curCaseList = $scope.modelList[0].interface_model;
                if ($scope.curCaseList) {
                    // 设定当前curCaseInfoList
                    $scope.curCaseInfoList = $scope.curCaseList[0].case_info_interface;
                    // 设定当前curCase
                    $scope.curCase = $scope.curCaseList[0];
                } else {
                    // 没有caseInfoList，置为空
                    $scope.curCaseInfoList = [];
                }
            }
            // 当前model为第一个model
            $scope.curModel = $scope.modelList[0];

        }
    }).error(function (data) {
        // console.log("获取id,查出所有'模块','用例','用例详情' 失败", JSON.stringify(data));
    });
};

/**
 * / 点击模型item 切换显示的 接口，用例
 * @param  {[number]} index [model的索引]
 * @return {[type]}       [description]
 */
$scope.getModelIndex = function (index) {
    $scope.modelIndex = index;
    $scope.curModel = $scope.modelList[index];
    $scope.curCaseList = $scope.modelList[index].interface_model;
    if ($scope.curCaseList) {
        $scope.curCaseInfoList = $scope.curCaseList[0].case_info_interface;
        $scope.curCase = $scope.curCaseList[0];
    } else {
        $scope.curCaseInfoList = [];
    }

};
// 点击接口显示用例
/**
 * [getCaseIndex description]
 * @param  {[number]} index [case的索引]
 * @return {[type]}       [description]
 */
$scope.getCaseIndex = function (index) {
    $scope.caseIndex = index;
    $scope.curCase = $scope.curCaseList[index];
    $scope.curCaseInfoList = $scope.curCaseList[index].case_info_interface;
};
// 点击模型复选框
/**
 * 选择model
 * @param  {[number]}  index     [模型id]
 * @param  {[json]}  obj       [选中的model的数据]
 * @param  {Boolean} isReverse [true，false，undefined]
 * true 代表是点击了下方的全选，false代表取消了下方的全选，undefined是点击model自身情况下
 * @return {[type]}            [description]
 */
$scope.selectModel = function (index, obj, isReverse) {
    if (!obj) return;
    if (isReverse === true) { // 全选中情况下
        var curValue = obj.isSelect = true;
    } else if (isReverse === false) { // 取消全选
        var curValue = obj.isSelect = false;
    } else if (isReverse === undefined) {
        var curValue = obj.isSelect = !obj.isSelect;
    }
    if (obj.interface_model) {
        for (var i = 0; i < obj.interface_model.length; i++) {
            obj.interface_model[i].isSelect = curValue;
            for (var j = 0; j < obj.interface_model[i].case_info_interface.length; j++) {
                obj.interface_model[i].case_info_interface[j].isSelect = curValue;
            }
        }
    }

};
/**
 * 选择case
 * @param  {[number]}  index     [模型id]
 * @param  {[json]}  obj       [选中的case的数据]
 * @param  {Boolean} isReverse [true，false，undefined]
 * true 代表是点击了下方的全选，false代表取消了下方的全选，undefined是点击case自身情况下
 * @return {[type]}            [description]
 */
$scope.selectCase = function (index, obj, isReverse) {
    if (isReverse === true) { // 全选中情况下
        var curValue = obj.isSelect = true;
    } else if (isReverse === false) { // 取消全选
        var curValue = obj.isSelect = false;
    } else if (isReverse === undefined) {
        var curValue = obj.isSelect = !obj.isSelect;
    }
    if (obj.case_info_interface) {
        for (var j = 0; j < obj.case_info_interface.length; j++) {
            obj.case_info_interface[j].isSelect = curValue;
        }
    }
    // 如果接口复选框有选中，遍历所有的case复选框，如果全部选中，对应模型复选框选中
    var flag = false;
    for (var i = 0; i < $scope.curModel.interface_model.length; i++) {
        if ($scope.curModel.interface_model[i].isSelect) {
            flag = true;
            break;
        }
    }
    if (flag) {
        $scope.curModel.isSelect = true;
    } else {
        $scope.curModel.isSelect = false;
    }
};
/**
 * 选择caseInfo
 * @param  {[number]}  index     [模型id]
 * @param  {[json]}  obj       [选中的caseInfo的数据]
 * @param  {Boolean} isReverse [true，false，undefined]
 * true 代表是点击了下方的全选，false代表取消了下方的全选，undefined是点击caseInfo自身情况下
 * @return {[type]}            [description]
 */
$scope.selectCaseInfo = function (index, obj, isReverse) {
    var flag1 = false;
    var flag2 = false;
    /*if (isReverse) { // 全选情况下
     obj.isSelect = true;
     } else  {
     obj.isSelect = !obj.isSelect;
     }*/
    if (isReverse === true) { // 全选中情况下
        obj.isSelect = true;
    } else if (isReverse === false) { // 取消全选
        obj.isSelect = false;
    } else if (isReverse === undefined) {
        obj.isSelect = !obj.isSelect;
    }
    // 检测是否达到全选用例的状态，如果caseInfo已经全选，当前case被选中

    for (var i = 0; i < $scope.curCaseInfoList.length; i++) {
        //console.log($scope.curCaseInfoList);
        if ($scope.curCaseInfoList[i].isSelect) { // 如果下级有一个选中，上级被选中
            flag1 = true;
            break;
        }
    }


    if (flag1) {
        $scope.curCase.isSelect = true;
    } else {
        $scope.curCase.isSelect = false;
    }

    // 检测是否达到全选case的状态，如果case已经全选，当前model被选中
    if ($scope.curCaseList) {
        for (var i = 0; i < $scope.curCaseList.length; i++) {
            if ($scope.curCaseList[i].isSelect) {
                flag2 = true;
                break;
            }
        }
    }

    if (flag2) {
        $scope.curModel.isSelect = true;
    } else {
        $scope.curModel.isSelect = false;
    }
};
//
/**
 * 点击全选按钮
 * @param  {[string]} str [表示是哪个全选按钮被选中]
 * @return {[type]}     [description]
 */
$scope.selectAll = function (str) {
    if (str === 'modal') {
        // model全选被选中
        // console.log($scope.model_select_all);
        for (var i = 0; i < $scope.modelList.length; i++) {
            // $scope.model_select_all 为false 或者true
            $scope.selectModel('', $scope.modelList[i], $scope.model_select_all);
        }
    } else if (str === 'case') {
        // case全选被选中
        if ($scope.curCaseList) {
            for (var i = 0; i < $scope.curCaseList.length; i++) {
                // $scope.model_select_all 为false 或者true
                $scope.selectCase('', $scope.curCaseList[i], $scope.case_select_all);
            }
        }
    } else if (str === 'caseinfo') {
        // caseInfo全选按钮被选中
        if ($scope.curCaseInfoList) {
            for (var i = 0; i < $scope.curCaseInfoList.length; i++) {
                // $scope.model_select_all 为false 或者true
                $scope.selectCaseInfo('', $scope.curCaseInfoList[i], $scope.caseInfo_select_all);
            }
        }
    }
};
// 整理出参数case_detail
$scope.organizeParams = function (arr) {
    if (!arr) return;
    var result = {};
    //
    /**
     * 数据最外层modelList处理
     * @param  {[Array]} arr [description]
     * @return {[json]}     [description]
     */
    // console.log(arr.length);
    var tool = function (arr) {
        if (arr) {
            for (var i = 0; i < arr.length; i++) {
                // console.log(arr[i]);
                if (arr[i].isSelect) {
                    result[arr[i].id] = tool2(arr[i].interface_model);
                }
            }
        }
        return result;
    };
    /**
     * 数据中间层 caseList处理
     * @param  {[Array]} arr [description]
     * @return {[json]}     [description]
     */
    var tool2 = function (arr) {
        var res = {};
        if (arr) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].isSelect) {
                    res[arr[i].id] = tool3(arr[i].case_info_interface);
                }
            }
        }
        return res;
    };
    /**
     * 数据内层 caseInfoList处理
     * @param  {[Array]} arr [description]
     * @return {[Array]}     [description]
     */
    var tool3 = function (arr) {
        var res = [];
        if (arr) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].isSelect) {
                    res.push(arr[i].id);
                }
            }
        }
        return res;
    };
    return tool(arr);
};
// 确定增加策略
$scope.DesignAdd = function () {
    // console.log($scope.addDesign.system)
    var params = {
        "env": $scope.addDesign.env.uuid,
        "name": $scope.addDesign.name,
        "system":$scope.addDesign.system.uuid,
        "url":$scope.addDesign.url,
        // "description": $scope.addDesign.description,
        "case_detail": JSON.stringify($scope.organizeParams($scope.modelList)),
        "case_detail_info":'',
        "is_main_tactics":$scope.addDesign.is_main_tactics,
        "is_active": $scope.addDesign.is_active
    };
    $http({
        'method': 'POST',
        'url': interface_url + '/interface/casesuite/add/',
        'data': params,
        'headers': {
            'Authorization': 'Token ' + localStorage.getItem('auth_token')
        }
    }).success(function (data) {
        if (data.code === 403 || data.code === '403') {
            $rootScope.showLogin();
            $("#myModal").modal('hide');
        } else {
            if (data.code === 201 || data.code === '201') {
                $rootScope.showToast(data.message);
                $("#myModal").modal('hide');
                $scope.getDesignList(); // 渲染页面列表
                // 初始化添加数据;
                $scope.initAddParam();
            } else {
                $rootScope.showToast(data.message);
            }
        }
    }).error(function (data) {
        $rootScope.showToast(data.message);
    })
};
// 点击用例复选框
// 添加设计结束
// 查看设计  设定dialog的选项
$scope.seeDes = function (id) {
    $scope.dialog = {
        header: '查看',
        product_isShow: false,
        system_isShow: false,
        env_select_isShow: false,
        input_isClick: true,
        selectAll_isShow: false,
        status: 'see' // 查看
    };
    $http({
        'method': 'GET',
        'url': interface_url + '/interface/casesuite/detail/' + id + '/',
        'data': {},
        'headers': {
            'Authorization': 'Token ' + localStorage.getItem('auth_token')
        }
    }).success(function (data) {
        if (data.code === 403 || data.code === '403') {
            $rootScope.showLogin();
        } else {
            if (data.code === 200 || data.code === '200') {
                $scope.seeDesignDetail = data.result;
                //bug9测试策略生成后自动创建Job，状态为创建中。便于我们维护和对方知晓状态==0412==zxh
                $scope.seeDesignDetail.status = data.result.status ? '已创建' : '等待';
                $scope.seeDesignDetail.env = data.result.envinfo;
                $scope.getModelList(data.result.system_id);
            } else {
                $rootScope.showToast(data.message);
            }
        }
    }).error(function (data) {
        $rootScope.showToast('查看详情失败');
    });
};
// 打开修改 设定dialog的选项
$scope.modify = function (id) {
    var productList = [];
    $scope.dialog = {
        header: '修改',
        product_isShow: false,
        system_isShow: false,
        env_select_isShow: false,
        input_isClick: false,
        selectAll_isShow: true,
        status: 'modify' // 修改
    };
    $http({
        'method': 'GET',
        'url': interface_url + '/interface/casesuite/detail/' + id + '/',
        'data': {},
        'headers': {
            'Authorization': 'Token ' + localStorage.getItem('auth_token')
        }
    }).success(function (data) {
        if (data.code === 403 || data.code === '403') {
            $rootScope.showLogin();
        } else {
            if (data.code === 200 || data.code === '200') {
                $scope.editDesign = data.result;
                // 将该策略对应的产品名称反显到画面
                for (var i = 0; i < $scope.productList.length; i++) {
                    if ($scope.productList[i].uuid == data.result.product_id) {
                        $scope.editDesign.product = $scope.productList[i];
                        break;
                    }
                }
                // 将该策略对应的环境反显到画面
                for (var i = 0; i < $scope.envList.length; i++) {
                    if ($scope.envList[i].uuid == data.result.env) {
                        $scope.editDesign.env = $scope.envList[i];
                        break;
                    }
                }
                // 获取系统列表并将所选策略对应到系统名称反显到画面
                $scope.getSystemListMethod($scope.editDesign.product.uuid, function () {
                  for (var i = 0; i < $scope.systemList.length; i++) {
                      if ($scope.systemList[i].uuid == data.result.system) {
                          $scope.editDesign.system = $scope.systemList[i];
                          break;
                      }
                  }
                });
                // ModelList更新
                $scope.getModelList(data.result.system_id);
            } else {
                $rootScope.showToast(data.message);
            }
        }
    }).error(function (data) {
        $rootScope.showToast('查看详情失败');
    });
    $scope.modifyId = id;
};
// 确认修改
// modifyMethod
$scope.editDesignMethod = function () {
    // console.log($scope.addDesign)
    var params = {
        // "description": $scope.addDesign.description,
        "name": $scope.editDesign.name,
        // "env_info": $scope.addDesign.envinfo_id,
        "env": $scope.editDesign.env.uuid,
        "system":$scope.editDesign.system.uuid,
        "url":$scope.editDesign.url,
        // "description": $scope.addDesign.description,
        "case_detail": JSON.stringify($scope.organizeParams($scope.modelList)),
        "case_detail_info":'',
        "is_main_tactics":$scope.editDesign.is_main_tactics,
        "is_active": $scope.editDesign.is_active
    };
    // console.log(params);
    $http({
        'method': 'PATCH',
        'url': interface_url + '/interface/casesuite/detail/' + $scope.modifyId + '/update/',
        'data': params,
        'headers': {
            'Authorization': 'Token ' + localStorage.getItem('auth_token')
        }
    }).success(function (data) {
        if (data.code === 403 || data.code === '403') {
            $rootScope.showLogin();
            $("#editDesign").modal('hide');
        } else {
            if (data.code === 202 || data.code === '202') {
                $rootScope.showToast('修改成功');
                $scope.getDesignList(); //  修改后重新渲染列表数据
                $("#editDesign").modal('hide');
            } else {
                $rootScope.showToast(data.message);
            }
        }
    }).error(function (data) {
        $rootScope.showToast('修改失败');
    })
};
/**
 * 打开禁用case
 * @param {[string]} id    [当前case的id]
 * @param {[number]} index [当前case的索引]
 */
$scope.Disable = function (id, index) {
    $scope.disableId = id;
    $scope.disableIndex = index;
};
// 确认禁用
$scope.DisableMethod = function () {
    var params = {
        is_active: false
    };
    $http({
        'method': 'PATCH',
        'url': interface_url + '/interface/casesuite/detail/' + $scope.disableId + '/update/',
        'data': params,
        'headers': {
            'Authorization': 'Token ' + localStorage.getItem('auth_token')
        }
    }).success(function (data) {
        if (data.code === 403 || data.code === '403') {
            $rootScope.showLogin();
            $("#modifyModal").modal('hide');
        } else {
            if (data.code === 202 || data.code === '202') {
                $scope.designList[$scope.disableIndex].is_active = false;
                $rootScope.showToast('禁用成功');
                $("#modifyModal").modal('hide');
            } else {
                $rootScope.showToast(data.message);
            }
        }
    }).error(function (data) {
        $rootScope.showToast('禁用失败');
    })
};
/**
 * 打开删除
 * @param  {[string]} id    [description]
 * @param  {[number]} index [description]
 * @return {[type]}       [description]
 */
$scope.del = function (id, index) {
    $scope.delId = id;
    $scope.delIndex = index;
};
/**
 * 确认删除
 * 需要被删除项的id
 * @return {[type]} [description]
 */
$scope.delMethod = function () {
    $http({
        'method': 'DELETE',
        'url': interface_url + '/interface/casesuite/detail/' + $scope.delId + '/del/',
        'headers': {
            'Authorization': 'Token ' + localStorage.getItem('auth_token')
        }
    }).success(function (data) {
        if (data.code === 403 || data.code === '403') {
            $rootScope.showLogin();
        } else {
            if (data.code === 204 || data.code === '204') {
                $rootScope.showToast('删除成功');
                $scope.getDesignList(); // 渲染页面列表
            } else {
                $rootScope.showToast(data.message);
            }
        }
    }).error(function (data) {
        $rootScope.showToast('删除失败');
    });
}
}
/**
 * Pass all functions into module
 */
angular
    .module('inspinia')
    .controller('backDesign', backDesign); // 用例管理 ---> 策略
