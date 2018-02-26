/**
 * Created by Administrator on 2017/4/26.
 */

/**
 * [backUseCase_asso 用例管理-》关系]
 * @param  {[type]} $scope        [description]
 * @param  {[type]} $rootScope    [description]
 * @param  {[type]} $http         [description]
 * @param  {[type]} interface_url [description]
 * @return {[type]}               [description]
 */
function backUseCase_asso($scope, $rootScope, $http, interface_url) {
    //
    $scope.contentList = [];  // 保存列表
    $scope.systemList = [];   // 保存服务器列表
    $scope.interfaceList = [];   // 保存服务器列表
    $scope.selectedServer = {}; // 选中的服务器
    $scope.itemDetail = {};     // 单条数据
    $scope.modifyId = ''; // 正在修改条目的id
    $scope.disableId = '';  // 整在禁用的id
    $scope.delId = '';  // 正在删除条目的id
    // 修改参数
    $scope.modifyParams = {
        "server": null,
        "name": "",
        "description": "",
        "user": "",
        "password": "",
        "host": "",
        "port": "",
        "is_active": false
    };
    // 获取内容列表
    $scope.getContentList = function () {
        $scope.pageNum=1;
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/association/list/?format=json',
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
                $scope.contentList = data.result;
                $scope.initPageCompomentFun(data.allPage);
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('获取列表失败');
        });
    };
    // 分页开始
    //点击分页执行的函数
    $scope.changePageFun = function (pageNumber) {
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/association/list/?format=json',
            'params': {
                'page': pageNumber,
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
                $scope.contentList = data.result;
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            console.info('获取列表方法-分页error');
        })
    };
    //创建分页
    $scope.initPageCompomentFun = function (count) {
        $(".page-content .tcdPageCode").createPage({
            pageCount : count,
            current: 1,
            backFn: function (page_number) {
                $scope.pageNum=page_number;
                $scope.changePageFun(page_number);
            }
        })
    };
    // 分页结束
    //根据系统查询接口===0714==zxh
    $scope.selectedSystem = function(systemid){
        $scope.getAllInterface(systemid.id);
    }
    // 获取所有服务器列表
    $scope.getAllInterface = function (system_id) {
        // if ($scope.interfaceList.length === 0) {     解决MAG-320把这个注释了  gyw
            $http({
                'method': 'GET',
                'url': interface_url + '/interface/case/list/?format=json&system_id='+system_id,
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
                    $scope.interfaceList = data.result;
                }else {
                    $rootScope.showToast(data.message);
                }
            }}).error(function (data) {
                console.info('获取接口地址失败:' + data);
            });
        // }
    };
    // 获取所有系统的列表
    $scope.getAllSystem = function () {
        if ($scope.systemList.length === 0) {
            $http({
                'method': 'GET',
                'url': interface_url + '/interface/system/list/?format=json',
                'headers': {
                    'Authorization': 'Token ' + localStorage.getItem('auth_token')
                }
            }).success(function (data) {
                if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
                if (data.code === 200 || data.code === '200'){
                    $scope.systemList = data.result;
                }else {
                    $rootScope.showToast(data.message);
                }
            }}).error(function (data) {
                console.info('获取系统地址失败:' + data);
            });
        }
    };
    /**
     * 初始化新增关系的参数
     * @return {[type]} [description]
     */
    $scope.initAddParam = function () {
        $scope.getAllSystem();
        //$scope.getAllInterface();
        $scope.addItemParams = {
            "name": "",
            "description": "",
            "correct_name": "",
            "system": "",
            "case": "",
            "is_active": false
        };
    };
    $scope.initAddParam();
    /**
     * 确认增加关系
     * 要求correct_name 需要在前后加$
     */
    $scope.addMethod = function () {
        // console.log($scope.addItemParams);
        var params = {
            "name": $scope.addItemParams.name,
            "description": $scope.addItemParams.description,
            "correct_name": $scope.addItemParams.correct_name,
            "system": $scope.addItemParams.system.id,
            "case": $scope.addItemParams.case.id,
            "is_active": $scope.addItemParams.is_active,
            "source_field": $scope.addItemParams.source_field
        };
        // console.log(params);
        $http({
            'method': 'POST',
            'url': interface_url + '/interface/association/add/',
            'data': params,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $("#addModal").modal('hide');
                $rootScope.showLogin();
            }else {
            if (data.code === 201 || data.code === '201'){
                $rootScope.showToast('新增成功');
                $("#addModal").modal('hide');
                $scope.getContentList(); // 重新渲染页面列表
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('新增失败');
        });
    };
    /**
     * 查看某关系的详情
     * @param  {[string]} id [当前关系的id]
     * @return {[type]}    [description]
     */
    $scope.seeDes = function (id) {
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/association/detail/' + id + '/',
            'data': {},
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
            if (data.code === 200 || data.code === '200'){
                $scope.itemDetail = data.result;
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('查看失败');
        });
    };
    /**
     * 进入修改状态，同时渲染接口返回的数据
     * @param  {[type]} id [description]
     * @return {[type]}    [description]
     */
    $scope.modify = function (id) {
        $scope.getAllSystem();
        $scope.modifyId = id;
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/association/detail/' + id + '/',
            'data': {},
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
            $scope.modifyParams = data.result;
            // 下拉列表渲染系统
            for (var i = 0; i < $scope.systemList.length; i++) {
                if ($scope.systemList[i].id == data.result.system_id) {
                    $scope.modifyParams.system = $scope.systemList[i];
                }
            }
            var case_Id = data.result.case_id;
            $http({
                'method': 'GET',
                'url': interface_url + '/interface/case/list/?format=json&system_id='+data.result.system_id,
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
                    $scope.interfaceList = data.result;
                    // 下拉列表渲染接口
                    for (var i = 0; i < $scope.interfaceList.length; i++) {
                        if ($scope.interfaceList[i].id == case_Id) {
                            $scope.modifyParams.case = $scope.interfaceList[i];
                        }
                    }
                }else {
                    $rootScope.showToast(data.message);
                }
            }}).error(function (data) {
                console.info('获取接口地址失败:' + data);
            });
        }}).error(function (data) {
            $rootScope.showToast('详情展示失败');
        });
    };
    // 确认修改
    $scope.modifyMethod = function () {
        var params = {
            "name": $scope.modifyParams.name,
            "description": $scope.modifyParams.description,
            "correct_name": $scope.modifyParams.correct_name,
            "system": $scope.modifyParams.system.id,
            "case": $scope.modifyParams.case.id,
            "is_active": $scope.modifyParams.is_active,
            "source_field": $scope.modifyParams.source_field
        };
        $http({
            'method': 'PATCH',
            'url': interface_url + '/interface/association/detail/' + $scope.modifyId + '/update/',
            'data': params,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
            if (data.code === 202 || data.code === '202'){
                $rootScope.showToast('修改成功');
                $scope.getContentList(); //  修改后重新渲染列表数据
                $("#modifyModal").modal('hide');
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('修改失败');
        })
    };

    /**
     * 禁用某关系
     * @param {[string]} id    [某关系的id]
     * @param {[number]} index [关系的index索引]
     */
    $scope.Disable = function (id, index) {
        $scope.disableId = id;
        $scope.disableIndex = index;
        // console.log(index)
    };
    // 确认禁用
    $scope.DisableMethod = function () {
        var params = {
            is_active: false
        };
        $http({
            'method': 'PATCH',
            'url': interface_url + '/interface/association/detail/' + $scope.disableId + '/update/',
            'data': params,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $("#modifyModal").modal('hide');
                $rootScope.showLogin();
            }else {
            if (data.code === 202 || data.code === '202'){
                $rootScope.showToast('禁用成功');
                $scope.contentList[$scope.disableIndex].is_active = false;
                //$scope.getContentList(); //  修改后重新渲染列表数据
                $("#modifyModal").modal('hide');
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('禁用失败');
        })
    };
    /**
     * 打开删除
     * @param  {[string]} id    [关系的id]
     * @param  {[number]} index [关系的index索引]
     * @return {[type]}       [description]
     */
    $scope.del = function (id, index) {
        $scope.delId = id;
        $scope.delIndex = index;
    };
    // 确认删除
    $scope.delMethod = function () {
        // console.log('sdfsdfsdf')
        $http({
            'method': 'DELETE',
            'url': interface_url + '/interface/association/detail/' + $scope.delId + '/del/',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
            if (data.code === 204 || data.code === '204'){
                $rootScope.showToast('删除成功');
                // $scope.contentList.splice($scope.delIndex, 1);
                $scope.getContentList(); // 重新渲染页面列表
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('删除失败');
        });
    };
    // 确认删除
    // 进入页面  获取列表信息;
    $scope.getContentList();
}
/**
 * Pass all functions into module
 */
angular
    .module('inspinia')
    .controller('backUseCase_asso', backUseCase_asso);//用例管理==数据参数化
