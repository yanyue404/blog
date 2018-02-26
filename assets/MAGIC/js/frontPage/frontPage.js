/**
 * Created by Administrator on 2017/5/2.
 */
/**
 * 自动化测试系统前台接口
 * */
/**消费金融接口持续集成看板
 * 产品开发环境结果表格==0209==zxh
 */
function productResultList($scope, $rootScope, $stateParams, $http, interface_url) {
    $http.get(interface_url + '/interface/board/')
        .success(function (data) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].product.length == 0) {
                    data.splice(i, 1);
                    i--;
                }
            }
            //var departId = $stateParams.proId;

            $scope.departId = $stateParams.proId;   //没有赋上值 undefined，数据格式不一致
            //if ($scope.departId) {
            //    localStorage.setItem("departId", departId);
            //} else {
            //    $scope.departId = localStorage.getItem("departId");
            //}
            $scope.productsList = data.result;
            /*
             var departId = $stateParams.proId;
             if (departId) {
             if (departId == null) {
             departId = localStorage.getItem("departId");
             } else {
             localStorage.setItem("departId", departId);
             }
             angular.forEach(data, function(data, i){
             if (departId === data.id) {
             // console.log(data)
             $scope.productsList = data;
             }
             })
             } else {
             $scope.productsList = data;
             }*/
            /*     $scope.productsList = data.productList;
             $scope.systemList = data.systemList;
             $scope.devList = data.devList*/
        })
        .error(function (data) {
            // console.log("调用失败");
        })
    $scope.isSuccess = function (tag) {
        if(tag === '1' || tag === '4'  || tag === '3') {
            return 'success' ;
        }else if (tag === '2' || tag === '7') {
            return 'failed' ;
        }else if (tag === '5' || tag === '6') {
            return 'running'
        }
    }
}
function productListCtrl($scope, $state, $rootScope, $http, interface_url) {
    $scope.products = [];
    $scope.state = $state;
    $http.get(interface_url + '/interface/board/active/?format=json')
        .success(function (data) {
            if (data.code === 200 || data.code === '200'){
                $scope.productsList = data.result; //规范命名应该为departmentList
            }else {
                $rootScope.showToast(data.message);
            }
        })
        .error(function (data) {
        });
}
/** 0306==zxh
 * 给所有的后台接口加token，格式如下：
 * 'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
 */
/**
 * 通过id获取部门 概述
 * @param $scope
 * @param $rootScope
 * @param $http
 * @param $state
 * @param $stateParams
 * @param interface_url
 */
function caseResultCtrl($scope, $rootScope, $http, $state, $stateParams, interface_url,result_url) {
    $scope.result_url = result_url;
    var departId = $stateParams.proId;
    // 为防止刷新网页导致 部门ID消失，请求失败，将部门ID保存在localStorage
    if (departId == null) {
        departId = localStorage.getItem("departId");
    } else {
        localStorage.setItem("departId", departId);
    }
    // 通过部门ID 获取部门概述
    $http.get(interface_url + '/interface/board/department/' + departId + '/?format=json')
        // 调用成功
        .success(function (data) {
            if (data.code === 200 || data.code === '200'){
                $scope.caseResultDatas = data.result;
                // console.log($scope.caseResultDatas);
                $scope.productsList = data.result.product;  //数据结构较之前接口发生变化，和68行代码的命名存在歧义
            }else {
                $rootScope.showToast(data.message);
            }
        })
        // 调用失败
        .error(function (data) {
            // console.log(arguments);
            $rootScope.showToast('调用失败');
        });
    //
    /**
     * [根据返回的各环境数据，更改各平台环境执]
     * @param  {[type]} input [各个环境的详细信息]
     * @return {[type]}       [各个环境的展示信息]
     */
    $scope.showStatusText = function (input) {
        if (input === null) {
            return '<span> 未执行</span>';
        }
        if (typeof input == 'undefined') {
            return '<span>未执行</span>';
        }
        if (typeof input === 'object') {
            if (input.status === '1' || input.status === '3'|| input.status ==='4') {
                return '<span class="label label-primary">成功</span>';
            }
            if (input.status === '2' || input.status === '7') {
                return '<span class="label label-danger">失败</span>';
            }
            if (input.status === '5' || input.status === '6') {
                return '<span class="label label-running">执行中</span>';
            }
            if (input.status === undefined) {
                return '<span>未执行</span>';
            }
        } else {
            return '<span>未执行</span>';
        }
    };

    /**
     * [根据返回的各环境数据，返回显示的执行时间]
     * @param  {[type]} input [返回的各个环境的信息]
     * @return {[type]}       [根据信息，调整显示]
     */
    $scope.showExeTime = function (input) {
        if (input === null) {
            return '----';
        }
        if (typeof input == 'undefined') {
            return '----';
        }
        if (typeof input === 'object') {
            return input.run_time ? input.run_time : '----';
        }
    };
    /**
     * [根据返回的各环境数据，返回显示的代码覆盖率]
     * @param  {[type]} input [返回的各个环境的信息]
     * @return {[type]}       [根据信息，调整显示的代码覆盖率]
     */
    $scope.showCover_percent = function (input) {
        if (input) {
            return input;
        }
        if (input === null) {
            return '----';
        }
        if (typeof input == 'undefined') {
            return '----';
        }
        if (typeof input === 'object') {
            return input.run_time ? input.run_time : '----';
        }
    };
    /**
     * 弹框
     */
    $scope.showToast = function (input) {

    };

}
/**
 * 通过id获取部门 概述====统一部署中心==0325
 * @param $scope
 * @param $rootScope
 * @param $http
 * @param $state
 * @param $stateParams
 * @param interface_url
 */
