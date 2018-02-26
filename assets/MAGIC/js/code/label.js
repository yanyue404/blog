/**
 * Created by Administrator on 2017/8/22.
 */
/**
 * 代码管理---->commit历史对比
 */
function code_contrast($scope,$state, $rootScope, $stateParams, $http, interface_url, result_url, $interval) {

    $scope.cmc_branch = '';
    $scope.currentValue = [];
    $scope.parambranchB = [];
    $scope.paramcommitIdB = [];
    $scope.result_url = result_url;
    $scope.showResultStatus = function (val) {
        if (val === 'success') {
            return '成功';
        }
        if (val === 'fail') {
            return '失败';
        }
        if (val ==="running"){
            return '执行中';
        }
    };
    $scope.interface_url = interface_url;


    // 获取标签接口
    $scope.tagsList = function (warehouse) {
        //选择分支后，停止刷新==dyl
        if(angular.isDefined(stopEvent))
        {
            $interval.cancel(stopEvent);
            stopEvent = undefined;
        }
        if(!warehouse.tag) {
            $http({
                'method': 'GET',
                'url': interface_url + '/cmc/getTags/?cmc_warehouse='+warehouse.cmc_warehouse.uuid,
                'headers': {
                    'Authorization': 'Token ' + localStorage.getItem('auth_token')
                }
            }).success(function (data) {
                if (data.code === 200 || data.code === '200'){
                    warehouse.tag = data.result;
                }else if(data.code === 403 || data.code === '403'){
                    $rootScope.showLogin();
                }else{
                    $rootScope.showToast(data.message);
                }
            });
        }
    };
    // 获取分支
    $scope.branchList = function (warehouse) {
        //选择分支后，停止刷新==dyl
        if(angular.isDefined(stopEvent))
        {
            $interval.cancel(stopEvent);
            stopEvent = undefined;
        }
        if (!warehouse.branch) {
            $http({
                'method': 'GET',
                'url': interface_url + '/cmc/getBranchs/?cmc_warehouse='+warehouse.cmc_warehouse.uuid,
                'headers': {
                    'Authorization': 'Token ' + localStorage.getItem('auth_token')
                }
            }).success(function (data) {
                if (data.code === 200 || data.code === '200'){
                    warehouse.branch = data.result;
                }else if(data.code === 403 || data.code === '403'){
                    $rootScope.showLogin();
                }else{
                    $rootScope.showToast(data.message);
                }
            });
        }
    }



    // 查看 面板
    $http({
        'method': 'GET',
        'url': interface_url + '/cmc/board/commit/back/',
        'headers': {
            'Authorization': 'Token ' + localStorage.getItem('auth_token')
        }
    }).success(function (data) {
        if (data.code === 200 || data.code === '200'){
            $scope.departId = $stateParams.proId;
            $scope.productsList = data.result;
        }else if(data.code === 403 || data.code === '403'){
            $rootScope.showLogin();
        }else{
            $rootScope.showToast(data.message);
        }
    }).error(function (data) {
    });
    // 自动刷新
    var stopEvent;
    $scope.refreshInterface = function(){
        if(angular.isDefined(stopEvent)) return;
        $scope.count = 0;
        stopEvent = $interval(function () {
            $http({
                'method': 'GET',
                'url': interface_url + '/cmc/board/commit/back/',
                'headers': {
                    'Authorization': 'Token ' + localStorage.getItem('auth_token')
                }
            }).success(function (data) {
                if(data.code === 403 || data.code === '403'){
                    $rootScope.showLogin();
                }else{
                    $scope.departId = $stateParams.proId;
                    $scope.productsList = data.result;
                }
            }).error(function (data) {
            });
        }, 5*1000);
    };
    $scope.refreshInterface();
    $scope.startRun = function () {
        $scope.refreshInterface();
    };
    // 停止刷新
    $scope.stopRun = function (){
        $scope.count = '';
        if(angular.isDefined(stopEvent)) {
            $interval.cancel(stopEvent);
            stopEvent = undefined;
            $rootScope.showToast("停止刷新成功！")
        } else {
            $rootScope.showToast("并没有在自动刷新！")
        }
    };
    // 0427==bug181==关闭执行构建页面停止刷新==zxh
    $rootScope.$on('$stateChangeStart',
        function(event, toState, toParams, fromState, fromParams){
            if(angular.isDefined(stopEvent))
            {
                $interval.cancel(stopEvent);
                stopEvent = undefined;
            } else {
            }
        })


    $scope.branchBTime = [];
    // 拿到分支
    $scope.selectedBranch = function(warehouse){

        //选择分支后，停止刷新==dyl
        if(angular.isDefined(stopEvent))
        {
            $interval.cancel(stopEvent);
            stopEvent = undefined;
        }

        $http({
            'method': 'GET',
            'url': interface_url + '/cmc/getCommits/',
            'params': {
                cmc_warehouse: warehouse.cmc_warehouse.uuid,
                branch: warehouse.cmc_branch.name
            },
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
                warehouse.commits = data.result;
            }
        });
    };
    // 执行
    $scope.ciRun = function (warehouse) {
        //点执行开始刷新==dyl
        $scope.refreshInterface();
        if(warehouse.commits && warehouse.commitTime) {
            // console.log(warehouse.commits,warehouse.commitTime);
            for(var i = 0;i < warehouse.commits.length;i++) {
                if(warehouse.commitTime.commitTime === warehouse.commits[i].commitTime) {
                    warehouse.commitId = warehouse.commits[i].commitId;
                    // console.log(warehouse.commitId,warehouse.commitTime);
                }
            };
        };
        if (warehouse.cmc_tag && warehouse.cmc_branch && warehouse.commitId){
            warehouse.cmc_warehouse.last_result ='running';
            $scope.getResultState = function(){
                $http({
                    'method': 'POST',
                    'url': interface_url + '/cmc/compareTagBranch/',
                    'data':{
                        cmc_warehouse: warehouse.cmc_warehouse.uuid,
                        tag: warehouse.cmc_tag.name,
                        branch: warehouse.cmc_branch.name,
                        commit_id: warehouse.commitId
                    },
                    'headers': {
                        'Authorization': 'Token ' + localStorage.getItem('auth_token')
                    }
                }).success(function (data) {
                    $scope.parambranchB = [];
                    $scope.paramcommitIdB = [];
                    if(data.code === 403 || data.code === '403'){
                        $rootScope.showLogin();
                    }else if (data.code === 200 || data.code === '200'){
                        warehouse.cmc_warehouse.last_result =data.result_light;
                    }else {
                        $rootScope.showToast(data.message);
                    }
                }).error(function (data) {
                    $rootScope.showToast(data.message);
                });
            };
            $scope.getResultState();
        }else {
            $rootScope.showToast("请先选择标签和被对比分支");
        }
    };
    // ci环境== 详情
    $scope.detailList = [];
    $scope.cmc_name = '';
    $scope.ciRunDetail = function (warehouse) {
        $http({
            'method': 'GET',
            'url': interface_url + '/cmc/commitResult/search/?warehouse=' + warehouse.cmc_warehouse.uuid,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
                $(".modal-backdrop").hide()
            }else {
                $scope.detailList = data.result;
                $scope.cmc_name = "仓库："+ $scope.detailList[0].warehouse_name;
            }
        }).error(function (data) {
            $rootScope.showToast('查看详情失败');
        });
        //$state.go('deployment.jobRunDetail');
    };

    $scope.isShowwarehouse = function(warehouse){
        return warehouse.cmc_warehouse!==null || warehouse.cmc_warehouse==='[]'
    };
    $scope.isShowProduct = function(product){
        warehouse = product.public_warehouse_product
        var result = false
        for (var i=0;i<warehouse.length;i++){
            if ($scope.isShowwarehouse(warehouse[i])){
                result = true;
                break
            }
        }
        return result
    };
    $scope.isShowDepartment = function(department){
        products = department.product
        var result = false
        for (var i=0;i<products.length;i++){
            if ($scope.isShowProduct(products[i])){
                result = true;
                break
            }
        }
        return result
    };
}
/**
 * Pass all functions into module
 */
angular
    .module('inspinia')
    .controller('codeContrast', code_contrast)    // 代码管理==commit历史对比
