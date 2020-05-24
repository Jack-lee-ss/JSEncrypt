var LeyBc = function() {
    A = function() {
        B = function() {
            return 100;
        }
        return 'https';
    },
    md5 = function() {
        return 12;
    }
}
var v = LeyBc();
var F = A();

function getpwd() {

    return B() + A() + md5();
}
// 匿名函数的嵌套调用：每层函数均赋值变量，并调用一次母函数（内部有子函数）getpwd()中直接返回需要的子函数。