/**
 * Created by Administrator on 2017/6/27.
 */
/**
 * Created by Administrator on 2017/5/22.
 */
/**
 * 代码管理---->代码执行
 */
function code_run($scope,$state, $rootScope, $stateParams, $http, interface_url, result_url, $interval) {

    $scope.parambranchA = [];
    $scope.paramcommitIdA = [];
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

    // 查看 面板
    $http({
        'method': 'GET',
        'url': interface_url + '/cmc/board/back/',
        'headers': {
            'Authorization': 'Token ' + localStorage.getItem('auth_token')
        }
    }).success(function (data) {
        /*for (var i = 0; i < data.result.length; i++) {
         if (data.result[i].products.length == 0) {
         data.result.splice(i, 1);
         i--;
         }
         }*/
        if (data.code === 200 || data.code === '200'){
            $scope.departId = $stateParams.proId;
            $scope.productsList = data.result;
            // for (var i = 0; i < $scope.productsList.length; i++) {
            //     for (var j = 0; j < $scope.productsList[i].product.length; j++) {
            //         for (var k = 0; k < $scope.productsList[i].product[j].public_warehouse_product.length; k++) {
            //             //console.log($scope.productsList[i].product[j].public_warehouse_product[k])
            //             if($scope.productsList[i].product[j].public_warehouse_product[k].cmc_warehouse){
            //                 $scope.cmc = $scope.productsList[i].product[j].public_warehouse_product[k].cmc_warehouse;
            //                 for (var m = 0; m < $scope.cmc.branchs.length; m++) {
            //                     if ($scope.cmc.branchs[m].name == $scope.cmc.branch_A) {
            //                         $scope.idBranch_A = $scope.cmc.branchs[m].uuid;
            //                         $http({
            //                             'method': 'GET',
            //                             'url': interface_url + '/gdc/branch/commit/'+$scope.idBranch_A + '/',
            //                             'headers': {
            //                                 'Authorization': 'Token ' + localStorage.getItem('auth_token')
            //                             }
            //                         }).success(function (data) {
            //                             $scope.branchATime = data.result;
            //                         }).error(function (data) {
            //                             // // console.log("调用失败");
            //                         });
            //                     }
            //                     if ($scope.cmc.branchs[m].name == $scope.cmc.branch_B) {
            //                         $scope.idBranch_B = $scope.cmc.branchs[m].uuid;
            //                         $http({
            //                             'method': 'GET',
            //                             'url': interface_url + '/gdc/branch/commit/'+$scope.idBranch_B + '/',
            //                             'headers': {
            //                                 'Authorization': 'Token ' + localStorage.getItem('auth_token')
            //                             }
            //                         }).success(function (data) {
            //                             $scope.branchBTime = data.result;
            //                         }).error(function (data) {
            //                             // // console.log("调用失败");
            //                         });
            //                     }
            //                 }
            //             }
            //         }
            //     }
            // }
        }else if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
        }else{
            $rootScope.showToast(data.message);
        }
        // console.log($scope.productsList)
    }).error(function (data) {
        // console.log("调用失败");
    });
    // 自动刷新
    var stopEvent;
    $scope.refreshInterface = function(){
        if(angular.isDefined(stopEvent)) return;
        $scope.count = 0;
        stopEvent = $interval(function () {
            $http({
                'method': 'GET',
                'url': interface_url + '/cmc/board/back/',
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
                // // console.log($scope.productsList)
            }).error(function (data) {
                // // console.log("调用失败");
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
        if(angular.isDefined(stopEvent))
        {
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
    $scope.branchATime = [];
    $scope.selectedBranchA = function(branchA){
        // console.log(branchA);
        // console.log($scope.parambranchA[branchA]);

        //选择分支后，停止刷新==dyl
        if(angular.isDefined(stopEvent))
        {
            $interval.cancel(stopEvent);
            stopEvent = undefined;
        }

        $http({
            'method': 'GET',
            'url': interface_url + '/gdc/branch/commit/'+$scope.parambranchA[branchA].uuid + '/',
            // 'url': interface_url + '/gdc/branch/commit/'+branchA.uuid + '/',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
                $scope.branchATime[branchA] = data.result;
            }
        }).error(function (data) {
            // // console.log("调用失败");
        });
    };
    // $scope.selectedCommitA = function(commitA){
    //     if(commitA){
    //         $scope.from_id = $scope.paramcommitIdA[commitA].commitId;
    //     }
    // };
    $scope.branchBTime = [];
    $scope.selectedBranchB = function(branchB){

        //选择分支后，停止刷新==dyl
        if(angular.isDefined(stopEvent))
        {
            $interval.cancel(stopEvent);
            stopEvent = undefined;
        }

        $http({
            'method': 'GET',
            'url': interface_url + '/gdc/branch/commit/'+$scope.parambranchB[branchB].uuid + '/',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
                $scope.branchBTime[branchB] = data.result;
            }
        }).error(function (data) {
            // // console.log("调用失败");
        });
    };
    // $scope.selectedCommitB = function(commitB){
    //     console.log('commitB:',commitB);
    //     console.log('$scope.paramcommitIdB[commitB].commitId:',$scope.paramcommitIdB[commitB].commitId);
    //     console.log('$scope.paramcommitIdB:',$scope.paramcommitIdB);
    //     if(commitB){
    //         $scope.to_id = $scope.paramcommitIdB[commitB].commitId;
    //         console.log('to_id:',$scope.to_id)
    //     }
    // };
    // ci环境== 执行03222
    //0414==zxh===bug18==执行job的页面改为默认自动刷新
    $scope.ciRun = function (branchA,branchB,from_id,to_id,warehouse) {
        //点执行开始刷新==dyl
        $scope.refreshInterface();

        // if(warehouse.cmc_warehouse.job){
        //     var sourceBranch_A,sourceBranch_B;
            // for (var i = 0; i < warehouse.cmc_warehouse.branchs.length; i++) {
            //     if (warehouse.cmc_warehouse.branchs[i].name == warehouse.cmc_warehouse.branch_A) {
            //         sourceBranch_A = warehouse.cmc_warehouse.branchs[i].uuid;
            //         break;
            //     }
            // }
            // for (var i = 0; i < warehouse.cmc_warehouse.branchs.length; i++) {
            //     if (warehouse.cmc_warehouse.branchs[i].name == warehouse.cmc_warehouse.branch_B) {
            //         sourceBranch_B = warehouse.cmc_warehouse.branchs[i].uuid;
            //         break;
            //     }
            // }
            // sourceBranch_A = warehouse.cmc_warehouse.branch_A;
            // sourceBranch_B = warehouse.cmc_warehouse.branch_B;
            console.log(branchA,branchB)
            if (typeof branchA === 'undefined' || typeof branchB === 'undefined'){
                $rootScope.showToast("请先选择对比分支和被对比分支");
                return
            }
            if(branchA && branchB){
                var params = {
                    branch_A: branchA.name,
                    branch_B: branchB.name,
                    // from_id:$scope.from_id,
                    // to_id:$scope.to_id
                    from_id: from_id?from_id.commitId:'',
                    to_id: to_id?to_id.commitId:''
                };
            }
            // else if (branchA){
            //     var params = {
            //         branch_A: branchA.name,
            //         branch_B: sourceBranch_B,
            //         from_id:$scope.from_id,
            //         to_id:$scope.to_id
            //     };
            // }else if(branchB){
            //     var params = {
            //         branch_A: sourceBranch_A,
            //         branch_B: branchB.name,
            //         from_id:$scope.from_id,
            //         to_id:$scope.to_id
            //     };
            // } else {
            //     var params = {
            //         branch_A: sourceBranch_A,
            //         branch_B: sourceBranch_B,
            //         from_id:$scope.from_id,
            //         to_id:$scope.to_id
            //     };
            // }
            if (params.branch_A && params.branch_B){
                warehouse.cmc_warehouse.last_result ='running';
                $scope.getResultState = function(){
                    $http({
                        'method': 'POST',
                        'url': interface_url + '/cmc/job/run/'+warehouse.cmc_warehouse.uuid+'/',
                        'data':params,
                        'headers': {
                            'Authorization': 'Token ' + localStorage.getItem('auth_token')
                        }
                    }).success(function (data) {
                        // $scope.from_id = '';
                        // $scope.to_id = '';
                        $scope.parambranchA = [];
                        $scope.parambranchB = [];
                        $scope.paramcommitIdA = [];
                        $scope.paramcommitIdB = [];
                        if(data.code === 403 || data.code === '403'){
                            $rootScope.showLogin();
                        }else if (data.code === 200 || data.code === '200'){
                            warehouse.cmc_warehouse.last_result =data.result_light;
                            //$scope.resultState = data.result_light;
                        }else {
                            $rootScope.showToast(data.message);
                        }
                    }).error(function (data) {
                        $rootScope.showToast(data.message);
                    });
                };
                $scope.getResultState();
            }else {
                $rootScope.showToast("请先选择对比分支和被对比分支");
            }
        // }else{
        //     $rootScope.showToast("没有自定的uuid，更新失败")
        // }

        /*runNum ++;
        if(itemId){
            // 渲染==点击执行按钮 将状态变为执行中
            if($scope.productsList){

                }
                $scope.getResultState = function(){
                    $http({
                        'method': 'GET',
                        'timeout' : 30*60*1000,
                        'url': interface_url + '/uasc/job/run/' + itemId + '/',
                        'headers': {
                            'Authorization': 'Token ' + localStorage.getItem('auth_token')
                        }
                    }).success(function (data) {
                        if (data.code === 200 || data.code === '200'){
                            $scope.resultState = data.result_light;
                            for (var i = 0; i < $scope.productsList.length; i++) {
                                for (var j = 0; j < $scope.productsList[i].product.length; j++) {
                                    for (var k = 0; k < $scope.productsList[i].product[j].uasc_system_product.length; k++) {
                                        if ($scope.productsList[i].product[j].uasc_system_product[k].uasc_sysInfo_system.CI){
                                            if ($scope.productsList[i].product[j].uasc_system_product[k].uasc_sysInfo_system.CI.job === itemId) {
                                                if(data.code === 200 || data.code === '200') {
                                                    $scope.productsList[i].product[j].uasc_system_product[k].uasc_sysInfo_system.CI.job_status = data.result_light;
                                                } else if (data.code === 500 || data.code === '500'){
                                                    $scope.productsList[i].product[j].uasc_system_product[k].uasc_sysInfo_system.CI.job_status = 'red';
                                                }
                                            }
                                        }

                                    }
                                }
                            }
                        }else {
                            $rootScope.showToast(data.message);
                        }
                    }).error(function (data) {
                        $rootScope.showToast(data.message);

                    });
                }
                $scope.getResultState();
            }
        } else {
            $rootScope.showToast('此环境的任务尚未设置');
        }*/
    };
    // ci环境== 详情
    $scope.detailList = [];
    $scope.cmc_name = '';
    $scope.ciRunDetail = function (warehouse) {
        $http({
            'method': 'GET',
            'url': interface_url + '/cmc/result/search/?warehouse=' + warehouse.cmc_warehouse.uuid,
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

            //通过接口查看日志文件==bug16==zxh
            // $scope.logResultCon = '';
            // $scope.logResult = function (build_number){
            //     $('#myModal').modal('hide');
            //     $http({
            //         'method': 'GET',
            //         'url': interface_url + '/gdc/jobs/log/'+ itemId + '/',
            //         'params': {
            //             'build_number': build_number
            //         },
            //         'headers': {
            //             'Authorization': 'Token ' + localStorage.getItem('auth_token')
            //         }
            //     }).success(function (data) {
            //         if (data.code === 200 || data.code === '200'){
            //             $scope.logResultCon = data.result;
            //         }else {
            //             $rootScope.showToast(data.message);
            //         }
            //     }).error(function (data) {
            //         $rootScope.showToast('查看日志文件失败');
            //     });
            // };
        }).error(function (data) {

            $rootScope.showToast('查看详情失败');
        });
        //$state.go('deployment.jobRunDetail');
    };

    // 通过id查看构建步骤的方法
    // $scope.getStepDetail = function (id) {
    //     $http({
    //         'method': 'GET',
    //         'url': interface_url + '/gdc/jobstep/' + id + '/',
    //         'headers': {
    //             'Authorization': 'Token ' + localStorage.getItem('auth_token')
    //         }
    //     }).success(function (data) {
    //         if (data.code === 200 || data.code === '200'){
    //             $scope.params = data.result;
    //         }else {
    //             $rootScope.showToast(data.message);
    //         }
    //     }).error(function (data) {
    //         $rootScope.showToast('查看构建步骤失败');
    //     });
    // };
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
    .controller('code_run', code_run)    // 代码管理==代码执行
