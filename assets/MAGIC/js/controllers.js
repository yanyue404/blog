/**
 * MainCtrl - controller
 * Contains several global data used in different view
 */
function MainCtrl($http,$rootScope,$timeout, $state, interface_url) {

    // $rootScope.interface_url = 'http://10.143.117.38:85';


    // 验证名称不能为中文
    $rootScope.checkChina = function (val) {
        if(val){
            var chinaReg= /^\w+$/;
            if (chinaReg.test(val)) {
            }else {
                $rootScope.showToast('名称限字母、数字和下划线');
            }
        }
    };
    $rootScope.checkName = function (val) {
        var nameReg= /^[^\u4E00-\u9FA5]+$/;
        if (nameReg.test(val)) {
        }else {
            $rootScope.showToast('名称不能为空且不能为中文');
        }
    };
    // 验证密码
    $rootScope.checkPwd = function (val) {
        // var pwdReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
        var pwdReg = /^[\w@+]{6,20}$/;
        if (pwdReg.test(val)) {

        }else {
            $rootScope.showToast('密码必须为6-20位字母和数字混合，请检查');
        }
    };
    // 验证邮箱
    $rootScope.checkEmail = function (val) {
        var emailReg  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (emailReg.test(val)) {

        }else {
            $rootScope.showToast('请输入正确邮箱');
        }
    };
    // 验证手机号
    $rootScope.checkPhone = function (val) {
        var phoneReg  = /^(1)[0-9]{10}$/;
        if (phoneReg.test(val)) {

        }else {
            $rootScope.showToast('请输入正确手机号');
        }
    };
    // 验证不能为空
    $rootScope.checkNull = function (val,tip) {
        if (!val) {
            $rootScope.showToast(tip + '不能为空');
        }
    };


    // 弹框
    $rootScope.showToast = function(val) {
        $rootScope.toastState = true;
        $rootScope.toastCon = val;
        $timeout(function () {
            $rootScope.toastState = false;
        }, 2000);
    };
    //接口失效，自动退出登录页面调用方法
    $rootScope.showLogin = function () {
        sessionStorage.clear();
        localStorage.clear();
        $rootScope.role = null;
        $(".modal-backdrop").hide();
        $state.go('login');
    };

    //角色列表
    $rootScope.roles = ['0', '1', '2', '3', '4', '5', '6', '7'];
    //角色对照表
    $rootScope.role_dict_name = {
        '0':'无权限',
        '1':'超级管理员',
        '2':'普通管理员',
        '3':'部门管理员',
        '4':'产品管理员',
        '5':'系统管理员',
        '6':'测试员',
        '7':'开发'
    };
    $rootScope.developer =  '7';
    $rootScope.tester = '6';
    $rootScope.super_admin = '1';
    $rootScope.admin_list = ['1', '2', '3'];
    $rootScope.system_manage_role = ['1', '2'];
    $rootScope.no_role = '0';
    $rootScope.no_develop_list = ['1', '2', '3', '4', '5', '6'];
    $rootScope.include_develop_list = ['1', '2', '3', '4', '5', '6', '7'];
    this.countries = [
        {name: 'Amsterdam'},
        {name: 'Washington'},
        {name: 'Sydney'},
        {name: 'Cairo'},
        {name: 'Beijing'}
    ];
    this.getLocation = function (val) {
        return $http.get('//maps.googleapis.com/maps/api/geocode/json', {
            params: {
                address: val,
                sensor: false
            }
        }).then(function (response) {
            return response.data.results.map(function (item) {
                return item.formatted_address;
            });
        });
    };
    $rootScope.getRole = function () {
        if (localStorage.getItem('auth_token') === null || localStorage.getItem('auth_token') === undefined){
            $state.go('login');
        }else if ($rootScope.role === null || $rootScope.role === undefined){
            $http({
                'method': 'GET',
                'url': interface_url + '/auth/getUser/',
                'headers': {
                    'Authorization': 'Token ' + localStorage.getItem('auth_token')
                }
            }).success(function (data) {
                if (data.code === 200 || data.code === '200'){
                    $rootScope.role = data.result;
                }else {
                    $rootScope.showToast(data.message);
                    $state.go('login');
                }
            }).error(function (data) {
                $rootScope.showToast(data);
                $state.go('login');
            });
        }
    };
     $rootScope.getRole();
    /**
     * daterange - Used as initial model for data range picker in Advanced form view
     */
    this.daterange = {startDate: null, endDate: null};

    /**
     * slideInterval - Interval for bootstrap Carousel, in milliseconds:
     */
    this.slideInterval = 5000;

    /**
     * tags - Used as advanced forms view in input tag control
     */

    this.tags = [
        {text: 'Amsterdam'},
        {text: 'Washington'},
        {text: 'Sydney'},
        {text: 'Cairo'},
        {text: 'Beijing'}
    ];

    /**
     * states - Data used in Advanced Form view for Chosen plugin
     */
    this.states = [];

    /**
     * check's - Few variables for checkbox input used in iCheck plugin. Only for demo purpose
     */
    this.checkOne = true;
    this.checkTwo = true;
    this.checkThree = true;
    this.checkFour = true;

    /**
     * knobs - Few variables for knob plugin used in Advanced Plugins view
     */
    this.knobOne = 75;
    this.knobTwo = 25;
    this.knobThree = 50;

    /**
     * Variables used for Ui Elements view
     */
    this.bigTotalItems = 175;
    this.bigCurrentPage = 1;
    this.maxSize = 5;
    this.singleModel = false;
    this.radioModel = 'Middle';
    this.checkModel = {
        left: false,
        middle: true,
        right: false
    };

    /**
     * groups - used for Collapse panels in Tabs and Panels view
     */
    this.groups = [{
        title: 'Dynamic Group Header - 1',
        content: 'Dynamic Group Body - 1'
    },
        {
            title: 'Dynamic Group Header - 2',
            content: 'Dynamic Group Body - 2'
        }
    ];

    /**
     * alerts - used for dynamic alerts in Notifications and Tooltips view
     */
    this.alerts = [
        {type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.'},
        {type: 'success', msg: 'Well done! You successfully read this important alert message.'},
        {type: 'info', msg: 'OK, You are done a great job man.'}
    ];

    /**
     * addAlert, closeAlert  - used to manage alerts in Notifications and Tooltips view
     */
    this.addAlert = function () {
        this.alerts.push({msg: 'Another alert!'});
    };

    this.closeAlert = function (index) {
        this.alerts.splice(index, 1);
    };

    /**
     * randomStacked - used for progress bar (stacked type) in Badges adn Labels view
     */
    this.randomStacked = function () {
        this.stacked = [];
        var types = ['success', 'info', 'warning', 'danger'];

        for (var i = 0, n = Math.floor((Math.random() * 4) + 1); i < n; i++) {
            var index = Math.floor((Math.random() * 4));
            this.stacked.push({
                value: Math.floor((Math.random() * 30) + 1),
                type: types[index]
            });
        }
    };
    /**
     * initial run for random stacked value
     */
    this.randomStacked();

    /**
     * summernoteText - used for Summernote plugin
     */
    this.summernoteText = ['<h3>Hello Jonathan! </h3>',
        '<p>dummy text of the printing and typesetting industry. <strong>Lorem Ipsum has been the dustrys</strong> standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more',
        'recently with</p>'
    ].join('');

    /**
     * General variables for Peity Charts
     * used in many view so this is in Main controller
     */
    this.BarChart = {
        data: [5, 3, 9, 6, 5, 9, 7, 3, 5, 2, 4, 7, 3, 2, 7, 9, 6, 4, 5, 7, 3, 2, 1, 0, 9, 5, 6, 8, 3, 2, 1],
        options: {
            fill: ["#1ab394", "#d7d7d7"],
            width: 100
        }
    };

    this.BarChart2 = {
        data: [5, 3, 9, 6, 5, 9, 7, 3, 5, 2],
        options: {
            fill: ["#1ab394", "#d7d7d7"]
        }
    };

    this.BarChart3 = {
        data: [5, 3, 2, -1, -3, -2, 2, 3, 5, 2],
        options: {
            fill: ["#1ab394", "#d7d7d7"]
        }
    };

    this.LineChart = {
        data: [5, 9, 7, 3, 5, 2, 5, 3, 9, 6, 5, 9, 4, 7, 3, 2, 9, 8, 7, 4, 5, 1, 2, 9, 5, 4, 7],
        options: {
            fill: '#1ab394',
            stroke: '#169c81',
            width: 64
        }
    };

    this.LineChart2 = {
        data: [3, 2, 9, 8, 47, 4, 5, 1, 2, 9, 5, 4, 7],
        options: {
            fill: '#1ab394',
            stroke: '#169c81',
            width: 64
        }
    };

    this.LineChart3 = {
        data: [5, 3, 2, -1, -3, -2, 2, 3, 5, 2],
        options: {
            fill: '#1ab394',
            stroke: '#169c81',
            width: 64
        }
    };

    this.LineChart4 = {
        data: [5, 3, 9, 6, 5, 9, 7, 3, 5, 2],
        options: {
            fill: '#1ab394',
            stroke: '#169c81',
            width: 64
        }
    };

    this.PieChart = {
        data: [1, 5],
        options: {
            fill: ["#1ab394", "#d7d7d7"]
        }
    };

    this.PieChart2 = {
        data: [226, 360],
        options: {
            fill: ["#1ab394", "#d7d7d7"]
        }
    };
    this.PieChart3 = {
        data: [0.52, 1.561],
        options: {
            fill: ["#1ab394", "#d7d7d7"]
        }
    };
    this.PieChart4 = {
        data: [1, 4],
        options: {
            fill: ["#1ab394", "#d7d7d7"]
        }
    };
    this.PieChart5 = {
        data: [226, 134],
        options: {
            fill: ["#1ab394", "#d7d7d7"]
        }
    };
    this.PieChart6 = {
        data: [0.52, 1.041],
        options: {
            fill: ["#1ab394", "#d7d7d7"]
        }
    };
};
function caseFlot() {

    var data = [
        [8, 0],
        [16.55, 0],
        [21, 0]
    ];

    var options = {
        series: {
            lines: {
                show: false,
                fill: true
            },
            splines: {
                show: true,
                tension: 0.4,
                lineWidth: 1,
                fill: 0.4
            },
            points: {
                radius: 0,
                show: true
            },
            shadowSize: 2,
            grow: {stepMode: "linear", stepDirection: "up", steps: 80}
        },
        grow: {stepMode: "linear", stepDirection: "up", steps: 80},
        grid: {
            hoverable: true,
            clickable: true,
            tickColor: "#d5d5d5",
            borderWidth: 1,
            color: '#d5d5d5'
        },
        colors: ["#1ab394", "#1C84C6"],
        xaxis: {},
        yaxis: {
            min: 0,
            max: 100,
            ticks: 4,
            tickFormatter: function (val, axis) {
                return val + '%';
            }
        },
        tooltip: false
    };

    /**
     * Definition of variables
     * Flot chart
     */
    this.flotData = [data];
    this.flotOptions = options;
}
function chartJsCtrl() {
    /**
     * Data for Polar chart
     */
    this.polarData = [{
        value: 300,
        color: "#a3e1d4",
        highlight: "#1ab394",
        label: "App"
    },
        {
            value: 140,
            color: "#dedede",
            highlight: "#1ab394",
            label: "Software"
        },
        {
            value: 200,
            color: "#A4CEE8",
            highlight: "#1ab394",
            label: "Laptop"
        }
    ];

    /**
     * Options for Polar chart
     */
    this.polarOptions = {
        scaleShowLabelBackdrop: true,
        scaleBackdropColor: "rgba(255,255,255,0.75)",
        scaleBeginAtZero: true,
        scaleBackdropPaddingY: 1,
        scaleBackdropPaddingX: 1,
        scaleShowLine: true,
        segmentShowStroke: true,
        segmentStrokeColor: "#fff",
        segmentStrokeWidth: 2,
        animationSteps: 100,
        animationEasing: "easeOutBounce",
        animateRotate: true,
        animateScale: false
    };

    /**
     * Data for Doughnut chart
     */
    this.doughnutData = [{
        value: 300,
        color: "#a3e1d4",
        highlight: "#1ab394",
        label: "App"
    },
        {
            value: 50,
            color: "#dedede",
            highlight: "#1ab394",
            label: "Software"
        },
        {
            value: 100,
            color: "#A4CEE8",
            highlight: "#1ab394",
            label: "Laptop"
        }
    ];

    /**
     * Options for Doughnut chart
     */
    this.doughnutOptions = {
        segmentShowStroke: true,
        segmentStrokeColor: "#fff",
        segmentStrokeWidth: 2,
        percentageInnerCutout: 45, // This is 0 for Pie charts
        animationSteps: 100,
        animationEasing: "easeOutBounce",
        animateRotate: true,
        animateScale: false,
    };


    /**
     * Data for Line chart
     */
    this.lineData = {
        // labels: ["January", "February", "March", "April", "May", "June", "July"],
        labels: ["9:00", "11:00", "11:30", "15:00", "17:00"],
        // "19:00", "21:00", "23:00"],
        datasets: [
            // {
            //     label: "Example dataset",
            //     fillColor: "rgba(220,220,220,0.5)",
            //     strokeColor: "rgba(220,220,220,1)",
            //     pointColor: "rgba(220,220,220,1)",
            //     pointStrokeColor: "#fff",
            //     pointHighlightFill: "#fff",
            //     pointHighlightStroke: "rgba(220,220,220,1)",
            //     data: [65, 59, 80, 81, 56, 55, 40]
            // },
            {
                label: "Example dataset",
                fillColor: "rgba(26,179,148,0.5)",
                strokeColor: "rgba(26,179,148,0.7)",
                pointColor: "rgba(26,179,148,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(26,179,148,1)",
                data: [90, 45, 89, 60, 94],
                // 27, 90, 22]
                // data:[0, 0, 0, 0]
            }
        ]
    };

    this.lineDataDashboard4 = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [{
            label: "Example dataset",
            fillColor: "rgba(220,220,220,0.5)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: [65, 59, 40, 51, 36, 25, 40]
        },
            {
                label: "Example dataset",
                fillColor: "rgba(26,179,148,0.5)",
                strokeColor: "rgba(26,179,148,0.7)",
                pointColor: "rgba(26,179,148,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(26,179,148,1)",
                data: [48, 48, 60, 39, 56, 37, 30]
            }
        ]
    };

    this.testData = [{
        value: 300,
        color: "#1ab394",
        highlight: "#01814A",
        label: "pass"
    },
        {
            value: 50,
            color: "#FFA500",
            highlight: "#8B5A00",
            label: "fail"
        },
        {
            value: 10,
            color: "#FF5809",
            highlight: "#842B00",
            label: "error"
        }
    ];
    /**
     * Options for Line chart
     */
    this.lineOptions = {
        scaleOverride: true,
        scaleSteps: 6,
        scaleStepWidth: 20,
        scaleStartValue: 0,
        scaleShowGridLines: true,
        scaleGridLineColor: "rgba(0,0,0,.05)",
        scaleGridLineWidth: 1,
        scaleLabel: "<%=value%>%",
        bezierCurve: true,
        bezierCurveTension: 0.12,
        pointDot: true,
        pointDotRadius: 3,
        pointDotStrokeWidth: 1,
        pointHitDetectionRadius: 20,
        datasetStroke: true,
        datasetStrokeWidth: 2,
        datasetFill: true,
        animation: true,
        // 动画的时间
        animationSteps: 150,
        // 动画的特效
        animationEasing: "easeOutQuart",
    };

    /**
     * Options for Bar chart
     */
    this.barOptions = {
        scaleBeginAtZero: true,
        scaleShowGridLines: true,
        scaleGridLineColor: "rgba(0,0,0,.05)",
        scaleGridLineWidth: 1,
        barShowStroke: true,
        barStrokeWidth: 2,
        barValueSpacing: 5,
        barDatasetSpacing: 1
    };

    /**
     * Data for Bar chart
     */
    this.barData = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [{
            label: "My First dataset",
            fillColor: "rgba(220,220,220,0.5)",
            strokeColor: "rgba(220,220,220,0.8)",
            highlightFill: "rgba(220,220,220,0.75)",
            highlightStroke: "rgba(220,220,220,1)",
            data: [65, 59, 80, 81, 56, 55, 40]
        },
            {
                label: "My Second dataset",
                fillColor: "rgba(26,179,148,0.5)",
                strokeColor: "rgba(26,179,148,0.8)",
                highlightFill: "rgba(26,179,148,0.75)",
                highlightStroke: "rgba(26,179,148,1)",
                data: [28, 48, 40, 19, 86, 27, 90]
            }
        ]
    };

    /**
     * Data for Radar chart
     */
    this.radarData = {
        labels: ["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"],
        datasets: [{
            label: "My First dataset",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: [65, 59, 90, 81, 56, 55, 40]
        },
            {
                label: "My Second dataset",
                fillColor: "rgba(26,179,148,0.2)",
                strokeColor: "rgba(26,179,148,1)",
                pointColor: "rgba(26,179,148,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: [28, 48, 40, 19, 96, 27, 100]
            }
        ]
    };

    /**
     * Options for Radar chart
     */
    this.radarOptions = {
        scaleShowLine: true,
        angleShowLineOut: true,
        scaleShowLabels: false,
        scaleBeginAtZero: true,
        angleLineColor: "rgba(0,0,0,.1)",
        angleLineWidth: 1,
        pointLabelFontFamily: "'Arial'",
        pointLabelFontStyle: "normal",
        pointLabelFontSize: 10,
        pointLabelFontColor: "#666",
        pointDot: false,
        pointDotRadius: 3,
        pointDotStrokeWidth: 1,
        pointHitDetectionRadius: 20,
        datasetStroke: true,
        datasetStrokeWidth: 2,
        datasetFill: true
    };


}
/**
 *
 * Pass all functions into module
 */
angular
    .module('inspinia')
    .controller('MainCtrl', MainCtrl)
    .controller('caseFlot', caseFlot)
    .controller('chartJsCtrl', chartJsCtrl);


