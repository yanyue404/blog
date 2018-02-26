/**
 * Created by Administrator on 2017/4/27.
 */
/**
 * 统一部署---->执行构建
 */
function deployment_jobRun($scope,$state, $rootScope, $stateParams, $http, interface_url, result_url, $interval,$timeout) {
    // $scope.role = sessionStorage.getItem('role');
    // $scope.developer = sessionStorage.getItem('developer');
    // $scope.tester = sessionStorage.getItem('tester');
    // console.log('role:' + $scope.role);
    $scope.result_url = result_url;
    $scope.showResultStatus = function (val) {
        if (val === '1') {
            return '成功';
        }
        if (val === '2') {
            return '失败';
        }
        if (val === '3') {
            return '取消';
        }
        if (val === '4') {
            return '终止';
        }
        if (val === '5') {
            return '执行中';
        }
        if (val === '6') {
            return '等待中';
        }
        if (val === '7') {
            return '异常';
        }
    };
    $scope.showPercent = function (val) {
        val = parseFloat(val);
        // console.log(val);
        if (val <= 100) {
            return val+"%";
        }
        if (val > 100) {
            return '95%';
        }
    };
    $scope.interface_url = interface_url;
    // 查看 面板
    $http({
        'method': 'GET',
        'url': interface_url + '/gdc/board/back/',
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
        if(data.code === 403 || data.code === '403') {
            $rootScope.showLogin();
        }else if (data.code === 200 || data.code === '200'){
            // console.log($stateParams.proId)
            // console.log(data.result)
            $scope.departId = $stateParams.proId;
            $scope.productsList = data.result;
        }else {
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
                'url': interface_url + '/gdc/board/back/',
                'headers': {
                    'Authorization': 'Token ' + localStorage.getItem('auth_token')
                }
            }).success(function (data) {
                if(data.code === 403 || data.code === '403') {
                    $rootScope.showLogin();
                }else {
                    $scope.departId = $stateParams.proId;
                    $scope.productsList = data.result;
                }

                // // console.log($scope.productsList)
            }).error(function (data) {
                // // console.log("调用失败");
            });
        }, 10*1000);
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
    // ci环境== 执行03222
    //0414==zxh===bug18==执行job的页面改为默认自动刷新
    $scope.ciRun = function (item) {
        if(item){
            // 渲染==点击执行按钮 将状态变为执行中
            item.status = 'running';
            item.percent = "1%";
            $scope.getResultState = function(){
                $http({
                    'method': 'POST',
                    'timeout' : 30*60*1000,
                    'data': {
                        'task_id': item.task_id
                    },
                    'url': interface_url + '/task/task/run/',
                    'headers': {
                        'Authorization': 'Token ' + localStorage.getItem('auth_token')
                    }
                }).success(function (data) {
                    if(data.code === 403 || data.code === '403') {
                        $rootScope.showLogin();
                    }else if (data.code === 200 || data.code === '200'){
                        console.log(data.result_light)
                        item.status =  data.result_light;
                    }else {
                        $rootScope.showToast(data.message);
                    }
                }).error(function (data) {
                    $rootScope.showToast('执行失败');
                    item.status =  data.result_light;
                });
            }
            $scope.getResultState();
            /*// 自动刷新
             var stopEvent;
             $scope.refreshState = function(){
             if(angular.isDefined(stopEvent)) return;
             stopEvent = $interval(function () {
             $http({
             'method': 'GET',
             'url': interface_url + '/gdc/board/back/jobs/',
             'headers': {
             'Authorization': 'Token ' + localStorage.getItem('auth_token')
             }
             }).success(function (data) {
             if (data.code === 200 || data.code === '200'){
             $scope.departId = $stateParams.proId;
             $scope.productsList = data.result;
             }else {
             $rootScope.showToast(data.message);
             }
             }).error(function (data) {
             });
             /!* for (var i = 0; i < $scope.productsList.length; i++) {
             for (var j = 0; j < $scope.productsList[i].products.length; j++) {
             for (var k = 0; k < $scope.productsList[i].products[j].systems.length; k++) {
             if ($scope.productsList[i].products[j].systems[k].results.CI){
             if ($scope.productsList[i].products[j].systems[k].results.CI.job_uuid === itemId) {
             if($scope.productsList[i].products[j].systems[k].results.CI.result !== 'running'){
             console.log(111);
             runNum--;
             console.log(runNum);
             if (runNum<=0){
             if(angular.isDefined(stopEvent))
             {
             $interval.cancel(stopEvent);
             stopEvent = undefined;
             //$rootScope.showToast(itemId + "执行结束！")
             } else {
             //$rootScope.showToast("并没有在执行的任务！")
             }
             }
             }
             }
             }
             if ($scope.productsList[i].products[j].systems[k].results.SIT){
             if ($scope.productsList[i].products[j].systems[k].results.SIT.job_uuid === itemId) {
             if($scope.productsList[i].products[j].systems[k].results.SIT.result !== 'running'){
             console.log(111);
             runNum--;
             console.log(runNum);
             if (runNum===0){
             if(angular.isDefined(stopEvent))
             {
             $interval.cancel(stopEvent);
             stopEvent = undefined;
             //$rootScope.showToast(itemId + "执行结束！")
             } else {
             //$rootScope.showToast("并没有在执行的任务！")
             }
             }
             }
             }
             }
             if ($scope.productsList[i].products[j].systems[k].results.ASSPRO){
             if ($scope.productsList[i].products[j].systems[k].results.ASSPRO.job_uuid === itemId) {
             if($scope.productsList[i].products[j].systems[k].results.ASSPRO.result !== 'running'){
             console.log(111);
             runNum--;
             console.log(runNum);
             if (runNum===0){
             if(angular.isDefined(stopEvent))
             {
             $interval.cancel(stopEvent);
             stopEvent = undefined;
             //$rootScope.showToast(itemId + "执行结束！")
             } else {
             //$rootScope.showToast("并没有在执行的任务！")
             }
             }
             }
             }
             }
             }
             }
             }*!/
             }, 10*1000);
             };
             $scope.refreshState();
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
             };*/
        } else {
            $rootScope.showToast('此环境的任务尚未设置');
        }
    };
    // ci环境== 回滚
    $scope.ciRunBack = function (itemId) {
        $http({
            'method': 'GET',
            'url': interface_url + '/gdc/board/back/' + itemId + '/',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }

        }).success(function (data) {
            //$scope.params = data.result;
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            }else {
                for (var i = 0; i < $scope.productsList.length; i++) {
                    for (var j = 0; j < $scope.productsList[i].product.length; j++) {
                        for (var k = 0; k < $scope.productsList[i].product[j].system.length; k++) {
                            if ($scope.productsList[i].product[j].system[k].result.ci){
                                if ($scope.productsList[i].product[j].system[k].result.ci.task_id === itemId) {
                                    if(data.code === 200 || data.code === '200') {
                                        console.log($scope.productsList[i].product[j].system[k].result.ci)
                                        $scope.productsList[i].product[j].system[k].result.ci.status = 'success';
                                    } else if (data.code === 500 || data.code === '500'){
                                        $scope.productsList[i].product[j].system[k].result.ci.status = 'fail';
                                    }
                                }
                            }
                            if ($scope.productsList[i].product[j].system[k].result.sit){
                                if ($scope.productsList[i].product[j].system[k].result.sit.task_id === itemId) {
                                    if(data.code === 200 || data.code === '200') {
                                        console.log($scope.productsList[i].product[j].system[k].result.sit)
                                        $scope.productsList[i].product[j].system[k].result.sit.status = 'success';
                                    } else if (data.code === 500 || data.code === '500'){
                                        $scope.productsList[i].product[j].system[k].result.sit.status = 'fail';
                                    }
                                }
                            }
                            if ($scope.productsList[i].product[j].system[k].result.dev){
                                if ($scope.productsList[i].product[j].system[k].result.dev.task_id === itemId) {
                                    if(data.code === 200 || data.code === '200') {
                                        $scope.productsList[i].product[j].system[k].result.dev.status = 'success';
                                    } else if (data.code === 500 || data.code === '500'){
                                        $scope.productsList[i].product[j].system[k].result.dev.status = 'fail';
                                    }
                                }
                            }
                        }
                    }
                }
            }

        }).error(function (data) {
            $rootScope.showToast('回滚失败');
        });
    };
    // ci环境== 详情
    $scope.detailList = [];
    $scope.job_name = '';
    $scope.ciRunDetail = function (systemId,envId) {
        // var paramsAll = {
        //     'system': systemId,
        //     'env': envId
        // };
        $http({
            'method': 'GET',
            'url': interface_url + '/gdc/sysinfo/result/detail/',
            'params':{'task': $scope.task_id},
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if (data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            } else {
                $scope.detailList = data.result;
                // 点击【日志文件】按钮触发，跳转到对应的log文件
                $scope.logFile = function (build_id) {
                    var url = window.location.origin;
                    var flag = false; // 判断是否取得对应的log_url
                    for (var i = 0; i < $scope.detailList.length; i++) {
                        if ($scope.detailList[i].build_id === build_id && $scope.detailList[i].log_url) {
                            url += $scope.detailList[i].log_url;
                            flag = true;
                            break;
                        }
                    }
                    if (flag === true) window.open(url);
                };

                //$scope.job_name = $scope.detailList[0].job_name;
                //通过接口查看日志文件==bug16==zxh
                // $scope.logResultCon = '';
                // $scope.logResult = function (build_id,jobUuid){
                //     $('#myModal').modal('hide');
                //     $http({
                //         'method': 'GET',
                //         'url': interface_url + '/gdc/board/back/'+ jobUuid + '/',
                //         'params': {
                //             'build_id': build_id
                //         },
                //         'headers': {
                //             'Authorization': 'Token ' + localStorage.getItem('auth_token')
                //         }
                //     }).success(function (data) {
                //         if(data.code === 403 || data.code === '403') {
                //             $rootScope.showLogin();
                //         }else if (data.code === 200 || data.code === '200'){
                //             $scope.logResultCon = data.result;
                //         }else {
                //             $rootScope.showToast(data.message);
                //         }
                //     }).error(function (data) {
                //         $rootScope.showToast('查看日志文件失败');
                //     });
                // };
            }

        }).error(function (data) {
            $rootScope.showToast('查看详情失败');
        });
        //$state.go('deployment.jobRunDetail');
    };

    // 通过id查看构建步骤的方法
    $scope.getStepDetail = function (id) {
        $http({
            'method': 'GET',
            'url': interface_url + '/gdc/board/back/' + id + '/',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            }else if (data.code === 200 || data.code === '200'){
                $scope.params = data.result;
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            $rootScope.showToast('查看构建步骤失败');
        });
    };
}
/**
 * Pass all functions into module
 */
angular
    .module('inspinia')
    .controller('deployment_jobRun', deployment_jobRun);    // 统一部署==执行构建
