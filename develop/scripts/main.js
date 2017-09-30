$(function () {
    $('#fullpage').fullpage();
});



function Line() {
    // 最大长度
    this.MaxLine = 550;
    // 最小长度
    this.MinLine = 210;
    // 起点
    this.m = {
        x: 220,
        y: 320
    }
    // 终点
    this.l = {
        x: 220,
        y: 320
    }
    // 取第一个canvans
    this.cas = $("#canvas")[0];
    // 定义画布
    this.ctx = this.cas.getContext('2d');
    // 取到屏幕的宽
    this.cas.width = window.innerWidth;
    // 取到屏幕的高
    this.cas.height = window.innerHeight;
    // 填充块级颜色
    this.ctx.strokeStyle = "#90D0DF";
    // 线的高度
    this.ctx.lineWidth = 50;
    // 线的 border-radius
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this._init();
}
// 停止并删除所有画布
Line.prototype.reset = function () {
    var _this = this;
    _this.res = false;
    // 清洗画布
    _this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
}
// 定于画布基本属性
Line.prototype._init = function () {
    var _this = this;
    _this.m = {
        x: 210,
        y: 320
    }
    _this.l = {
        x: 210,
        y: 320
    }
    _this.rFang = false;
    _this.once = 0;
    _this.res = true;
    //横向速度
    _this.num = 7;
    //圆环速度
    _this.rSpeed = 0.05;
    //y跨度
    _this.yx = 100;
    //圆半径
    _this.r = 100;
    //圆环启始位置
    _this.beginCur = 1.5;
    //圆环位置
    _this.closeCur = 1.5;
    _this.rafLine();
}
// 绘制直线
Line.prototype.rafLine = function () {
    var _this = this;
    // 定义速度
    _this.l.x += _this.num;
    _this.ctx.beginPath();
    // 设置起点
    _this.ctx.moveTo(_this.m.x, _this.m.y);
    // 画线
    _this.ctx.lineTo(_this.l.x, _this.l.y);
    // 关闭画布
    _this.ctx.closePath();
    // 填充画布
    _this.ctx.stroke();
    if (_this.res == true) {
        // 调用本身
        requestAnimationFrame(function () {
            if (_this.l.x < _this.MaxLine && _this.l.x > _this.MinLine) {
                _this.rafLine();
            } else {
                _this.once += 1;
                if (_this.once > 3) {
                    // 未完成绘制
                    cancelAnimationFrame(_this.rafLine);
                    cancelAnimationFrame(_this.rafCur);
                    return;
                }
                cancelAnimationFrame(_this.rafLine);
                // 已完成绘制 二次反向
                if (_this.rSpeed < 0) {
                    _this.rFang = true;
                } else {
                    _this.rFang = false;
                }
                _this.rafCur();
            }
        });
    } else {
        // 清洗画布
        _this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
}
// 绘制半圆
Line.prototype.rafCur = function () {
    var _this = this;
    // 绘制速度
    _this.closeCur += _this.rSpeed;
    // 开始绘制
    _this.ctx.beginPath();
    // 绘制圆
    _this.ctx.arc(_this.l.x, _this.l.y + _this.yx, _this.r, 1.5 * Math.PI, _this.closeCur * Math.PI, _this.rFang);
    // 填充圆
    _this.ctx.stroke();
    if (_this.res == true) {
        requestAnimationFrame(function () {
            if (_this.closeCur < 2.5 && _this.closeCur > 0.5) {
                // 未完成绘制
                _this.rafCur();
            } else {
                // 已完成绘制 二次反向
                cancelAnimationFrame(_this.rafCur);
                _this.rSpeed *= -1;
                _this.closeCur = 1.5;
                _this.m.y = _this.l.y += 200;
                _this.m.x = _this.l.x;
                _this.num *= -1;
                _this.rafLine();
            }
        });
    } else {
        // 清洗画布
        _this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
}

// 开始绘画
var line = new Line();
// 暂停绘画
line.reset();


// line._init();
