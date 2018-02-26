/**
 * INSPINIA - Responsive Admin Theme
 * Creat By  Mustang    2017.6.9
 * Inspinia theme use AngularUI Router to manage routing and views
 * Each view are defined as state.
 * Initial there are written state for all view in theme.
 *chao.cc.@51job.com
 */
"use strict"
//  配置路由
app.config(["$stateProvider", "$urlRouterProvider", routeFn]);
// 定义常量 interface_url
app.constant('code_url', 'http://10.143.117.38:81/qa/'); // 代码分析地址
// app.constant('interface_url', 'http://127.0.0.1:8000');
// app.constant('result_url','http://10.143.117.38:90/media/'); // 查看日志
// 生产
// app.constant('interface_url', 'http://10.143.117.38:84');
// app.constant('result_url','http://10.143.117.38:81/media/');
// 测试环境
// app.constant('interface_url', 'http://10.143.117.38:85') ;// API
// app.constant('result_url','http://10.143.117.38:90/media/'); // 查看日志
//开发环境==前端
// app.constant('interface_url', 'http://10.143.117.38:18000');
//开发环境
app.constant('interface_url', 'http://10.143.117.38:18001');
app.constant('result_url', 'http://10.143.117.38:18000/media/'); // 查看日志
app.run(function ($rootScope, $state) {
    $rootScope.$state = $state;
    //生产
    // $rootScope.rootUrl = "http://10.143.117.38:81/media/";
    //测试
    $rootScope.rootUrl = "http://10.143.117.38:90/media/";
    // 判断是否是前台前端页面，如果是的话，进行是否登录校验
    $rootScope.isFront = function (name) {
        var arr = ['abilityAutomation', 'interface', 'business', 'unify'];
        for (var i = 0; i < arr.length; i++) {
            if (name.indexOf(arr[i]) > -1) {
                return true;
            }
        }
        return false;
    };
    // 路由开始的时候，判断是否登录，如果未登录，并且要跳转的页面不是前台的页面，跳转到登录页
    $rootScope.$on('$stateChangeStart', function (event, to, toParams, from, fromParams) {
        if (!($rootScope.isFront(to.name))) {
            if (!localStorage.getItem('auth_token')) {
                // if(to.name !== 'interface.login'){
                //     event.preventDefault();// 取消默认跳转行为
                //     $state.go('interface.login');
                if (to.name !== 'login') {
                    event.preventDefault(); // 取消默认跳转行为
                    $state.go('login');
                }
            }
        }
    })
});
//  路由函数
function routeFn($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/interface/board");
    $stateProvider
        .state('login', {
            params: {
                proName: null,
                proId: null
            },
            url: "/login",
            // templateUrl: "views/userManage/backUser_login.html"+"?datestamp=" + (new Date).valueOf(),
            templateUrl: "views/frontPage/login.html" + "?datestamp=" + (new Date).valueOf(),
            data: {
                pageTitle: '登录'
            },
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        files: ['js/plugins/footable/footable.all.min.js', 'css/plugins/footable/footable.core.css', 'css/backUser_login.css']
                    }]);
                }
            }
        })
        .state('log', {
            abstract: true,
            url: "/log",
            templateUrl: "views/backCommon/content.html" + "?datestamp=" + (new Date).valueOf()
        })
        // 统一部署---执行Job页面日志文件
        .state('log.jobRunLog', {
            url: "/jobRunLog",
            templateUrl: "views/deployment_jobRunLog.html" + "?datestamp=" + (new Date).valueOf(),
        })
        // 后台页面
        // 后台管理首页
        .state('back', {
            abstract: true,
            url: "/back",
            templateUrl: "views/backCommon/content.html" + "?datestamp=" + (new Date).valueOf()
        })
        .state('back.index', {
            url: "/backIndex",
            templateUrl: "views/back_index.html",
            data: {
                pageTitle: '自动化测试系统后台管理系统首页'
            },
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                            files: ['js/plugins/footable/footable.all.min.js', 'css/plugins/footable/footable.core.css']
                        },
                        {
                            name: 'ui.footable',
                            files: ['js/plugins/footable/angular-footable.js']
                        }
                    ]);
                }
            }
        })
        // 后台管理=====基本信息
        .state('backInfo', {
            abstract: true,
            url: "/backInfo",
            templateUrl: "views/backCommon/content.html"
        })
        // 基本信息--部门 <script src="js/baseInfo/department.js?v=1.07"></script> <!--基本信息==部门-->
        .state('backInfo.department', {
            url: "/backDepartment",
            templateUrl: "views/baseInfo/backInfo_department.html" + "?datestamp=" + (new Date).valueOf(),
            // controller:"backDepartment",     这个写的话会导致控制器执行两遍
            data: {
                pageTitle: '后台基本信息模块部门'
            },
            resolve: {
                deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                    return $ocLazyLoad.load("js/baseInfo/department.js");
                }],
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        files: ['js/plugins/footable/pagefile.js']
                    }]);
                }
            }
        })
        // 基本信息--产品
        .state('backInfo.product', {
            url: "/backProduct",
            templateUrl: "views/baseInfo/backInfo_product.html" + "?datestamp=" + (new Date).valueOf(),
            data: {
                pageTitle: '后台基本信息模块产品'
            },
            resolve: {
                deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                    return $ocLazyLoad.load("js/baseInfo/product.js");
                }],
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        files: ['js/plugins/footable/pagefile.js']
                    }]);
                }
            }
        })
        // 初始化设置
        .state('initSet', {
            abstract: true,
            url: "/initSet",
            templateUrl: "views/backCommon/content.html"
        })
        // 初始化设置---部署类型
        .state('initSet.type', {
            params: {
                proName: null,
                proId: null
            },
            url: "/type",
            templateUrl: "views/initSet/deployment_type.html" + "?datestamp=" + (new Date).valueOf(),
            data: {
                pageTitle: '任务类型'
            },
            resolve: {
                deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                    return $ocLazyLoad.load("js/initSet/deployType.js");
                }],
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        files: ['js/plugins/footable/pagefile.js']
                    }]);
                }
            }
        })
        // 初始化设置==平台设置
        .state('initSet.panelSet', {
            url: "/panelSet",
            templateUrl: "views/initSet/panelSet.html" + "?datestamp=" + (new Date).valueOf(),
            data: {
                pageTitle: '设备平台'
            },
            resolve: {
                deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                    return $ocLazyLoad.load("js/initSet/panelSet.js");
                }],
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        files: ['js/plugins/footable/pagefile.js', 'css/backInfo_department.css' + "?datestamp=" + (new Date).valueOf()]
                    }]);
                }
            }
        })
        // 后台管理====业务管理
        .state('businessManage', {
            abstract: true,
            url: "/businessManage",
            templateUrl: "views/backCommon/content.html"
        })
        // 后台管理==业务管理--总览
        .state('businessManage.pandect', {
            url: "/pandect",
            templateUrl: "views/businessManage/pandect.html" + "?datestamp=" + (new Date).valueOf(),
            data: {
                pageTitle: '后台管理==业务管理--总览'
            },
            resolve: {
                deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                    return $ocLazyLoad.load("js/businessManage/pandect.js");
                }],
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        files: ['js/plugins/footable/pagefile.js', 'css/backInfo_department.css' + "?datestamp=" + (new Date).valueOf()]
                    }]);
                }
            }
        })
        // 后台管理==业务管理--系统管理
        .state('businessManage.systemManage', {
            url: "/systemManage",
            templateUrl: "views/businessManage/systemManage.html" + "?datestamp=" + (new Date).valueOf(),
            data: {
                pageTitle: '后台管理==业务管理--系统管理'
            },
            resolve: {
                deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                    return $ocLazyLoad.load("js/businessManage/systemManage.js");
                }],
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        files: ['js/plugins/footable/pagefile.js', 'css/backInfo_department.css' + "?datestamp=" + (new Date).valueOf()]
                    }]);
                }
            }
        })
        // 后台管理==业务管理--设备管理
        .state('businessManage.deviceManage', {
            url: "/deviceManage",
            templateUrl: "views/businessManage/deviceManage.html" + "?datestamp=" + (new Date).valueOf(),
            data: {
                pageTitle: '后台管理==业务管理--设备管理'
            },
            resolve: {
                deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                    return $ocLazyLoad.load("js/businessManage/deviceManage.js");
                }],
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        files: ['js/plugins/footable/pagefile.js', 'css/backInfo_department.css' + "?datestamp=" + (new Date).valueOf()]
                    }]);
                }
            }
        })
        // 后台管理==业务管理--公用用例
        .state('businessManage.commonCase', {
            url: "/commonCase",
            templateUrl: "views/businessManage/commonCase.html" + "?datestamp=" + (new Date).valueOf(),
            data: {
                pageTitle: '后台管理==业务管理--公用用例'
            },
            resolve: {
                deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                    return $ocLazyLoad.load("js/businessManage/commonCase.js");
                }],
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        files: ['js/plugins/footable/pagefile.js', 'css/backInfo_department.css' + "?datestamp=" + (new Date).valueOf()]
                    }]);
                }
            }
        })
        // 后台管理==业务管理--用例库
        .state('businessManage.cases', {
            url: "/cases",
            templateUrl: "views/businessManage/cases.html" + "?datestamp=" + (new Date).valueOf(),
            data: {
                pageTitle: '后台管理==业务管理--用例库'
            },
            resolve: {
                deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                    return $ocLazyLoad.load("js/businessManage/cases.js");
                }],
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        files: ['js/plugins/footable/pagefile.js', 'css/backInfo_department.css' + "?datestamp=" + (new Date).valueOf()]
                    }]);
                }
            }
        })
        // 后台管理==业务管理--业务策略
        .state('businessManage.businessStrategy', {
            url: "/businessStrategy",
            templateUrl: "views/businessManage/businessStrategy.html" + "?datestamp=" + (new Date).valueOf(),
            data: {
                pageTitle: '后台管理==业务管理--业务策略'
            },
            resolve: {
                deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                    return $ocLazyLoad.load("js/businessManage/businessStrategy.js");
                }],
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        files: ['js/plugins/footable/pagefile.js', 'css/backInfo_department.css' + "?datestamp=" + (new Date).valueOf()]
                    }]);
                }
            }
        })
        // 后台管理==业务管理--任务结果
        .state('businessManage.businessResult', {
            url: "/businessResult",
            templateUrl: "views/businessManage/businessResult.html" + "?datestamp=" + (new Date).valueOf(),
            data: {
                pageTitle: '后台管理==业务管理--任务结果'
            },
            resolve: {
                deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                    return $ocLazyLoad.load("js/businessManage/businessResult.js");
                }],
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        files: ['js/plugins/footable/pagefile.js', 'css/backInfo_department.css' + "?datestamp=" + (new Date).valueOf()]
                    }]);
                }
            }
        })
        // 后台管理==业务管理-图片管理
        .state('businessManage.pictureManage', {
            url: "/pictureManage",
            templateUrl: "views/businessManage/pictureManage.html" + "?datestamp=" + (new Date).valueOf(),
            data: {
                pageTitle: '后台管理==业务管理--图片管理'
            },
            resolve: {
                deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                    return $ocLazyLoad.load("js/businessManage/pictureManage.js");
                }],
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        files: ['js/plugins/footable/pagefile.js', 'css/backInfo_department.css' + "?datestamp=" + (new Date).valueOf()]
                    }]);
                }
            }
        })
        // 后台管理用例部分
        .state('backUseCase', {
            abstract: true,
            url: "/backUseCase",
            templateUrl: "views/backCommon/content.html" + "?datestamp=" + (new Date).valueOf()
        })

        // 基本信息--系统管理
        .state('backUseCase.system', {
            url: "/backSystem",
            templateUrl: "views/useCaseManage/backInfo_system.html" + "?datestamp=" + (new Date).valueOf(),
            data: {
                pageTitle: '后台基本信息模块系统'
            },
            resolve: {
                deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                    return $ocLazyLoad.load("js/baseInfo/system.js");
                }],
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['js/plugins/footable/pagefile.js', 'css/backInfo_department.css' + "?datestamp=" + (new Date).valueOf()]
                        },
                        {
                            name: 'ui.sortable',
                            files: ['js/plugins/ui-sortable/sortable.js']
                        }
                    ]);
                }
            }
        })
        // 基本信息--系统祥情 (弃用)
        // .state('backUseCase.envInfo', {
        //     url: "/envInfo",
        //     templateUrl: "views/useCaseManage/backInfo_envInfo.html"+"?datestamp=" + (new Date).valueOf(),
        //     data: { pageTitle: '后台基本信息模块系统' },
        //     resolve: {
        //         deps:["$ocLazyLoad",function($ocLazyLoad){
        //             return $ocLazyLoad.load(["js/baseInfo/systemDetail.js",'js/plugins/footable/pagefile.js']);
        //         }]
        //     }
        // })


        // 用例管理==模块
        .state('backUseCase.model', {
            url: "/model",
            templateUrl: "views/useCaseManage/backUseCase_model.html" + "?datestamp=" + (new Date).valueOf(),
            data: {
                pageTitle: '后台用例管理模块'
            },
            resolve: {
                deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                    return $ocLazyLoad.load("js/useCase/model.js");
                }],
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        files: ['js/plugins/footable/pagefile.js',
                            'css/backInfo_department.css' + "?datestamp=" + (new Date).valueOf()
                        ]
                    }]);
                }
            }
        })
        // 用例管理-接口
        .state('backUseCase.useCase', {
            url: "/backUseCase",
            templateUrl: "views/useCaseManage/backUseCase_useCase.html" + "?datestamp=" + (new Date).valueOf(),
            data: {
                pageTitle: '后台用例管理用例'
            },
            resolve: {
                deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                    return $ocLazyLoad.load("js/useCase/interface.js");
                }],
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                            files: ['js/plugins/footable/pagefile.js', 'css/backInfo_department.css' + "?datestamp=" + (new Date).valueOf()]
                        },
                        {
                            name: 'ui.sortable',
                            files: ['js/plugins/ui-sortable/sortable.js']
                        }
                    ]);
                }
            }
        })
        // 用例管理-用例
        .state('backUseCase.detail', {
            url: "/backDetail",
            templateUrl: "views/useCaseManage/backUseCase_detail.html" + "?datestamp=" + (new Date).valueOf(),
            data: {
                pageTitle: '后台用例管理详情'
            },
            resolve: {
                deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                    return $ocLazyLoad.load("js/useCase/usecase.js");
                }],
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                            files: ['js/plugins/footable/pagefile.js', 'css/backInfo_department.css' + "?datestamp=" + (new Date).valueOf()]
                        },
                        {
                            name: 'ui.sortable',
                            files: ['js/plugins/ui-sortable/sortable.js']
                        }
                    ]);
                }
            }
        })
        // 用例管理--设计策略
        .state('backUseCase.design', {
            url: "/backDesign",
            templateUrl: "views/useCaseManage/backUseCase_design.html" + "?datestamp=" + (new Date).valueOf(),
            data: {
                pageTitle: '后台用例管理设计'
            },
            resolve: {
                deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                    return $ocLazyLoad.load("js/useCase/strategy.js");
                }],
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        files: ['js/plugins/footable/pagefile.js', "css/backInfo_department.css" + "?datestamp=" + (new Date).valueOf()]
                    }]);
                }
            }
        })
        // 用例管理--关系
        .state('backUseCase.asso', {
            url: "/asso",
            templateUrl: "views/useCaseManage/backUseCase_asso.html" + "?datestamp=" + (new Date).valueOf(),
            data: {
                pageTitle: '关系'
            },
            resolve: {
                deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                    return $ocLazyLoad.load("js/useCase/dataParams.js");
                }],
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        files: ['js/plugins/footable/pagefile.js', "css/backInfo_department.css" + "?datestamp=" + (new Date).valueOf()]
                    }]);
                }
            }
        })

        // 后台管理结果部分
        .state('backResult', {
            abstract: true,
            url: "/backResult",
            templateUrl: "views/backCommon/content.html" + "?datestamp=" + (new Date).valueOf()
        })
        // 测试结果--接口结果
        .state('backResult.runResult', {
            url: "/backRunResult",
            templateUrl: "views/testResult/backResult_runResult.html" + "?datestamp=" + (new Date).valueOf(),
            data: {
                pageTitle: '后台执行结果'
            },
            resolve: {
                deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                    return $ocLazyLoad.load("js/testResult/runResult.js");
                }],
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                            files: ['js/plugins/footable/pagefile.js', 'css/backInfo_department.css' + "?datestamp=" + (new Date).valueOf()]
                        },

                    ]);
                }
            }
        })
        // 测试结果---部署结果
        .state('backResult.deployResult', {
            params: {
                proName: null,
                proId: null
            },
            url: "/deployResult",
            templateUrl: "views/testResult/deployment_result.html" + "?datestamp=" + (new Date).valueOf(),
            data: {
                pageTitle: '构建结果'
            },
            resolve: {
                deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                    return $ocLazyLoad.load("js/deploy/conResult.js");
                }],
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        files: ['js/plugins/footable/pagefile.js', 'css/backInfo_department.css' + "?datestamp=" + (new Date).valueOf()]
                    }]);
                }
            }
        })
        // 测试结果---业务结果
        .state('backResult.businessResult', {
            params: {
                proName: null,
                proId: null
            },
            url: "/businessResult",
            templateUrl: "views/testResult/businessResult.html" + "?datestamp=" + (new Date).valueOf(),
            data: {
                pageTitle: '构建结果'
            },
            resolve: {
                deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                    return $ocLazyLoad.load("js/testResult/businessResult.js");
                }],
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        files: ['js/plugins/footable/pagefile.js', 'css/backInfo_department.css' + "?datestamp=" + (new Date).valueOf()]
                    }]);
                }
            }
        })
        // 测试结果--覆盖结果
        .state('backResult.coverResult', {
            url: "/backCoverResult",
            templateUrl: "views/testResult/backResult_coverResult.html" + "?datestamp=" + (new Date).valueOf(),
            data: {
                pageTitle: '覆盖结果'
            },
            resolve: {
                deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                    return $ocLazyLoad.load("js/testResult/coverResult.js");
                }],
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        files: ['js/plugins/footable/pagefile.js', 'css/backInfo_department.css' + "?datestamp=" + (new Date).valueOf()]
                    }]);
                }
            }
        })
        // 系统配置
        .state('backSysConfig', {
            abstract: true,
            url: "/backSysConfig",
            templateUrl: "views/backCommon/content.html" + "?datestamp=" + (new Date).valueOf()
        })
        // 系统环境 -- 环境
        .state('initSet.env', {
            url: '/env',
            templateUrl: "views/systemSet/backSysConfig_env.html" + "?datestamp=" + (new Date).valueOf(),
            data: {
                pageTitle: '系统环境'
            },
            resolve: {
                deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                    return $ocLazyLoad.load("js/systemSet/env.js");
                }],
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        files: ['js/plugins/footable/footable.all.min.js', 'css/plugins/footable/footable.core.css', 'css/backInfo_department.css' + "?datestamp=" + (new Date).valueOf()]
                    }]);
                }
            }
        })
        //系统配置----基本信息系统
         .state('backSysConfig.baseInfo', {
            url: '/backSysConfig.baseInfo',
            templateUrl: "views/systemSet/backSysConfig_baseInfo.html" + "?datestamp=" + (new Date).valueOf(),
            data: {
                pageTitle: '基本信息系统'
            },
            resolve: {
                deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                    return $ocLazyLoad.load("js/systemSet/backSysConfig_baseInfo.js");
                }],
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        files: ['js/plugins/footable/pagefile.js', 'css/backInfo_department.css' + "?datestamp=" + (new Date).valueOf()]
                    }, ]);
                }
            }
        })
        // 系统环境 ---数据库
        .state('backSysConfig.database', {
            url: '/database',
            templateUrl: "views/systemSet/backSysConfig_database.html" + "?datestamp=" + (new Date).valueOf(),
            data: {
                pageTitle: '数据库'
            },
            resolve: {
                deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                    return $ocLazyLoad.load("js/systemSet/database.js");
                }],
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        files: ['js/plugins/footable/pagefile.js', 'css/backInfo_department.css' + "?datestamp=" + (new Date).valueOf()]
                    }, ]);
                }
            }
        })
        // 系统环境--服务器
        .state('backSysConfig.server', {
            url: "/server",
            templateUrl: "views/systemSet/backSysConfig_server.html" + "?datestamp=" + (new Date).valueOf(),
            data: {
                pageTitle: '后台基本信息模块中心'
            },
            resolve: {
                deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                    return $ocLazyLoad.load("js/systemSet/server.js");
                }],
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        files: ['js/plugins/footable/footable.all.min.js', 'css/plugins/footable/footable.core.css', 'css/backInfo_department.css' + "?datestamp=" + (new Date).valueOf()]
                    }]);
                }
            }
        })
        // 系统环境--jenkins服务器
        .state('backSysConfig.jenkinsServer', {
            url: "/jenkinsServer",
            templateUrl: "views/systemSet/backSysConfig_jenkinsServer.html" + "?datestamp=" + (new Date).valueOf(),
            data: {
                pageTitle: 'jenkins服务器'
            },
            resolve: {
                deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                    return $ocLazyLoad.load("js/systemSet/jenkinsServer.js");
                }],
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        files: ['js/plugins/footable/pagefile.js', 'css/backInfo_department.css' + "?datestamp=" + (new Date).valueOf()]
                    }]);
                }
            }
        })
        // 系统环境--数据仓库
        .state('backSysConfig.dataStorage', {
            url: "/dataStorage",
            templateUrl: "views/systemSet/backSysConfig_dataStorage.html" + "?datestamp=" + (new Date).valueOf(),
            data: {
                pageTitle: '数据仓库'
            },
            resolve: {
                deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                    return $ocLazyLoad.load("js/systemSet/dataStorage.js");
                }],
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        files: ['js/plugins/footable/pagefile.js', 'css/backInfo_department.css' + "?datestamp=" + (new Date).valueOf()]
                    }, ]);
                }
            }
        })
        // 系统环境--代码分支
        .state('backSysConfig.codeBranch', {
            url: "/codeBranch",
            templateUrl: "views/systemSet/backSysConfig_codeBranch.html" + "?datestamp=" + (new Date).valueOf(),
            data: {
                pageTitle: '代码分支'
            },
            resolve: {
                deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                    return $ocLazyLoad.load("js/systemSet/codeBranch.js");
                }],
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        files: ['js/plugins/footable/pagefile.js', 'css/backInfo_department.css' + "?datestamp=" + (new Date).valueOf()]
                    }, ]);
                }
            }
        })
        // 系统环境--微信号
        .state('backSysConfig.weChatNum', {
            url: "/weChatNum",
            templateUrl: "views/systemSet/backSysConfig_weChatNum.html" + "?datestamp=" + (new Date).valueOf(),
            data: {
                pageTitle: '微信号'
            },
            resolve: {
                deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                    return $ocLazyLoad.load("js/systemSet/wechatNum.js");
                }],
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        files: ['js/plugins/footable/pagefile.js', 'css/backInfo_department.css' + "?datestamp=" + (new Date).valueOf()]
                    }]);
                }
            }
        })
        // 系统环境--微信组
        .state('backSysConfig.weChatGroup', {
            url: "/weChatGroup",
            templateUrl: "views/systemSet/backSysConfig_weChatGroup.html" + "?datestamp=" + (new Date).valueOf(),
            data: {
                pageTitle: '微信组'
            },
            resolve: {
                deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                    return $ocLazyLoad.load("js/systemSet/wechatGroup.js");
                }],
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                            files: ['js/plugins/footable/pagefile.js', 'css/backInfo_department.css' + "?datestamp=" + (new Date).valueOf()]
                        },
                        {
                            name: 'ui.sortable',
                            files: ['js/plugins/ui-sortable/sortable.js']
                        }
                    ]);
                }
            }
        })
        // 部署管理---部署系统
        .state('deployment.system', {
            params: {
                proName: null,
                proId: null
            },
            url: "/system",
            templateUrl: "views/deploy/deployment_system.html" + "?datestamp=" + (new Date).valueOf(),
            data: {
                pageTitle: '部署系统'
            },
            resolve: {
                deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                    return $ocLazyLoad.load("js/deploy/system.js");
                }],
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                            files: ['js/plugins/footable/pagefile.js', 'css/backInfo_department.css' + "?datestamp=" + (new Date).valueOf()]
                        },
                        {
                            name: 'ui.sortable',
                            files: ['js/plugins/ui-sortable/sortable.js']
                        }
                    ]);
                }
            }
        })
        // 部署管理---部署系统详情
        // .state('deployment.systemDetail',{
        //     params: { proName: null, proId: null },
        //     url: "/systemDetail",
        //     templateUrl: "views/deploy/deployment_systemDetail.html"+"?datestamp=" + (new Date).valueOf(),
        //     data: { pageTitle: '部署系统详情' },
        //     resolve: {
        //         deps:["$ocLazyLoad",function($ocLazyLoad){
        //             return $ocLazyLoad.load("js/deploy/systemDetail.js");
        //         }],
        //         loadPlugin: function($ocLazyLoad) {
        //             return  $ocLazyLoad.load([{
        //                 files: ['js/plugins/footable/pagefile.js','css/backInfo_department.css'+"?datestamp=" + (new Date).valueOf()]
        //             },
        //                 {
        //                     name: 'ui.sortable',
        //                     files: ['js/plugins/ui-sortable/sortable.js']
        //                 }
        //             ]);
        //         }
        //     }
        // })
        // 部署管理---部署构建
        .state('deployment.jobRun', {
            params: {
                proName: null,
                proId: null
            },
            url: "/jobRun",
            templateUrl: "views/deploy/deployment_jobRun.html" + "?datestamp=" + (new Date).valueOf(),
            data: {
                pageTitle: '执行Job'
            },
            resolve: {
                deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                    return $ocLazyLoad.load("js/deploy/runCon.js");
                }],
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        files: ['js/plugins/footable/footable.all.min.js', 'css/plugins/footable/footable.core.css', 'css/backInfo_department.css' + "?datestamp=" + (new Date).valueOf()]
                    }]);
                }
            }
        })
        // 部署管理---部署策略
        .state('deployment.strategy', {
            params: {
                proName: null,
                proId: null
            },
            url: "/strategy",
            templateUrl: "views/deploy/deployment_strategy.html" + "?datestamp=" + (new Date).valueOf(),
            data: {
                pageTitle: '部署管理'
            },
            resolve: {
                deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                    return $ocLazyLoad.load("js/deploy/strategy.js");
                }],
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                            files: ['js/plugins/footable/pagefile.js', 'css/backInfo_department.css' + "?datestamp=" + (new Date).valueOf()]
                        },
                        {
                            name: 'ui.sortable',
                            files: ['js/plugins/ui-sortable/sortable.js']
                        }
                    ]);
                }
            }
        })
        // 系统环境--邮箱配置
        .state('backSysConfig.emailSet', {
            url: "/emailSet",
            templateUrl: "views/systemSet/backSysConfig_emailSet.html" + "?datestamp=" + (new Date).valueOf(),
            data: {
                pageTitle: '邮箱配置'
            },
            resolve: {
                deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                    return $ocLazyLoad.load("js/systemSet/emailSet.js");
                }],
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        files: ['js/plugins/footable/pagefile.js', 'css/backInfo_department.css' + "?datestamp=" + (new Date).valueOf()]
                    }]);
                }
            }
        })
        // 部署管理---分支管理
        .state('deployment.branchManage', {
            params: {
                proName: null,
                proId: null
            },
            url: "/branchManage",
            templateUrl: "views/deploy/deployment_branchManage.html" + "?datestamp=" + (new Date).valueOf(),
            data: {
                pageTitle: '分支管理'
            },
            resolve: {
                deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                    return $ocLazyLoad.load("js/deploy/branchManage.js");
                }],
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                            files: ['js/plugins/footable/pagefile.js', 'css/backInfo_department.css' + "?datestamp=" + (new Date).valueOf()]
                        },
                        {
                            name: 'ui.sortable',
                            files: ['js/plugins/ui-sortable/sortable.js']
                        }
                    ]);
                }
            }
        })
        // 系统环境--发送邮件配置
        .state('backSysConfig.emailSendSet', {
            url: "/emailSendSet",
            templateUrl: "views/systemSet/backSysConfig_emailSendSet.html" + "?datestamp=" + (new Date).valueOf(),
            data: {
                pageTitle: '发送邮件配置'
            },
            resolve: {
                deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                    return $ocLazyLoad.load("js/systemSet/emailSendSet.js");
                }],
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        files: ['js/plugins/footable/pagefile.js', 'css/backInfo_department.css' + "?datestamp=" + (new Date).valueOf()]
                    }]);
                }
            }
        })
        // 统一部署
        .state('deployment', {
            abstract: true,
            url: "/deployment",
            templateUrl: "views/backCommon/content.html" + "?datestamp=" + (new Date).valueOf()
        })
        // 统一部署---构建步骤
        .state('deployment.step', {
            params: {
                proName: null,
                proId: null
            },
            url: "/step",
            templateUrl: "views/deploy/deployment_step.html" + "?datestamp=" + (new Date).valueOf(),
            data: {
                pageTitle: '构建步骤'
            },
            resolve: {
                deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                    return $ocLazyLoad.load("js/deploy/step.js");
                }],
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        files: ['js/plugins/footable/pagefile.js', 'css/backInfo_department.css' + "?datestamp=" + (new Date).valueOf()]
                    }]);
                }
            }
        })
        // 任务
        .state('task', {
            abstract: true,
            url: "/task",
            templateUrl: "views/backCommon/content.html" + "?datestamp=" + (new Date).valueOf()
        })
        // 任务--接口任务管理
        .state('task.interTask', {
            url: "/interTask",
            templateUrl: "views/task/interTask.html" + "?datestamp=" + (new Date).valueOf(),
            data: {
                pageTitle: '接口Task'
            },
            resolve: {
                deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                    return $ocLazyLoad.load("js/task/interTask.js");
                }],
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                            files: ['js/plugins/footable/pagefile.js', "css/backInfo_department.css" + "?datestamp=" + (new Date).valueOf()]
                        },
                        {
                            name: 'ui.sortable',
                            files: ['js/plugins/ui-sortable/sortable.js']
                        }
                    ]);
                }
            }
        })
        // 任务---部署任务管理
        .state('task.deployTask', {
            params: {
                proName: null,
                proId: null
            },
            url: "/deployTask",
            templateUrl: "views/task/deployTask.html" + "?datestamp=" + (new Date).valueOf(),
            data: {
                pageTitle: '部署任务管理'
            },
            resolve: {
                deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                    return $ocLazyLoad.load("js/task/deployTask.js");
                }],
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                            files: ['js/plugins/footable/pagefile.js', 'css/backInfo_department.css' + "?datestamp=" + (new Date).valueOf()]
                        },
                        {
                            name: 'ui.sortable',
                            files: ['js/plugins/ui-sortable/sortable.js']
                        }
                    ]);
                }
            }
        })
        // 任务---代码任务管理
        .state('task.codeTask', {
            params: {
                proName: null,
                proId: null
            },
            url: "/codeTask",
            templateUrl: "views/task/codeTask.html" + "?datestamp=" + (new Date).valueOf(),
            data: {
                pageTitle: '部署任务管理'
            },
            resolve: {
                deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                    return $ocLazyLoad.load("js/task/codeTask.js");
                }],
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                            files: ['js/plugins/footable/pagefile.js', 'css/backInfo_department.css' + "?datestamp=" + (new Date).valueOf()]
                        },
                        {
                            name: 'ui.sortable',
                            files: ['js/plugins/ui-sortable/sortable.js']
                        }
                    ]);
                }
            }
        })
        // 任务---业务任务
        .state('task.businessTask', {
            params: {
                proName: null,
                proId: null
            },
            url: "/businessTask",
            templateUrl: "views/task/businessTask.html" + "?datestamp=" + (new Date).valueOf(),
            data: {
                pageTitle: '业务任务'
            },
            resolve: {
                deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                    return $ocLazyLoad.load("js/task/businessTask.js");
                }],
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                            files: ['js/plugins/footable/pagefile.js', 'css/backInfo_department.css' + "?datestamp=" + (new Date).valueOf()]
                        },
                        {
                            name: 'ui.sortable',
                            files: ['js/plugins/ui-sortable/sortable.js']
                        }
                    ]);
                }
            }
        })
        // 任务--其他任务管理
        .state('task.otherTask', {
            url: "/otherTask",
            templateUrl: "views/task/otherTask.html" + "?datestamp=" + (new Date).valueOf(),
            data: {
                pageTitle: '任务管理'
            },
            resolve: {
                deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                    return $ocLazyLoad.load("js/task/otherTask.js");
                }],
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                            files: ['js/plugins/footable/pagefile.js', "css/backInfo_department.css" + "?datestamp=" + (new Date).valueOf()]
                        },
                        {
                            name: 'ui.sortable',
                            files: ['js/plugins/ui-sortable/sortable.js']
                        }
                    ]);
                }
            }
        })
        // 任务--任务监听
        .state('task.taskMonitor', {
            url: "/taskMonitor",
            templateUrl: "views/task/taskMonitor.html" + "?datestamp=" + (new Date).valueOf(),
            data: {
                pageTitle: '任务管理'
            },
            resolve: {
                deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                    return $ocLazyLoad.load("js/task/taskMonitor.js");
                }],
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                            files: ['js/plugins/footable/pagefile.js', "css/backInfo_department.css" + "?datestamp=" + (new Date).valueOf()]
                        },
                        {
                            name: 'ui.sortable',
                            files: ['js/plugins/ui-sortable/sortable.js']
                        }
                    ]);
                }
            }
        })
        //20170830==代码分析管理
        // 代码分析管理
        .state('codeAnaly', {
            abstract: true,
            url: "/codeAnaly",
            templateUrl: "views/backCommon/content.html" + "?datestamp=" + (new Date).valueOf()
        })
        // 代码分析管理---系统管理
        .state('codeAnaly.system', {
            params: {
                proName: null,
                proId: null
            },
            url: "/system",
            templateUrl: "views/codeAnaly/system.html" + "?datestamp=" + (new Date).valueOf(),
            data: {
                pageTitle: '系统管理'
            },
            resolve: {
                deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                    return $ocLazyLoad.load("js/codeAnaly/system.js");
                }],
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                            files: ['js/plugins/footable/pagefile.js', 'css/backInfo_department.css' + "?datestamp=" + (new Date).valueOf()]
                        },
                        {
                            name: 'ui.sortable',
                            files: ['js/plugins/ui-sortable/sortable.js']
                        }
                    ]);
                }
            }
        })
        // 代码分析管理---代码分析策略
        .state('codeAnaly.codeAnaly', {
            params: {
                proName: null,
                proId: null
            },
            url: "/codeAnaly",
            templateUrl: "views/codeAnaly/codeAnaly.html" + "?datestamp=" + (new Date).valueOf(),
            data: {
                pageTitle: '代码分析策略'
            },
            resolve: {
                deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                    return $ocLazyLoad.load("js/codeAnaly/codeAnaly.js");
                }],
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                            files: ['js/plugins/footable/pagefile.js', 'css/backInfo_department.css' + "?datestamp=" + (new Date).valueOf()]
                        },
                        {
                            name: 'ui.sortable',
                            files: ['js/plugins/ui-sortable/sortable.js']
                        }
                    ]);
                }
            }
        })

        // 代码管理
        .state('code', {
            abstract: true,
            url: "/code",
            templateUrl: "views/backCommon/content.html" + "?datestamp=" + (new Date).valueOf()
        })
        // 代码管理---代码管理
        .state('code.warehouse', {
            params: {
                proName: null,
                proId: null
            },
            url: "/warehouse",
            templateUrl: "views/code/warehouse.html" + "?datestamp=" + (new Date).valueOf(),
            data: {
                pageTitle: '代码仓库'
            },
            resolve: {
                deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                    return $ocLazyLoad.load("js/code/warehouse.js");
                }],
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                            files: ['js/plugins/footable/pagefile.js', 'css/backInfo_department.css' + "?datestamp=" + (new Date).valueOf()]
                        },
                        {
                            name: 'ui.sortable',
                            files: ['js/plugins/ui-sortable/sortable.js']
                        }
                    ]);
                }
            }
        })
        // 代码管理---代码对比
        .state('code.compare', {
            params: {
                proName: null,
                proId: null
            },
            url: "/compare",
            templateUrl: "views/code/compare.html" + "?datestamp=" + (new Date).valueOf(),
            data: {
                pageTitle: '代码对比'
            },
            resolve: {
                deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                    return $ocLazyLoad.load("js/code/compare.js");
                }],
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                            files: ['js/plugins/footable/pagefile.js', 'css/backInfo_department.css' + "?datestamp=" + (new Date).valueOf()]
                        },
                        {
                            name: 'ui.sortable',
                            files: ['js/plugins/ui-sortable/sortable.js']
                        }
                    ]);
                }
            }
        })
        // 代码管理---任务管理
        .state('code.jobManage', {
            params: {
                proName: null,
                proId: null
            },
            url: "/jobManage",
            templateUrl: "views/code/jobManage.html" + "?datestamp=" + (new Date).valueOf(),
            data: {
                pageTitle: '任务管理'
            },
            resolve: {
                deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                    return $ocLazyLoad.load("js/code/jobManage.js");
                }],
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                            files: ['js/plugins/footable/pagefile.js', 'css/backInfo_department.css' + "?datestamp=" + (new Date).valueOf()]
                        },
                        {
                            name: 'ui.sortable',
                            files: ['js/plugins/ui-sortable/sortable.js']
                        }
                    ]);
                }
            }
        })
        // 代码管理---代码变动对比
        .state('code.codeRun', {
            params: {
                proName: null,
                proId: null
            },
            url: "/codeRun",
            templateUrl: "views/code/codeRun.html" + "?datestamp=" + (new Date).valueOf(),
            data: {
                pageTitle: '代码变动对比'
            },
            resolve: {
                deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                    return $ocLazyLoad.load("js/code/codeRun.js");
                }],
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                            files: ['js/plugins/footable/pagefile.js', 'css/backInfo_department.css' + "?datestamp=" + (new Date).valueOf()]
                        },
                        {
                            name: 'ui.sortable',
                            files: ['js/plugins/ui-sortable/sortable.js']
                        }
                    ]);
                }
            }
        })
        // 代码管理---commit历史对比
        .state('code.label', {
            params: {
                proName: null,
                proId: null
            },
            url: "/label",
            templateUrl: "views/code/label.html" + "?datestamp=" + (new Date).valueOf(),
            data: {
                pageTitle: 'commit历史对比'
            },
            resolve: {
                deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                    return $ocLazyLoad.load("js/code/label.js");
                }],
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                            files: ['js/plugins/footable/pagefile.js', 'css/backInfo_department.css' + "?datestamp=" + (new Date).valueOf()]
                        },
                        {
                            name: 'ui.sortable',
                            files: ['js/plugins/ui-sortable/sortable.js']
                        }
                    ]);
                }
            }
        })

        // 前台页面
        .state('interface', {
            abstract: true,
            url: "/interface",
            templateUrl: "views/frontCommon/content.html" + "?datestamp=" + (new Date).valueOf()
        })
        // 接口自动化支持中心
        .state('interface.center', {
            url: "/board",
            templateUrl: "views/frontPage/interfaceCenter.html" + "?datestamp=" + (new Date).valueOf(),
            data: {
                pageTitle: '国美金融Magic系统'
            },
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                            files: ['js/plugins/footable/footable.all.min.js', 'css/plugins/footable/footable.core.css', 'css/interfaceCenter.css' + "?datestamp=" + (new Date).valueOf()]
                        },
                        {
                            name: 'ui.footable',
                            files: ['js/plugins/footable/angular-footable.js']
                        }
                    ]);
                }
            }
        })
        // 接口自动化支持中心-概述
        .state('interface.board', {
            params: {
                proName: null,
                proId: null
            },
            url: "/boardInfo",
            templateUrl: "views/frontPage/interface_board.html" + "?datestamp=" + (new Date).valueOf(),
            data: {
                pageTitle: '国美金融Magic系统'
            },
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                            files: ['js/plugins/footable/footable.all.min.js', 'css/plugins/footable/footable.core.css']
                        },
                        {
                            name: 'ui.footable',
                            files: ['js/plugins/footable/angular-footable.js']
                        }
                    ]);
                }
            }
        })
        // 消费金融-环境详情
        .state('interface.invDetail', {
            params: {
                sys_id: null,
                env_id: null
            },
            url: "/invDetail",
            templateUrl: "views/frontPage/invDetail.html" + "?datestamp=" + (new Date).valueOf(),
            data: {
                pageTitle: '环境详情'
            },
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        files: ['js/plugins/footable/pagefile.js']
                    }]);
                }
            }
        })
        // 产品详情
        .state('interface.productDetail', {
            params: {
                proName: null,
                proId: null
            },
            url: "/productDetail",
            templateUrl: "views/frontPage/productDetail.html" + "?datestamp=" + (new Date).valueOf(),
            data: {
                pageTitle: '项目详情'
            },
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                            serie: true,
                            name: 'angular-flot',
                            files: ['js/plugins/flot/jquery.flot.js', 'js/plugins/flot/jquery.flot.time.js',
                                'js/plugins/flot/jquery.flot.tooltip.min.js', 'js/plugins/flot/jquery.flot.spline.js',
                                'js/plugins/flot/jquery.flot.resize.js', 'js/plugins/flot/jquery.flot.pie.js',
                                'js/plugins/flot/curvedLines.js', 'js/plugins/flot/angular-flot.js'
                            ]
                        },
                        {
                            name: 'angles',
                            files: ['js/plugins/chartJs/angles.js', 'js/plugins/chartJs/Chart.min.js']
                        },
                        {
                            name: 'angular-peity',
                            files: ['js/plugins/peity/jquery.peity.min.js', 'js/plugins/peity/angular-peity.js']
                        },
                        {
                            files: ['css/productDetail.css' + "?datestamp=" + (new Date).valueOf()]
                        }
                    ]);
                }
            }
        })
        // 用户管理
        .state('backUser', {
            abstract: true,
            url: "/backUser",
            templateUrl: "views/backCommon/content.html" + "?datestamp=" + (new Date).valueOf()
        })
        /* 0304==zxh==登录页放在前台，可跳回页面，更改路由
         用户管理 --登录
         */
        .state('interface.login', {
            params: {
                proName: null,
                proId: null
            },
            url: "/login",
            //templateUrl: "views/userManage/backUser_login.html"+"?datestamp=" + (new Date).valueOf(),
            templateUrl: "views/frontPage/login.html" + "?datestamp=" + (new Date).valueOf(),
            data: {
                pageTitle: '登录'
            },
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        files: ['js/plugins/footable/footable.all.min.js', 'css/plugins/footable/footable.core.css', 'css/backUser_login.css']
                    }]);
                }
            }
        })
        // 用户管理 -- 用户
        .state('backUser.user', {
            params: {
                proName: null,
                proId: null
            },
            url: "/user",
            templateUrl: "views/userManage/backUser_user.html" + "?datestamp=" + (new Date).valueOf(),
            data: {
                pageTitle: '用户'
            },
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                            files: ['js/plugins/footable/footable.all.min.js', 'css/plugins/footable/footable.core.css', 'css/backUser_login.css']
                        },
                        {
                            name: 'ui.footable',
                            files: ['js/plugins/footable/angular-footable.js']
                        }
                    ]);
                }
            }
        })
        // 用户管理---用户组
        .state('backUser.usergroup', {
            permission: 1 === 2,
            params: {
                proName: null,
                proId: null
            },
            url: "/usergroup",
            templateUrl: "views/userManage/backUser_usergroup.html" + "?datestamp=" + (new Date).valueOf(),
            data: {
                pageTitle: '用户组'
            },
            resolve: {
                deps: ["$ocLazyLoad", function ($ocLazyLoad) {
                    return $ocLazyLoad.load("js/userManage/userGroup.js");
                }],
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        files: ['js/plugins/footable/pagefile.js', 'css/backInfo_department.css' + "?datestamp=" + (new Date).valueOf()]
                    }]);
                }
            }
        })
        // 代码自动化
        .state('abilityAutomation', {
            abstract: true,
            url: "/abilityAutomation",
            templateUrl: "views/frontCommon/content.html" + "?datestamp=" + (new Date).valueOf()
        })
        // 代码自动 概述
        .state('abilityAutomation.board', {
            url: "/board",
            templateUrl: "views/frontPage/abilityautomation_board.html" + "?datestamp=" + (new Date).valueOf(),
            data: {
                pageTitle: '国美金融Magic系统'
            },
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                            files: ['js/plugins/footable/footable.all.min.js', 'css/plugins/footable/footable.core.css']
                        },
                        {
                            name: 'ui.footable',
                            files: ['js/plugins/footable/angular-footable.js']
                        }
                    ]);
                }
            }
        })
        // 统一部署中心中心
        .state('unify', {
            abstract: true,
            url: "/unify",
            templateUrl: "views/frontCommon/content.html" + "?datestamp=" + (new Date).valueOf()
        })
        .state('unify.board', {
            params: {
                proName: null,
                proId: null
            },
            url: "/board",
            templateUrl: "views/frontPage/interfaceSetCenter.html" + "?datestamp=" + (new Date).valueOf(),
            data: {
                pageTitle: '统一部署中心'
            },
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                            files: ['js/plugins/footable/footable.all.min.js', 'css/plugins/footable/footable.core.css']
                        },
                        {
                            name: 'ui.footable',
                            files: ['js/plugins/footable/angular-footable.js']
                        }
                    ]);
                }
            }
        })


        // 0428==ASC业务自动化新需求==zxh
        // ASC业务自动化支持中心
        .state('business', {
            abstract: true,
            url: "/business",
            templateUrl: "views/frontCommon/content.html"
        })
        .state('business.board', {
            params: {
                proName: null,
                proId: null
            },
            url: "/board",
            templateUrl: "views/business/business-board.html" + "?datestamp=" + (new Date).valueOf(),
            data: {
                pageTitle: 'ASC业务支持中心'
            },
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                            files: ['js/plugins/footable/footable.all.min.js', 'css/plugins/footable/footable.core.css', 'css/interfaceCenter.css']
                        },
                        {
                            name: 'ui.footable',
                            files: ['js/plugins/footable/angular-footable.js']
                        }
                    ]);
                }
            }
        })
        // 历史详情
        .state('business.invDetail', {
            params: {
                system: null,
                env: null
            },
            url: "/invDetail",
            templateUrl: "views/business/business_detail.html" + "?datestamp=" + (new Date).valueOf(),
            data: {
                pageTitle: '环境详情'
            },
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        files: ['js/plugins/footable/pagefile.js']
                    }]);
                }
            }
        })
        // ASC业务自动化支持中心===产品详情
        .state('business.productDetail', {
            params: {
                proName: null,
                proId: null
            },
            url: "/productDetail",
            templateUrl: "views/business/business_product.html" + "?datestamp=" + (new Date).valueOf(),
            data: {
                pageTitle: '项目详情'
            },
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                            serie: true,
                            name: 'angular-flot',
                            files: ['js/plugins/flot/jquery.flot.js', 'js/plugins/flot/jquery.flot.time.js',
                                'js/plugins/flot/jquery.flot.tooltip.min.js', 'js/plugins/flot/jquery.flot.spline.js',
                                'js/plugins/flot/jquery.flot.resize.js', 'js/plugins/flot/jquery.flot.pie.js',
                                'js/plugins/flot/curvedLines.js', 'js/plugins/flot/angular-flot.js'
                            ]
                        },
                        {
                            name: 'angles',
                            files: ['js/plugins/chartJs/angles.js', 'js/plugins/chartJs/Chart.min.js']
                        },
                        {
                            name: 'angular-peity',
                            files: ['js/plugins/peity/jquery.peity.min.js', 'js/plugins/peity/angular-peity.js']
                        },
                        {
                            files: ['css/productDetail.css' + "?datestamp=" + (new Date).valueOf()]
                        }
                    ]);
                }
            }

        })
}
