// 引用所有需要的类
require('MHElecManager,NSTimer,NSArray,NSString,UISegmentedControl,MHColorUtils,UILabel,UIFont,MHPowerCostView');

// 常量定义
var MHPowerCostMode_Hour = 1;
var MHPowerCostMode_Day = 2;
var MHPowerCostMode_Week = 3;
var MHPowerCostMode_Month = 4;
var NSTextAlignmentCenter = 1;

// 定义一个页面
definePage('MHDemoPowerCostViewController<UIScrollViewDelegate>', {
    // 定义属性
    setElecManager: function(elecManager) {
      self.setProp_forKey(elecManager, "elecManager");
    },
    elecManager: function() {
      return self.getProp("elecManager");
    },

    setCurPowerCostShowMode: function(mode) {
      self.setProp_forKey(mode, "curPowerCostShowMode");
    },
    curPowerCostShowMode: function() {
      return self.getProp("curPowerCostShowMode");
    },

    setShowModeSwitchView: function(view) {
      self.setProp_forKey(view, "showModeSwitchView");
    },
    showModeSwitchView: function() {
      return self.getProp("showModeSwitchView");
    },

    setLabelDegree: function(view) {
      self.setProp_forKey(view, "labelDegree");
    },
    labelDegree: function() {
      return self.getProp("labelDegree");
    },

    setLabelDegreeValue: function(view) {
      self.setProp_forKey(view, "labelDegreeValue");
    },
    labelDegreeValue: function() {
      return self.getProp("labelDegreeValue");
    },

    setLabelPower: function(view) {
      self.setProp_forKey(view, "labelPower");
    },
    labelPower: function() {
      return self.getProp("labelPower");
    },

    setLabelPowerValue: function(view) {
      self.setProp_forKey(view, "labelPowerValue");
    },
    labelPowerValue: function() {
      return self.getProp("labelPowerValue");
    },

    setPowerCostView: function(view) {
      self.setProp_forKey(view, "powerCostView");
    },
    powerCostView: function() {
      return self.getProp("powerCostView");
    },

    setLabelTips: function(view) {
      self.setProp_forKey(view, "labelTips");
    },
    labelTips: function() {
      return self.getProp("labelTips");
    },

    setTimer: function(timer) {
      self.setProp_forKey(timer, "timer");
    },
    timer: function() {
      return self.getProp("timer");
    },

    init: function() {
        if (self = self.super().init()) {
            var em = MHElecManager.sharedManagerOfDevice(gDevice());
            em.setMulti(0.01);
            self.setElecManager(MHElecManager.sharedManagerOfDevice(gDevice()));
            self.setCurPowerCostShowMode(MHPowerCostMode_Hour);
        }
        return self;
    },
    viewDidLoad: function() {
        self.super().viewDidLoad();

        self.setTitle("电量统计");
        self.setIsTabBarHidden(YES);

	var weakself = __weak(self);

        //读取本地缓存
        self.elecManager().loadCacheDataWithSuccess_failure(block('id', function(obj) {
            weakself.powerCostView().updatePowerCostData_mode_isLoadNext(weakself.elecManager().getDataListOfMode(MHPowerCostMode_Hour), MHPowerCostMode_Hour, NO);
        }), block('NSError *', function(obj) {
            _OC_log("load cache fail", obj);
        }));

        //后台拉取
        self.elecManager().refreshOfMode_success_failure(self.curPowerCostShowMode(),block('id', function(obj) {
            weakself.powerCostView().updatePowerCostData_mode_isLoadNext(weakself.elecManager().getDataListOfMode(MHPowerCostMode_Hour), MHPowerCostMode_Hour, NO);
        }), block('NSError *', function(obj) {
            _OC_log("load net fail", obj);
        }));

        for (var mode = MHPowerCostMode_Hour; mode <= MHPowerCostMode_Month; mode++) {
            if (mode != self.curPowerCostShowMode()) {
                self.elecManager().refreshOfMode_success_failure(mode, null, null);
            }
        }

        var payload = {
            "method": "get_rt_power",
            "params": [1],
            "did": gDevice().did()
        };

        // 向插排发一个RPC指令让插排开始更新实时功率值
        gDevice().sendPayload_success_failure(payload, block('id', function(json) {
           _OC_log("json:", json);
        }), block('NSError*', function(error) {

        }));

        var timer = NSTimer.scheduledTimerWithTimeInterval_target_selector_userInfo_repeats(3, self, "getPower:", null, YES);
        self.setTimer(timer);
        self.getPower(null);
    },

    // 3s一次获取实时功率值
    getPower: function(timer) {
        var payload = {
            "method": "get_prop",
            "params": ["power_consume_rate"],
            "did": gDevice().did()
        };
        var slf = self;
        gDevice().sendPayload_success_failure(payload, block('id', function(json) {
            var res = json.objectForKey("result");
            if (res && res.isKindOfClass(NSArray.class()) && res.count() > 0) {
                var power = res.objectAtIndex(0);
                slf.labelPowerValue().setText(""+power);
            }
        }), block('NSError*', function(error) {

        }));
    },

    onBack: function(sender) {
        self.super().onBack(sender);
        self.timer().invalidate();
        self.setTimer(null);
    },

    viewWillDisappear: function(animated) {
        self.super().viewWillDisappear(animated);
        self.elecManager().saveCacheData();
    },

    applicationDidEnterBackground: function() {
        self.super().applicationDidEnterBackground();
        self.elecManager().saveCacheData();
        self.timer().invalidate();
        self.setTimer(null);
    },

    applicationWillEnterForeground: function() {
        self.setTimer(NSTimer.scheduledTimerWithTimeInterval_target_selector_userInfo_repeats(3, self, "getPower:", null, YES));
    },

    // 构建界面
    buildSubviews: function() {
        var weakself = __weak(self);
        //显示模式切换区域
        var showModeSwitchView = UISegmentedControl.alloc().initWithItems(["时", "天", "周"]);
        self.view().addSubview(showModeSwitchView);
        showModeSwitchView.setFrame(CGRectMake(75, 64 + 31, self.view().bounds().width - 150, 40));
        showModeSwitchView.addTarget_action_forControlEvents(self, "onValueChanged:", 1<<12);
        showModeSwitchView.setTintColor(MHColorUtils.colorWithRGB(0x989898));

        self.setShowModeSwitchView(showModeSwitchView);

        //顶部显示区域
        var labelDegree = UILabel.alloc().init();
        labelDegree.setFont(UIFont.systemFontOfSize(12));
        labelDegree.setTextAlignment(NSTextAlignmentCenter);
        labelDegree.setTextColor(MHColorUtils.colorWithRGB(0x606060));
        labelDegree.setText("耗电量 kwh");
        self.view().addSubview(labelDegree);
        labelDegree.setFrame(CGRectMake(0, CGRectGetMaxY(showModeSwitchView.frame()) + 20, self.view().bounds().width, 15));

        self.setLabelDegree(labelDegree);

        var labelDegreeValue = UILabel.alloc().init();
        labelDegreeValue.setFont(UIFont.fontWithName_size("DINOffc-CondMedi", 42.0));
        labelDegreeValue.setTextColor(MHColorUtils.colorWithRGB(0x606060));
        labelDegreeValue.setTextAlignment(NSTextAlignmentCenter);
        labelDegreeValue.setText("0.00");
        self.view().addSubview(labelDegreeValue);
        labelDegreeValue.setFrame(CGRectMake(0, CGRectGetMaxY(labelDegree.frame()), self.view().bounds().width, 60));

        self.setLabelDegreeValue(labelDegreeValue);

        // 瞬时功率
        var labelPower = UILabel.alloc().init();
        labelPower.setFont(UIFont.systemFontOfSize(12));
        labelPower.setTextAlignment(NSTextAlignmentCenter);
        labelPower.setTextColor(MHColorUtils.colorWithRGB(0x606060));
        labelPower.setText("当前功率 w");
        self.view().addSubview(labelPower);
        labelPower.setFrame(CGRectMake(-100, CGRectGetMaxY(showModeSwitchView.frame()) + 20, self.view().bounds().width, 15));

        self.setLabelPower(labelPower);

        var labelPowerValue = UILabel.alloc().init();
        labelPowerValue.setFont(UIFont.fontWithName_size("DINOffc-CondMedi", 42.0));
        labelPowerValue.setTextColor(MHColorUtils.colorWithRGB(0x606060));
        labelPowerValue.setTextAlignment(NSTextAlignmentCenter);
        labelPowerValue.setText("0");
        self.view().addSubview(labelPowerValue);
        labelPowerValue.setFrame(CGRectMake(-100, CGRectGetMaxY(labelPower.frame()), self.view().bounds().width, 60));

        self.setLabelPowerValue(labelPowerValue);


        //中间图表显示
        var powerCostView = MHPowerCostView.alloc().initWithFrame_elecManager(CGRectMake(0, CGRectGetMaxY(labelDegreeValue.frame()) + 20, self.view().bounds().width, self.view().bounds().height - (CGRectGetMaxY(labelDegreeValue.frame()) + 20) - 100), self.elecManager());
        powerCostView.setOnSelectPillar(block('NSArray *', function(pca) {
            var powerCost = pca.objectAtIndex(0);
            weakself.labelDegreeValue().setText(""+powerCost.toFixed(2));
        }));
        powerCostView.setOnStartGetMore(block(function() {
            weakself.startGetMore();
        }));
        self.view().addSubview(powerCostView);

        self.setPowerCostView(powerCostView);
        _OC_log("powerCost:", self.powerCostView());

        var labelTips = UILabel.alloc().init();
        labelTips.setFont(UIFont.systemFontOfSize(12));
        labelTips.setTextColor(MHColorUtils.colorWithRGB_alpha(0x606060, 0.5));
        labelTips.setNumberOfLines(0);
        labelTips.setTextAlignment(NSTextAlignmentCenter);
        labelTips.setText("用电量可能因统计存在误差，仅供用户参考");
        labelTips.setFrame(CGRectMake(0, self.view().bounds().height - 68, self.view().bounds().width, 68));
        self.view().addSubview(labelTips);

        self.setLabelTips(labelTips);

        self.updateSwitchBtnStatus();
    },

    // 更新实时功率值
    updateCurrentPowerStatus: function() {
        if (self.curPowerCostShowMode() == MHPowerCostMode_Hour) {
            var frame = self.labelDegree().frame();
            frame.x = 100;
            self.labelDegree().setFrame(frame);
            frame = self.labelDegreeValue().frame();
            frame.x = 100;
            self.labelDegreeValue().setFrame(frame);
            self.labelPower().setHidden(NO);
            self.labelPowerValue().setHidden(NO);
        } else {
            var frame = self.labelDegree().frame();
            frame.x = 0;
            self.labelDegree().setFrame(frame);
            frame = self.labelDegreeValue().frame();
            frame.x = 0;
            self.labelDegreeValue().setFrame(frame);
            self.labelPower().setHidden(YES);
            self.labelPowerValue().setHidden(YES);
        }
    },

    // 更新segment control
    updateSwitchBtnStatus: function() {
        var curPowerCostShowMode = self.curPowerCostShowMode();
        if (curPowerCostShowMode == MHPowerCostMode_Hour) {
            self.showModeSwitchView().setSelectedSegmentIndex(0);
        } else if (curPowerCostShowMode == MHPowerCostMode_Day) {
            self.showModeSwitchView().setSelectedSegmentIndex(1);
        } else if (curPowerCostShowMode == MHPowerCostMode_Week) {
            self.showModeSwitchView().setSelectedSegmentIndex(2);
        } else {
            self.showModeSwitchView().setSelectedSegmentIndex(3);
        }

        self.updateCurrentPowerStatus();
    },

    // 选择时间段回调
    onValueChanged: function(sender) {
        _OC_log("value change:", self.elecManager());
        self.setCurPowerCostShowMode(sender.selectedSegmentIndex() + 1);
        self.powerCostView().updatePowerCostData_mode_isLoadNext(self.elecManager().getDataListOfMode(self.curPowerCostShowMode()), self.curPowerCostShowMode(), NO);
        self.updateCurrentPowerStatus();
    },

    // 获取前一页数据
    startGetMore: function() {
        var weakself = __weak(self);
        if (self.elecManager().isHaveMoreOfMode(self.curPowerCostShowMode())) {
            self.elecManager().loadNextPageOfMode_success_failure(self.curPowerCostShowMode(),block('id', function(obj) {
                weakself.powerCostView().updatePowerCostData_mode_isLoadNext(weakself.elecManager().getDataListOfMode(weakself.curPowerCostShowMode()), weakself.curPowerCostShowMode(), YES);
            }),block('NSError *', function(obj) {

            }));
        }
    },
});

// 入口，打开页面
var testViewController = MHDemoPowerCostViewController.alloc().init();
pushNewPage(testViewController);