function setCenterCtrl($scope, $rootScope, $http, $state, $stateParams, interface_url, result_url) {
    $scope.result_url = result_url;
    var departId = $stateParams.proId;
    // 为防止刷新网页导致 部门ID消失，请求失败，将部门ID保存在localStorage
    if (departId == null) {
        departId = localStorage.getItem("departId");
    } else {
        localStorage.setItem("departId", departId);
    }
    // 通过部门ID 获取部门概述
    $http.get(interface_url + '/gdc/board/front/' + departId + '/')
        // 调用成功
        .success(function (data) {
            // console.log(data.result)
            $scope.caseResultDatas = data.result;//没有赋值成功
            console.log($scope.caseResultDatas)
            $scope.departmentDetail = data.result; //没有赋值成功
            $scope.productList = data.result.product;
        })
        // 调用失败
        .error(function (data) {
        });
      
    //   $scope.isSuccess = function (tag) {
    //     if(tag === '1' || tag === '4'  || tag === '3') {
    //         return 'success' ;
    //     }else if (tag === '2' || tag === '7') {
    //         return 'failed' ;
    //     }else if (tag === '5' || tag === '6') {
    //         return 'running'
    //     }
    // }
    /**
     * [根据返回的各环境数据，更改各平台环境执]
     * @param  {[type]} input [各个环境的详细信息]
     * @return {[type]}       [各个环境的展示信息]
     */
    $scope.showStatusText = function (input) {
        if (input === null) {
            return '<span> 未执行</span>';
        }
        if (typeof input == 'undefined') {
            return '<span>未执行</span>';
        }
        if (typeof input === 'object') {
            if (input.status === '1' || input.status === '3' || input.status === '4') {
                return '<span class="label label-primary">成功</span>';
            }
            if (input.status === '2' || input.status === '7') {
                return '<span class="label label-danger">失败</span>';
            }
            if (input.status === '5' || input.status === '6') {
                return '<span class="label label-running">执行中</span>';
            }
            if (input.status === undefined) {
                return '<span class="label ">未执行</span>';
            }
        } else {
            return '<span>未执行</span>';
        }
    };

    /**
     * [根据返回的各环境数据，返回显示的执行时间]
     * @param  {[type]} input [返回的各个环境的信息]
     * @return {[type]}       [根据信息，调整显示]
     */
    $scope.showExeTime = function (input) {
        if (input === null) {
            return '----';
        }
        if (typeof input == 'undefined') {
            return '----';
        }
        if (typeof input === 'object') {
            return input.run_time ? input.run_time : '----';
        }
    };
    /**
     * [根据返回的各环境数据，返回显示的代码覆盖率]
     * @param  {[type]} input [返回的各个环境的信息]
     * @return {[type]}       [根据信息，调整显示的代码覆盖率]
     */
    $scope.showCover_percent = function (input) {
        if (input) {
            return input;
        }
        if (input === null) {
            return '----';
        }
        if (typeof input == 'undefined') {
            return '----';
        }
        if (typeof input === 'object') {
            return input.run_time ? input.run_time : '----';
        }
    };
    /**
     * 弹框
     */
    $scope.showToast = function (input) {

    };
 } 

