/**
 * Created by Administrator on 2017/6/8.
 */
/*微信组*/
function weChatGroup($scope, $rootScope, $http, interface_url) {
    // 分页开始
    //点击分页执行的函数
    $scope.changePageFun = function (pageNumber) {
        // console.log($scope);
        $http({
            'method': 'GET',
            'url': interface_url + '/gdc/wechatgroup/',
            'params': {
                'page': pageNumber,
                'is_active': 'all',
                'name': $scope.name
            },
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
            if (data.code === 200 || data.code === '200'){
                $scope.wechatGroupList = data.result;
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
    // dialog配置
    $scope.dialog = {
        header: '',
        input_isClick: false,
        detail: false,
        add: false,
        status: ''
    };
    // 1、获取系统列表
    $scope.wechatGroupList = [];
    $scope.getWechatGroupList = function () {
        $scope.pageNum=1;
        $scope.forInitPage = true;
        $http({
            'method': 'GET',
            'params': {
                'is_active': 'all',
                'page': 1
            },
            'url': interface_url + '/gdc/wechatgroup/',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
            if (data.code === 200 || data.code === '200'){
                $scope.wechatGroupList = data.result;
                $scope.initPageCompomentFun(data.allPage,".forInit .tcdPageCode");
                //$scope.queryStorageList = data.result;
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
        });
    };
    $scope.getWechatGroupList();
// 2、查询系微信号列表
    // 点击查询
    $scope.queryCase = function () {
        $scope.pageNum=1;
        $scope.forInitPage = false;
        var sendData = {
            'name': $scope.queryWechatParam.name,
            'is_active': 'all',
            'page': 1
        };
        $http({
            'method': 'GET',
            'url': interface_url + '/gdc/wechatgroup/',
            'params': sendData,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
            if (data.code === 200 || data.code === '200'){
                $scope.wechatGroupList = data.result;
                $scope.initPageCompomentFun(data.allPage,".forSearch .tcdPageCode");
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('查询失败');
        })
    };
    // 初始化参数，清空新增完保存的数据
    $scope.initParam = function () {
        $scope.params = {
            name: '',
            group: '',
            is_active: false
        };
        $scope.selectSearchResult = [];
    };
    $scope.reset = function (obj, arrString, arrBoolean) {
        for (var j = 0; j < arrString.length; j++) {
            obj[arrString[j]] = '';
        };
        for (var i = 0; i < arrBoolean.length; i++) {
            obj[arrBoolean[i]] = false;
        };
        return obj;
    };
    // 打开新增页面，初始化参数，配置dialog的内容
    $scope.openWechatGroup = function () {
        $scope.initParam();
        $scope.dialog = {
            header: '新增微信组',
            input_isClick: false,
            add: true,
            status: 'create'
        };
    };
    // 获取前置接口列表==0412==zxh==bug7用例添加前置接口不应该可选自身接口
    $scope.selectedRelateInter = function (callback) {
        $http({
            'method': 'GET',
            'url': interface_url + '/gdc/wechat/search/',
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
            console.info('获取列表失败')
        })
    };
    $scope.selectedRelateInter();
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
        $scope.searchResultIsShow = true;
        // 临时保存数组
        var tempArr = [];
        if($scope.interface_system_list){
            for (var i = 0; i < $scope.interface_system_list.length; i++) {
                if ($scope.interface_system_list[i].name.indexOf($scope.searchWord) > -1) {
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
            arr.push('"'+$scope.selectSearchResult[i].uuid+'"');
        }
        return '[' + arr.toString() + ']';
    };
    // 3、添加微信号
    $scope.addWechatGroupConfirm = function () {
        if (!$scope.params.name) {
            $rootScope.showToast('请输入名称') ;
            return;
        }
        var paramsAll = {
            'name': $scope.params.name,
            'group': $scope.organizeCorr_data(),
            'is_active': $scope.params.is_active
        };
        $http({
            'method': 'POST',
            'url': interface_url + '/gdc/wechatgroup/',
            'data': paramsAll,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $("#myModal").modal('hide');
                $rootScope.showLogin();
            }else {
            if (data.code === 201 || data.code === '201'){
                $rootScope.showToast('添加微信组成功');
                $('#myModal').modal('hide');
                //$scope.seeSystem(data.result.uuid);
                $scope.getWechatGroupList();
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast(data.message);
        })
    };
    /**
     * 3、查看微信号
     * @param  {[string]} itemId [查看的id]
     * @return {[type]}        [description]
     */
    $scope.seeWechatGroup = function (itemId) {
        $scope.dialog = {
            header: '查看',
            input_isClick: true,
            detail: true,
            status: 'see'
        };
        $scope.getWechatGroupDetail(itemId);
    };
    // 通过id查看系统详情的方法
    $scope.getWechatGroupDetail = function (id) {
        $http({
            'method': 'GET',
            'url': interface_url + '/gdc/wechatgroup/' + id + '/',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
            if (data.code === 200 || data.code === '200'){
                $scope.params = data.result;
                $scope.getUseCaseList_system = function(){
                    if (!data.result.group)return;
                    var blankArr = [];
                    // 将返回的data.corr_case 从字符串转为数组
                    var tempArr = data.result.group.split(/\"/);
                    //var tempArr = data.result.group.match(/\d\-[a-z]+/g);
                    if (tempArr) {
                        for (var j = 0; j <tempArr.length; j++) {
                            for (var i = 0; i < $scope.interface_system_list.length; i++) {
                                if ($scope.interface_system_list[i].uuid === tempArr[j]) {
                                    blankArr.push($scope.interface_system_list[i]);
                                }
                            }
                        }
                    }
                    //console.log(blankArr)
                    $scope.selectSearchResult = blankArr;
                };
                $scope.getUseCaseList_system();
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('查看系统详情失败');
        });
    };

    // 4、要修改的id
    $scope.editWechatGroupId = '';
    /**
     * [editCase 修改情况下]
     * @param  {[string]} itemId [修改的id
     * @return {[type]}        [description]
     */
    $scope.editWechatGroup = function (itemId) {
        $scope.dialog = {
            header: '修改',
            input_isClick: false,
            add:true,
            status: 'modify'
        };
        $scope.editWechatGroupId = itemId;
        $scope.getWechatGroupDetail(itemId);
    };
    // 确认修改系统
    $scope.editWechatGroupConfirm = function () {
        var paramsAll = {
            'name': $scope.params.name,
            'group': $scope.organizeCorr_data(),
            'is_active': $scope.params.is_active
        };
        $http({
            'method': 'POST',
            'url': interface_url + '/gdc/wechatgroup/' + $scope.editWechatGroupId +'/',
            'data': paramsAll,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $("#myModal").modal('hide');
                $rootScope.showLogin();
            }else {
            if (data.code === 202 || data.code === '202'){
                $rootScope.showToast('修改代成功');
                $scope.getWechatGroupList();
                $("#myModal").modal('hide');
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('修改失败');
        })
    };
    // 删除
    $scope.delWechatGroupId = '';
    // 获取某条要删除系统的id
    $scope.delWechatGroup = function (itemId, index) {
        $scope.delWechatGroupId = itemId;
        $scope.delIndex = index;
        $scope.dialog = {
            header: '删除',
            status: 'del'
        };
    };
    // 确认删除
    $scope.delWechatGroupConfirm = function () {
        $http({
            'method': 'DELETE',
            'url': interface_url + '/gdc/wechatgroup/' + $scope.delWechatGroupId + '/',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $("#DisableModel").modal('hide');
                $rootScope.showLogin();
            }else {
            if (data.code === 204 || data.code === '204'){
                $rootScope.showToast('删除成功');
                $("#DisableModel").modal('hide');
                $scope.getWechatGroupList();
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('删除失败');
        })
    };

    // 禁用
    $scope.disableWechatGroupId = '';
    $scope.disableWechatGroup = function (itemId, index) {
        // console.log(itemId)
        $scope.dialog = {
            header: '禁用',
            status: 'disable'
        };
        $scope.disableWechatGroupId = itemId;
        $scope.disableIndex = index;
    };
    // 确认禁用
    $scope.disableWechatGroupConfirm = function () {
        $http({
            'method': 'POST',
            'url': interface_url + '/gdc/wechatgroup/' + $scope.disableWechatGroupId + '/',
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
                $rootScope.showToast('禁用成功');
                $scope.wechatGroupList[$scope.disableIndex].is_active = false;
                $("#DisableModel").modal('hide');
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('禁用失败');
        });
    };
}
/**
 * Pass all functions into module
 */
angular
    .module('inspinia')
    .controller('weChatGroup', weChatGroup); // 用户管理==用户组
