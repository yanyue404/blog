/**
 * Created by Administrator on 2017/9/18.
 */
/**
 * 任务管理-->任务管理
 * @param {any} $scope
 * @param {any} $rootScope
 * @param {any} $http
 */
function jobManage($scope, $rootScope, $http, interface_url) {
    // 部署类型
    $scope.deployType = [{type: 'maven-tomcat'}, {type: 'maven-java'}, {type: 'android'}, {type: 'ios'}, {type: 'h5'}];
    // 分页开始
    //点击分页执行的函数
    $scope.changePageFun = function (pageNumber) {
        $http({
            'method': 'GET',
            'url': interface_url + '/gdc/strategy/',
            'params': {
                'page': pageNumber,
                'is_active': 'all',
                'department': $scope.department_case,
                'product': $scope.product_case
            },
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            }else if (data.code === 200 || data.code === '200'){
                $scope.strategyList = data.result;
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
    $scope.unitTest = function (){
        $(".unitDetail").show();
    }
    $scope.closeDetail = function (){
        $(".unitDetail").hide();
    }
    // 1、获取策略列表
    $scope.strategyList = [];
    $scope.getStrategyList = function () {
        $scope.pageNum=1;
        $scope.forInitPage = true;
        $http({
            'method': 'GET',
            'params': {
                'is_active': 'all',
                'page': 1
            },
            'url': interface_url + '/gdc/strategy/',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            }else if (data.code === 200 || data.code === '200'){
                $scope.strategyList = data.result;
                $scope.initPageCompomentFun(data.allPage,".forInit .tcdPageCode");
                //$scope.queryStorageList = data.result;
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
        });
    };
    $scope.getStrategyList();
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
        var departmentid = $scope.querySystemParam.department.id;
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
        $scope.department_case = $scope.querySystemParam.department?$scope.querySystemParam.department.id:'';
        $scope.product_case = $scope.querySystemParam.product?$scope.querySystemParam.product.id:'';
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
        $scope.params = {
            productName: '',
            systemName: '',
            systemDes: '',
            is_active: false,
            board: '',
            sort_priority: ''
        }
    };
    // 打开新增页面，初始化参数，配置dialog的内容
    $scope.openJob = function () {
        $scope.initParam();
        $scope.params.board = $scope.boardShow[0];
        $scope.dialog = {
            header: '新增策略',
            input_isClick: false,
            add: true,
            status: 'create'
        };
        // params
        $scope.multiParams = [[{
            key: '',
            value: '',
            isDisabled: true,
            is_select: false
        }]];
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
    // 获取某个产品下的系统====zxh
    $scope.getJob = function (productid, callback) {
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/system/list/?product_id=' + productid,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else if (data.code === 200 || data.code === '200'){
                $scope.systemList = data.result;
                callback && callback();
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
        })
    };
    // 先选择产品，再根据产品选择数据仓库
    $scope.selectedProduct = function () {
        if (!$scope.params.product)return;
        //根据产品选择系统
        if ($scope.params.product) {
            $scope.getSystem($scope.params.product.id);
        }
    };
    //获取环境数据
    $scope.envlList = [];
    $scope.getEnvList = function () {
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/env/list/?format=json',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            }else if (data.code === 200 || data.code === '200'){
                $scope.envlList = data.result;
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            $scope.caseEnvlList = data;
            $rootScope.showToast('获取环境列表失败');
        });
    };
    $scope.getEnvList();
    //获取分支的接口（参考部署管理===分支管理  根据数据仓库获取分支列表）

    $scope.isIOS = false;
    $scope.marven = false;
    $scope.selectDeployType = function(){
        if($scope.params.deploy_type.type === 'ios'){
            $scope.isIOS = true;
        } else if ($scope.params.deploy_type.type=== 'maven-tomcat' || $scope.params.deploy_type.type === 'maven-java'){
            $scope.isIOS = false;
            $scope.marven = true;
        } else {
            $scope.isIOS = false;
            $scope.marven = false;
        }
    }
    $scope.originParamsList = [];
    // [plus 增加输入框]
    $scope.plus = function (current, index) {
        current.splice([index+1], 0, {
            key: '',
            value: '',
            isDisabled: true,
            is_select: false
        });
    };
    // 点击减号框，删除本输入框
    $scope.minus = function (current, index) {
        var myKey =  current.slice(index)[0].key;
        var displayFlag = true;
        for (var i = 0; i < $scope.originParamsList.length; i++) {
            if ($scope.originParamsList[i].key === myKey) {
                displayFlag = false;
                break;
            }
        }
        if (displayFlag){
            if (current.length > 1) {
                current.splice(index, 1);
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
    $scope.transToArray = function (str) {
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
    // 3、添加策略
    $scope.addJobConfirm = function () {
        if (!$scope.params.productName) {
            $rootScope.showToast('请选择产品') ;
            return;
        }
        /*if (!$scope.params.systemName) {
         $rootScope.showToast('请填写系统名称') ;
         return;
         }*/
        if (!$scope.params.systemDes) {
            $rootScope.showToast('请填写系统名称') ;
            return;
        }
        var paramsAll = {
            'product': $scope.params.productName.id,
            //'name': $scope.params.systemName,
            'description': $scope.params.systemName,
            'warehouse': $scope.params.warehouse,
            'wechatGroup': $scope.params.wechatGroup,
            'is_active': $scope.params.is_active,
            //'is_board_display': $scope.params.board.is_board_display,
            //'sort_priority': $scope.params.sort_priority
        };
        $http({
            'method': 'POST',
            'url': interface_url + '/gdc/strategy/',
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
                $scope.getStrategyList();
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            $rootScope.showToast(data.message);
        })
    };
    /**
     * 3、查看策略
     * @param  {[string]} itemId [查看的id]
     * @return {[type]}        [description]
     */
    $scope.seeJob = function (itemId) {
        $scope.dialog = {
            header: '查看',
            input_isClick: true,
            detail: true,
            status: 'see'
        };
        $scope.getStrategyDetail(itemId);
    };
    // 通过id查看策略详情的方法
    $scope.getJobDetail = function (id) {
        $http({
            'method': 'GET',
            'url': interface_url + '/gdc/strategy/' + id + '/',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            }else if (data.code === 200 || data.code === '200'){
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
                    }).success(function (data) {
                        if(data.code === 403 || data.code === '403'){
                            $rootScope.showLogin();
                        }else {
                            if (data.code === 200 || data.code === '200'){
                                $scope.warehouseList = data.result;
                                for (var i = 0; i < $scope.warehouseList.length; i++) {
                                    if ($scope.warehouseList[i].id == warehouseId) {
                                        $scope.params.warehouse = $scope.warehouseList[i].name;
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
    $scope.editJobId = '';
    /**
     * [editCase 修改情况下]
     * @param  {[string]} itemId [修改的id
     * @return {[type]}        [description]
     */
    $scope.editJob = function (itemId) {
        $scope.dialog = {
            header: '修改',
            input_isClick: false,
            add:true,
            status: 'modify'
        };
        $scope.editJobId = itemId;
        $scope.getJobDetail(itemId);
    };
    // 确认修改策略
    $scope.editJobConfirm = function () {
        var paramsAll = {
            'product': $scope.params.productName.id,
            //'name': $scope.params.systemName,
            'description': $scope.params.systemName,
            'warehouse': $scope.params.warehouse,
            'wechatGroup': $scope.params.wechatGroup,
            'is_active': $scope.params.is_active,
            //'is_board_display': $scope.params.board.is_board_display,
            //'sort_priority': $scope.params.sort_priority
        };
        $http({
            'method': 'POST',
            'url': interface_url + '/gdc/strategy/' + $scope.editJobId +'/',
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
                $scope.getJobList();
                $("#myModal").modal('hide');
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            $rootScope.showToast('修改失败');
        })
    };
    // 删除
    $scope.delJobId = '';
    // 获取某条要删除系统的id
    $scope.delJob = function (itemId, index) {
        $scope.delJobId = itemId;
        $scope.delIndex = index;
        $scope.dialog = {
            header: '删除',
            status: 'del'
        };
    };
    // 确认删除
    $scope.delJobConfirm = function () {
        $http({
            'method': 'DELETE',
            'url': interface_url + '/gdc/strategy/' + $scope.delJobId + '/',
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
                $scope.getJobList();
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            $rootScope.showToast('删除失败');
        })
    };

    // 禁用某条代码分支
    $scope.disableJobId = '';
    $scope.disableJob = function (itemId, index) {
        console.log(itemId)
        $scope.dialog = {
            header: '禁用',
            status: 'disable'
        };
        $scope.disableJobId = itemId;
        $scope.disableIndex = index;
    };
    // 确认禁用
    $scope.disableJobConfirm = function () {
        $http({
            'method': 'POST',
            'url': interface_url + '/gdc/strategy/' + $scope.disableJobId + '/',
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
                $scope.jobList[$scope.disableIndex].is_active = false;
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
    .controller('jobManage', jobManage)    // 任务管理-->任务管理