/**
 * 通过id获取部门 概述====业务中心
 * @param $scope
 * @param $rootScope
 * @param $http
 * @param $state
 * @param $stateParams
 * @param interface_url
 */
function uascCenterCtrl($scope, $rootScope, $http, $state, $stateParams, interface_url, result_url) {
    $scope.result_url = result_url;
    var departId = $stateParams.proId;
    // 为防止刷新网页导致 部门ID消失，请求失败，将部门ID保存在localStorage
    if (departId == null) {
        departId = localStorage.getItem("departId");
    } else {
        localStorage.setItem("departId", departId);
    }
    // 针对业务支持中心加的请求概述接口
    $http.get(interface_url + '/uasc/job/front/board/' + departId + '/')
        .success(function (data) {
            // conaole.log(data.result)
            $scope.businessList = data.result;
            // console.log($scope.businessList)
        });
    //
    /**
     * [根据返回的各环境数据，更改各平台环境执]
     * @param  {[type]} input [各个环境的详细信息]
     * @return {[type]}       [各个环境的展示信息]
     */
    $scope.showStatusText = function (input) {
        if (input === null) {
            return '<span> 未执行</span>';
        }
        if (typeof input == 'undefined') {
            return '<span>未执行</span>';
        }
        if (typeof input === 'object') {
            if (input.status === '1' || input.status === '3' || input.status === '4') {
                return '<span class="label label-primary">成功</span>';
            }
            if (input.status === '2' || input.status === '7') {
                return '<span class="label label-danger">失败</span>';
            }
            if (input.status === '5' || input.status === '6') {
                return '<span class="label label-running">执行中</span>';
            }
            if (input.status === undefined) {
                return '<span class="label ">未执行</span>';
            }
        } else {
            return '<span>未执行</span>';
        }
    };

    /**
     * [根据返回的各环境数据，返回显示的执行时间]
     * @param  {[type]} input [返回的各个环境的信息]
     * @return {[type]}       [根据信息，调整显示]
     */
    $scope.showExeTime = function (input) {
        if (input === null) {
            return '----';
        }
        if (typeof input == 'undefined') {
            return '----';
        }
        if (typeof input === 'object') {
            return input.run_time ? input.run_time : '----';
        }
    };
    /**
     * [根据返回的各环境数据，返回显示的代码覆盖率]
     * @param  {[type]} input [返回的各个环境的信息]
     * @return {[type]}       [根据信息，调整显示的代码覆盖率]
     */
    $scope.showCover_percent = function (input) {
        if (input) {
            return input;
        }
        if (input === null) {
            return '----';
        }
        if (typeof input == 'undefined') {
            return '----';
        }
        if (typeof input === 'object') {
            return input.run_time ? input.run_time : '----';
        }
    };
    /**
     * 弹框
     */
    $scope.showToast = function (input) {

    };

}
/**
 * 各产品详情页
 * @param $scope
 * @param $rootScope
 * @param $http
 * @param $state
 * @param $stateParams
 * @param interface_url  保存的请求根地址
 */
