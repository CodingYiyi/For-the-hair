# 内容安全策略 - XSS攻击的有效防御手段之一

> 随着 cookie 的 samesite 属性的推出，CSRF攻击也被有效地防御。相应的，本文提到的 CSP 为 XSS 攻击的有效防御手段。

在阅读 Vue 源码的时候（template 转化成 render 函数的那部分 createCompileToFunctionFn ），有如下代码

```
    // detect possible CSP restriction
    try {
        new Function('return 1');
    } catch (e) {
        if (e.toString().match(/unsafe-eval|CSP/)) {
            warn$$1(
                'It seems you are using the standalone build of Vue.js in an ' +
                'environment with Content Security Policy that prohibits unsafe-eval. ' +
                'The template compiler cannot work in this environment. Consider ' +
                'relaxing the policy to allow unsafe-eval or pre-compiling your ' +
                'templates into render functions.'
            );
        }
    }
```

上述代码中有个关键词那就是 CSP ，就是本文的主题：内容安全策略

CSP 基于白名单来源，因为此方法可明确指示浏览器将特定的资源集视为可接受的资源，并拒绝其余资源。不过，基于来源的白名单无法解决 XSS 攻击带来的最大威胁：内联脚本注入。如果攻击者可以注入一个 script 标记，在标记中直接包含一些恶意的负载 (`<script>sendMyDataToEvilDotCom();</script>`)，则浏览器将无法将它与合法内联脚本标记区分开来。CSP 可通过完全禁止内联脚本来解决此问题：这是唯一确定有效的方式。

[可显著降低浏览器中 XSS 攻击的风险和影响的防护功能： 内容安全性策略 (CSP)](https://developers.google.com/web/fundamentals/security/csp)