function productDetailCtrl($scope, $rootScope, $http, $state, $stateParams, interface_url, result_url) {
    $scope.result_url = result_url;
    var productId = $stateParams.proId;
    var productName = $stateParams.proName;
    // 保存产品ID到本地，防止刷新无数据
    if (productId == null && productName == null) {
        productId = localStorage.getItem("productId");
        productName = localStorage.getItem("productName");
    } else {
        localStorage.setItem("productId", productId);
        localStorage.setItem("productName", productName);
    }

    $scope.proName = productName;
    // 根据产品ID 获取产品的详情信息
    $http.get(interface_url + '/interface/board/product/' + productId + '/')
        .success(function (data) {
            $scope.detailData = data.result;
            $scope.systemList = data.result.system;
            // console.log(data.result.system)
            // 循环产品下各个系统，整理出需要展示的信息，存入$scope
           
            if ($scope.detailData.system) {
               
                for (i = 0; i < $scope.detailData.system.length; i++) {
                    // 保存系统的执行状况
                    $scope.detailData.system[i].resultClone = {
                        
                        dev: getText($scope.detailData.system[i].result.dev),
                        ci: getText($scope.detailData.system[i].result.ci),
                        sit: getText($scope.detailData.system[i].result.sit),
                        asspro: getText($scope.detailData.system[i].result.asspro),
                        pro: getText($scope.detailData.system[i].result.pro),
                       
                    };
                    // 保存系统的各个canvas的展示数据；
                    $scope.detailData.system[i].allCanvas = {
                        // $scope.systemList[i].allCanvas = {
                        detail: getDetail($scope.detailData.system[i].day_run_detail.sit),
                        passRatio: getRatio($scope.detailData.system[i].latest_result_cases.sit),
                        //scale: getScale($scope.detailData.system[i].latest_result_cases.sit),
                        scale: _getScale($scope.detailData.system[i].case_percentage),
                        defaultText: getDefaultText(i, 'sit')
                        
                    };
                    // 默认显示sit环境的图示
                    $scope.detailData.system[i].activeIndex = 2;
                    
                }
            }
            // console.log($scope.detailData);
        });
    /**
     * [点击各个环境的tab，切换不同的canvase]
     * @param  {[type]} environ [环境名字]
     * @param  {[type]} index   [当前tab的index]
     * @param  {[type]} p_index [当前系统的index]
     */
    $scope.tabPicture = function (environ, index, p_index) {
        $scope.detailData.system[p_index].activeIndex = index;
        
        var ss = $scope.detailData.system[p_index];
        
        $scope.detailData.system[p_index].allCanvas = {
            detail: getDetail($scope.detailData.system[p_index].day_run_detail[environ]),
            passRatio: getRatio($scope.detailData.system[p_index].latest_result_cases[environ]),
            //scale: getScale($scope.detailData.system[p_index].latest_result_cases[environ]),
            scale: _getScale($scope.detailData.system[p_index].case_percentage),
            defaultText: getDefaultText(p_index, environ)
        }
    };

    // 获取各个环境当前是否运行的状态
    /**
     * [根据各环境的数据，返回展示的数据]
     * @param  {[object]} input [各环境的数据]
     * @return {[object]}       [返回展示的数据]
     */
    function getText(input) {
        if (input === null || input === undefined) {
            return {
                text: '未执行',
                classN: 'label-default',
                run_time: '----',
                url: '',
                status: false
            };
        }
        // if (input.status === 'pass') {
            if (input.status === '1' || input.status === '3' || input.status === '4' ) {
            return {
                text: '成功',
                classN: 'label-primary',
                run_time: input.run_time,
                url: input.url,
                status: true
            };

        }
        // if (input.status === 'fail') {
            if (input.status === '2' || input.status === '7' ) {
            return {
                text: '失败',
                classN: 'label-danger',
                run_time: input.run_time,
                url: input.url,
                status: true
            };
        }
        //补充：状态为5 和 6 的时候是执行中
        if (input.status === '5' || input.status === '6' ) {
            return {
                text: '执行中',
                classN: 'label-running',
                run_time: input.run_time,
                url: input.url,
                status: true
            };
        }
        return {
            text: '未执行',
            classN: 'label-default',
            run_time: '',
            url: '',
            status: false
        };
    }

    /**
     * [各环境下case_percentage数据，返回charts所需要的数据]
     * @param  {[object]} input [环境下case_percentage字段数据]
     * @return {[array]}       [返回数据]
     */
    function _getScale(input) {
        // console.log(input);
        //if(!input)return;
        if (!input || input == {}) {
            return [{
                value: 100,
                color: "#eee",
                highlight: "#eee",
                label: "pass"
            }];
        }

        return [{
            value: parseInt(input.main),
            color: "#1ab394",
            highlight: "#01814A",
            label: "正向"
        },
            {
                value: parseInt(input.notMain),
                color: "#FFA500",
                highlight: "#8B5A00",
                label: "反向"
            }
        ];
    }

    //
    /**
     * [获取左侧饼图的数据]
     * @param  {[object]} input [环境latest_result_cases字段的数据]
     * @return {[array]}       [description]
     */
    function getRatio(input) {
        // console.log(input);
        if (!input || input == {}) {
            return [{
                value: 100,
                color: "#eee",
                highlight: "#eee",
                label: "pass"
            }];
        }
        return [{
            value: parseInt(input.pass),
            color: "#1ab394",
            highlight: "#01814A",
            label: "pass"
        },
            {
                value: parseInt(input.fail) + parseInt(input.error),
                color: "#FFA500",
                highlight: "#8B5A00",
                label: "fail"
            }
        ];

    }

    // 获取中间 波浪线图 的数据
    /**
     * 获取中间波浪线图示数据
     * @param  {[json]} input [环境下day_run_detail的字段数据]
     * @return {[json]}       [description]
     */
    function getDetail(input) {
        // 当没有返回数据的时候，展示一个灰色的默认展示，
        if (!input || input.percent.length == 0 || input.times.length == 0) {
            //var percent = transPercent(percent1)
            var percent = [100, 0];
            var times = ["0", "0"];

            var detailConfig = [{
                label: "Example dataset",
                fillColor: "rgba(238,238,238,0.5)",
                strokeColor: "rgba(238,238,238,0.7)",
                pointColor: "rgba(238,238,238,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(238,238,238,1)",
                data: percent,
            }];
            // 当只返回一个时间点的数据的时候，增加一个0点的默认数据，显示为一条斜线；
        } else if (input.percent.length == 1 || input.times.length == 1) {
            var percent = input.percent.slice(0);
            var times = input.times.slice(0);
            percent.unshift(0)
            times.unshift('0');
            // console.log(times)
            // console.log(percent)
            var detailConfig = [{
                label: "Example dataset",
                fillColor: "rgba(26,179,148,0.5)",
                strokeColor: "rgba(26,179,148,0.7)",
                pointColor: "rgba(26,179,148,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(26,179,148,1)",
                data: percent
            }];
            // 当返回的数据正常的情况下，展示为波浪线
        } else {
            var percent = input.percent;
            var times = input.times;
            var detailConfig = [{
                label: "Example dataset",
                fillColor: "rgba(26,179,148,0.5)",
                strokeColor: "rgba(26,179,148,0.7)",
                pointColor: "rgba(26,179,148,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(26,179,148,1)",
                data: percent
            }];
        }
        var outPut = {
            labels: times,          // 时间数组
            datasets: detailConfig  // 各时间对应的百分比数据
        };
        return outPut;
    }

    /**
     * [在canvas没有数据的情况下，文本显示为未执行
     * @param  {[number]} i     [当前系统的index]
     * @param  {[json]} input [当前系统的执行状况]
     * @return {[string]}       [返回]
     */
    function getDefaultText(i, input) {

        if ($scope.detailData.system[i].resultClone[input].text === '未执行') {
            return ' ' + '( 未执行 )';
        } else {
            return '';
        }
    }


}

/**
 * 测试列表controller
 * @param $scope
 * @param $http
 * @param $stateParams
 * @param interface_url
 */
function invDetailCtrl($scope, $http, $stateParams, interface_url) {
    // var env_id = $stateParams.env_id;
    var sys_id = $stateParams.sys_id;

    // console.log(env_id)
    // console.log(sys_id)
    // 保存环境ID与系统ID到本地，防止刷新失败
    // if (env_id == null) {
    //     env_id = localStorage.getItem("env_id");
    // } else {
    //     localStorage.setItem("env_id", env_id);
    // }

    if (sys_id == null) {
        sys_id = localStorage.getItem("sys_id");
    } else {
        localStorage.setItem("sys_id", sys_id);
    }

    $scope.sys_id = sys_id;
    // $scope.env_id = env_id;
    // 获取当前环境测试的详细列表
    $http.get(interface_url + '/interface/board/result/list/', {
            params: {
                system_id: sys_id,
                // env_id: env_id,
                format: 'json',
                page: 1
            }
        })
        .success(function (data) {
            $scope.pageNum = 1;
            console.log(data.result)
            $scope.invDetailData = data.result;
            
            $scope.initPageCompomentFun(data.allPage);
        });
    // 分页开始
    //点击分页执行的函数
    $scope.changePageFun = function (pageNumber) {
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/board/result/list/',
            'params': {
                system_id: sys_id,
                // env_id: env_id,
                format: 'json',
                page: pageNumber
            },
        }).success(function (resp) {
            if (resp.code === 200 || resp.code === '200'){
                $scope.invDetailData = resp.result;
            }else {
                $rootScope.showToast(resp.message);
            }
        }).error(function (resp) {
            console.info('-分页error');
        })
    };
    //创建分页
    $scope.initPageCompomentFun = function (count) {
        $(".ibox-content .tcdPageCode").createPage({
            pageCount : count,
            current: 1,
            backFn: function (page_number) {
                $scope.pageNum=page_number;
                $scope.changePageFun(page_number);
            }
        })
    };
    // 分页结束
}
/**
 * UI case status and case quantity
 */
function uiProductDetailCtrl($scope, $rootScope, $http, $stateParams, result_url) {
    $scope.result_url = result_url;
    var producerId = $stateParams.producerId;
    //$rootScope.rootUrl = "http://10.143.117.30:81/media";
    $http.get('http://10.143.117.38:84/board/' + producerId + '/')
        .success(function (data) {
            $scope.detailData = data;
            for (i = 0; i < $scope.detailData.length; i++) {

                $scope.detailData[i].lastest_result_cases = [{
                    value: $scope.detailData[i].latest_result_cases.pass,
                    color: "#1ab394",
                    highlight: "#01814A",
                    label: "pass"
                },
                    {
                        value: $scope.detailData[i].latest_result_cases.fail,
                        color: "#FFA500",
                        highlight: "#8B5A00",
                        label: "fail"
                    },
                    {
                        value: $scope.detailData[i].latest_result_cases.error,
                        color: "#FF5809",
                        highlight: "#842B00",
                        label: "error"
                    }
                ];

                $scope.detailData[i].day_run_detail = {
                    labels: $scope.detailData[i].day_run_detail.times,
                    datasets: [{
                        label: "Example dataset",
                        fillColor: "rgba(26,179,148,0.5)",
                        strokeColor: "rgba(26,179,148,0.7)",
                        pointColor: "rgba(26,179,148,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(26,179,148,1)",
                        data: $scope.detailData[i].day_run_detail.percent,
                    }]
                }
            }
        });
}
/**
 * UI case status and case quantity
 */
function uicaseResultCtrl($scope, $rootScope, $http, interface_url) {

    $http.get(interface_url + '/board/')
        .success(function (data) {
            $scope.caseResultDatas = data;
        });
}
/**
 * 为业务支持中心的产品详情单独加的控制器
 */
function businessProductCtrl($scope, $rootScope, $http, $state, $stateParams, interface_url, result_url) {
    $scope.result_url = result_url;
    var productId = $stateParams.proId;
    var productName = $stateParams.proName;
    // 保存产品ID到本地，防止刷新无数据
    if (productId == null && productName == null) {
        productId = localStorage.getItem("productId");
        productName = localStorage.getItem("productName");
    } else {
        localStorage.setItem("productId", productId);
        localStorage.setItem("productName", productName);
    }

    $scope.proName = productName;
    // 根据产品ID 获取产品的详情信息
    $http.get(interface_url + '/uasc/product/' + productId + '/')
        .success(function (data) {
            $scope.detailData = data.result;
            // 循环产品下各个系统，整理出需要展示的信息，存入$scope
            if ($scope.detailData.uasc_system_product) {
                for (i = 0; i < $scope.detailData.uasc_system_product.length; i++) {
                    // 保存系统的执行状况
                    $scope.detailData.uasc_system_product[i].resultClone = {
                        dev: getText($scope.detailData.uasc_system_product[i].result.dev),
                        ci: getText($scope.detailData.uasc_system_product[i].result.ci),
                        sit: getText($scope.detailData.uasc_system_product[i].result.sit),
                        asspro: getText($scope.detailData.uasc_system_product[i].result.asspro),
                        pro: getText($scope.detailData.uasc_system_product[i].result.pro),
                    };
                    // 保存系统的各个canvas的展示数据；
                    $scope.detailData.uasc_system_product[i].allCanvas = {
                        detail: getDetail($scope.detailData.uasc_system_product[i].day_run_detail.sit),
                        passRatio: getRatio($scope.detailData.uasc_system_product[i].run_case_percent.sit),
                        //scale: getScale($scope.detailData.system[i].latest_result_cases.sit),
                        scale: _getScale($scope.detailData.uasc_system_product[i].pass_case_percent.sit),
                        defaultText: getDefaultText(i, 'sit'),
                    };
                    // 默认显示sit环境的图示
                    $scope.detailData.uasc_system_product[i].activeIndex = 1;
                }
            }
            // console.log($scope.detailData);
        });
    /**
     * [点击各个环境的tab，切换不同的canvase]
     * @param  {[type]} environ [环境名字]
     * @param  {[type]} index   [当前tab的index]
     * @param  {[type]} p_index [当前系统的index]
     */
    $scope.tabPicture = function (environ, index, p_index) {
        $scope.detailData.uasc_system_product[p_index].activeIndex = index;
        var ss = $scope.detailData.uasc_system_product[p_index];
        $scope.detailData.uasc_system_product[p_index].allCanvas = {
            detail: getDetail($scope.detailData.uasc_system_product[p_index].day_run_detail[environ]),
            passRatio: getRatio($scope.detailData.uasc_system_product[p_index].run_case_percent[environ]),
            //scale: getScale($scope.detailData.system[p_index].latest_result_cases[environ]),
            scale: _getScale($scope.detailData.uasc_system_product[p_index].pass_case_percent[environ]),
            defaultText: getDefaultText(p_index, environ)
        }
    };

    // 获取各个环境当前是否运行的状态
    /**
     * [根据各环境的数据，返回展示的数据]
     * @param  {[object]} input [各环境的数据]
     * @return {[object]}       [返回展示额数据]
     */
    function getText(input) {
        if (input === null || input === undefined) {
            return {
                text: '未执行',
                classN: 'label-default',
                run_time: '----',
                url: '',
                status: false
            };
        }
        if (input.status === 'pass') {
            return {
                text: '成功',
                classN: 'label-primary',
                run_time: input.run_time,
                url: input.url,
                status: true
            };

        }
        if (input.status === 'fail') {
            return {
                text: '失败',
                classN: 'label-danger',
                run_time: input.run_time,
                url: input.url,
                status: true
            };
        }

        return {
            text: '未执行',
            classN: 'label-default',
            run_time: '',
            url: '',
            status: false
        };
    }

    /**
     * [各环境下pass_case_percent数据，返回charts所需要的数据]
     * @param  {[object]} input [环境下pass_case_percent字段数据]
     * @return {[array]}       [返回数据]
     */
    function _getScale(input) {
        // console.log(input);
        //if(!input)return;
        if (!input || input == {}) {
            return [{
                value: 100,
                color: "#eee",
                highlight: "#eee",
                label: "pass"
            }];
        }

        return [{
            value: parseInt(input.pass),
            color: "#1ab394",
            highlight: "#01814A",
            label: "通过"
        },
            {
                value: parseInt(input.notPass),
                color: "#FFA500",
                highlight: "#8B5A00",
                label: "未通过"
            }
        ];
    }

    //
    /**
     * [获取左侧饼图的数据]
     * @param  {[object]} input [环境run_case_percent字段的数据]
     * @return {[array]}       [description]
     */
    function getRatio(input) {
        // console.log(input);
        if (!input || input == {}) {
            return [{
                value: 100,
                color: "#eee",
                highlight: "#eee",
                label: "pass"
            }];
        }
        return [{
            value: parseInt(input.execute),
            color: "#1ab394",
            highlight: "#01814A",
            label: "执行"
        },
            {
                value: parseInt(input.notExecute),
                color: "#FFA500",
                highlight: "#8B5A00",
                label: "fail"
            }
        ];

    }

    // 获取中间 波浪线图 的数据
    /**
     * 获取中间波浪线图示数据
     * @param  {[json]} input [环境下day_run_detail的字段数据]
     * @return {[json]}       [description]
     */
    function getDetail(input) {
        // 当没有返回数据的时候，展示一个灰色的默认展示，
        if (!input || input.percent.length == 0 || input.times.length == 0) {
            //var percent = transPercent(percent1)
            var percent = [100, 0];
            var times = ["0", "0"];

            var detailConfig = [{
                label: "Example dataset",
                fillColor: "rgba(238,238,238,0.5)",
                strokeColor: "rgba(238,238,238,0.7)",
                pointColor: "rgba(238,238,238,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(238,238,238,1)",
                data: percent,
            }];
            // 当只返回一个时间点的数据的时候，增加一个0点的默认数据，显示为一条斜线；
        } else if (input.percent.length == 1 || input.times.length == 1) {
            var percent = input.percent.slice(0);
            var times = input.times.slice(0);
            percent.unshift(0)
            times.unshift('0');
            // console.log(times)
            // console.log(percent)
            var detailConfig = [{
                label: "Example dataset",
                fillColor: "rgba(26,179,148,0.5)",
                strokeColor: "rgba(26,179,148,0.7)",
                pointColor: "rgba(26,179,148,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(26,179,148,1)",
                data: percent
            }];
            // 当返回的数据正常的情况下，展示为波浪线
        } else {
            var percent = input.percent;
            var times = input.times;
            var detailConfig = [{
                label: "Example dataset",
                fillColor: "rgba(26,179,148,0.5)",
                strokeColor: "rgba(26,179,148,0.7)",
                pointColor: "rgba(26,179,148,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(26,179,148,1)",
                data: percent
            }];
        }
        var outPut = {
            labels: times,          // 时间数组
            datasets: detailConfig  // 各时间对应的百分比数据
        };
        return outPut;
    }

    /**
     * [在canvas没有数据的情况下，文本显示为未执行
     * @param  {[number]} i     [当前系统的index]
     * @param  {[json]} input [当前系统的执行状况]
     * @return {[string]}       [返回]
     */
    function getDefaultText(i, input) {

        if ($scope.detailData.uasc_system_product[i].resultClone[input].text === '未执行') {
            return ' ' + '( 未执行 )';
        } else {
            return '';
        }
    }


}

/**
 * 为业务支持中心的环境详情单独加的控制器
 */
function businessDetailCtrl($scope, $http, $stateParams, interface_url, result_url) {
    $scope.result_url = result_url;
    var env_id = $stateParams.env;
    var sys_id = $stateParams.system;
    // 保存环境ID与系统ID到本地，防止刷新失败
    if (env_id == null) {
        env_id = localStorage.getItem("env_id");
    } else {
        localStorage.setItem("env_id", env_id);
    }

    if (sys_id == null) {
        sys_id = localStorage.getItem("sys_id");
    } else {
        localStorage.setItem("sys_id", sys_id);
    }

    $scope.sys_id = sys_id;
    $scope.env_id = env_id;
    // 获取当前环境测试的详细列表
    $http.get(interface_url + '/uasc/sys/result/', {
        params: {
            system: sys_id,
            env: env_id,
            page: 1
        }
    })
        .success(function (data) {
            $scope.pageNum = 1;
            $scope.bussinessDetailData = data.result;
            $scope.initPageCompomentFun(data.allPage);
        });
    // 分页开始
    //点击分页执行的函数
    $scope.changePageFun = function (pageNumber) {
        $http({
            'method': 'GET',
            'url': interface_url + '/uasc/sys/result/',
            'params': {
                system: sys_id,
                env: env_id,
                page: pageNumber
            },
        }).success(function (resp) {
            if (resp.code === 200 || resp.code === '200'){
                $scope.bussinessDetailData = resp.result;
            }else {
                $rootScope.showToast(resp.message);
            }
        }).error(function (resp) {
            console.info('-分页error');
        })
    };
    //创建分页
    $scope.initPageCompomentFun = function (count) {
        $(".forPageClass .tcdPageCode").createPage({
            pageCount : count,
            current: 1,
            backFn: function (page_number) {
                $scope.pageNum=page_number;
                $scope.changePageFun(page_number);
            }
        })
    };
    // 分页结束
}
/**
 * Pass all functions into module
 */
angular
    .module('inspinia')
    .controller('productResultList', productResultList) //  消费金融接口持续集成看板   首页
    .controller('productListCtrl', productListCtrl)
    .controller('caseResultCtrl', caseResultCtrl) // caseResultCtrl 部门概述  businessProductCtrl
    .controller('setCenterCtrl', setCenterCtrl) // 前台==统一部署看板
    .controller('uascCenterCtrl', uascCenterCtrl) // 前台==业务支持中心
    .controller('productDetailCtrl', productDetailCtrl)
    .controller('invDetailCtrl', invDetailCtrl)
    .controller('uicaseResultCtrl', uicaseResultCtrl)
    .controller('uiProductDetailCtrl', uiProductDetailCtrl)
    .controller('businessDetailCtrl', businessDetailCtrl)   // 业务支持中心的环境详情页
    .controller('businessProductCtrl', businessProductCtrl)   // 业务支持中心的产品详情页