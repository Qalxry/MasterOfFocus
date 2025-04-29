// ==UserScript==
// @name         Master of Focus 专注大师
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  目前功能：如果检测到不是允许的网址，就将页面使用半透明页面覆盖，并弹出提示框提示不要浏览娱乐网站，专心学习！
// @author       ShizuriYuki
// @match        https://*/*
// @match        http://*/*
// @match        file:///*
// @icon         https://qalxry.github.io/img/fluid.jpg
// @license      AGPL-3.0
// @run-at       document-idie
// @grant none
// ==/UserScript==

function printf(str, data) {
    return `${str}`.replace(/{(\w+)}/g, (match, key) => {
        return data[key];
    });
}

function myAnimation(elem, attr, endValue, format, duration) {
    // 返回一个Promise
    return new Promise((resolve, reject) => {
        const STYLE = window.getComputedStyle(elem);
        const START_TIME = performance.now();
        const FPS = 60;
        const FRAME_TIME = 1000 / FPS;
        const ATTR = STYLE[attr];
        // const START_VALUE = parseFloat(ATTR);
        // match the number in the string
        const START_VALUE = parseFloat(ATTR.match(/-?\d+\.?\d*/)[0]);
        let prevTime = performance.now();
        function animate() {
            const NOW_TIME = performance.now();
            const ELAPSED_TIME = NOW_TIME - START_TIME;
            const DETLA_TIME = NOW_TIME - prevTime;
            const ALPHA = ELAPSED_TIME / duration;
            if (ALPHA < 1) {
                if (DETLA_TIME > FRAME_TIME) {
                    prevTime = NOW_TIME;
                    elem.style[attr] = printf(format, { value: START_VALUE + (endValue - START_VALUE) * ALPHA });
                }
                requestAnimationFrame(animate);
            } else {
                elem.style[attr] = printf(format, { value: endValue });
                resolve();
            }
        }
        // 开始第一帧
        requestAnimationFrame(animate);
    });
}

function myAnimationMultiple(elems, duration = 500, fps = 60) {
    // 返回一个Promise
    return new Promise((resolve, reject) => {
        const LENGTH = elems.length;
        let START_VALUE = [];
        for (let i = 0; i < elems.length; i++) {
            START_VALUE[i] = parseFloat(window.getComputedStyle(elems[i].elem)[elems[i].attr].match(/-?\d+\.?\d*/)[0]);
        }
        const START_TIME = performance.now();
        const FPS = fps;
        const FRAME_TIME = 1000 / FPS;
        let prevTime = performance.now();
        function animate() {
            const NOW_TIME = performance.now();
            const ELAPSED_TIME = NOW_TIME - START_TIME;
            const DETLA_TIME = NOW_TIME - prevTime;
            const ALPHA = ELAPSED_TIME / duration;
            if (ALPHA < 1) {
                if (DETLA_TIME > FRAME_TIME) {
                    prevTime = NOW_TIME;
                    // elem.style[attr] = printf(format, { value: START_VALUE + (endValue - START_VALUE) * ALPHA });
                    for (let i = 0; i < LENGTH; i++) {
                        elems[i].elem.style[elems[i].attr] = printf(elems[i].format, {
                            value: (START_VALUE[i] + (elems[i].target - START_VALUE[i]) * ALPHA).toFixed(2),
                        });
                    }
                }
                requestAnimationFrame(animate);
            } else {
                // elem.style[attr] = printf(format, { value: endValue });
                for (let i = 0; i < LENGTH; i++) {
                    elems[i].elem.style[elems[i].attr] = printf(elems[i].format, { value: elems[i].target });
                }
                resolve();
            }
        }
        // 开始第一帧
        requestAnimationFrame(animate);
    });
}

function myFullAnimation(elems, fps = 60) {
    // 返回一个Promise
    return new Promise((resolve, reject) => {
        const LENGTH = elems.length;
        let START_VALUE = [];
        for (let i = 0; i < elems.length; i++) {
            START_VALUE[i] = parseFloat(window.getComputedStyle(elems[i].elem)[elems[i].attr].match(/-?\d+\.?\d*/)[0]);
        }
        const START_TIME = performance.now();
        const FPS = fps;
        const FRAME_TIME = 1000 / FPS;
        let prevTime = performance.now();
        let exitFlag = false;
        let cnt = 0;
        function animate() {
            const NOW_TIME = performance.now();
            const ELAPSED_TIME = NOW_TIME - START_TIME;
            const DETLA_TIME = NOW_TIME - prevTime;
            if (DETLA_TIME > FRAME_TIME) {
                prevTime = NOW_TIME;
                cnt = 0;
                for (let i = 0; i < LENGTH; i++) {
                    if (elems[i].duration > ELAPSED_TIME) {
                        let ALPHA = ELAPSED_TIME / elems[i].duration;
                        cnt++;
                        elems[i].elem.style[elems[i].attr] = printf(elems[i].format, {
                            value: (START_VALUE[i] + (elems[i].target - START_VALUE[i]) * ALPHA).toFixed(2),
                        });
                    }
                }
                exitFlag = cnt === 0;
                requestAnimationFrame(animate);
            } else if (!exitFlag) {
                requestAnimationFrame(animate);
            } else {
                for (let i = 0; i < LENGTH; i++) {
                    elems[i].elem.style[elems[i].attr] = printf(elems[i].format, { value: elems[i].target });
                }
                resolve();
            }
        }
        // 开始第一帧
        requestAnimationFrame(animate);
    });
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

(function () {
    "use strict";

    const mode = "whitelist"; // "blacklist" or "whitelist"
    const blacklist = ["bilibili", "zhihu"];
    const whitelist = [
        "google",
        "bing",
        "csdn",
        "github",
        "cnblogs",
        "luogu",
        "codeforces",
        "leetcode",
        "stackoverflow",
        "wikipedia",
        "runoob",
        "cppreference",
        "openai",
        "118.190.20.162",
        "acm",
        "youdao",
        "hnu.edu",
        "chaoxing",
        "xuetangx",
        "mooc",
        "icourse163",
        "zhihuishu",
        "microsoft",
        "visualgo.net",
        "dazi.kukuw.com",
        "zlibrary",
        "oi-wiki",
        "as.vivo.com",
        "graph.qq.com",
        "w3school",
        "oauth",
        "mail.qq.com",
        "pan.baidu.com",
        "juejin",
        "jianshu",
        "blog",
        "segmentfault",
        "geeksforgeeks",
        "pornhub",
        "claude",
        "geogebra",
        "baike",
        "gitee",
        "gitlab",
        "leetcode",
        "vscode",
        "openai",
        "chatgpt",
        "deepseek",
        "claude",
        "android",
        "gemini",
        "thebai",

    ];

    function check_URL_in_list(list) {
        var currentUrl = window.location.href;
        // Make the url to lower case
        currentUrl = currentUrl.toLowerCase();
        // Check if the current page is not allowed
        for (var i = 0; i < list.length; i++) {
            // Make the list element to lower case
            if (currentUrl.indexOf(list[i].toLowerCase()) != -1) {
                return true;
            }
        }
        return false;
    }

    var isBanned = (function () {
        if (mode == "blacklist") {
            return check_URL_in_list(blacklist);
        } else if (mode == "whitelist") {
            return !check_URL_in_list(whitelist);
        }
    })();

    // 如果当前页面不允许，则用毛玻璃层(高斯模糊)覆盖，并弹出提示框(不要浏览娱乐网站，专心学习！)
    if (isBanned) {
        var blurDiv = document.createElement("div");
        blurDiv.style.width = "100%";
        blurDiv.style.height = "100%";
        blurDiv.style.position = "fixed";
        blurDiv.style.top = "0";
        blurDiv.style.left = "0";
        blurDiv.style.zIndex = "9998";
        blurDiv.style.background = "rgba(0,0,0,0.5)";
        blurDiv.style.backdropFilter = "blur(20px)";
        blurDiv.style.color = "white";
        blurDiv.style.fontSize = "30px";
        blurDiv.style.textAlign = "center";
        blurDiv.style.lineHeight = "100vh";
        document.body.appendChild(blurDiv);

        // alert("不要浏览娱乐网站，专心学习！");
        // div.innerHTML = "不要浏览娱乐网站，专心学习！";
        var remindText = document.createElement("p");
        remindText.innerHTML = "不要浏览娱乐网站，专心学习！";
        remindText.style.position = "fixed";
        remindText.style.top = "40%";
        remindText.style.left = "50%";
        remindText.style.transform = "translate(-50%,-50%)";
        remindText.style.zIndex = "9999";
        remindText.style.fontSize = "30px";
        remindText.style.color = "white";
        remindText.style.border = "none";
        remindText.style.outline = "none";
        remindText.style.borderRadius = "10px";
        remindText.style.padding = "10px 20px";
        document.body.appendChild(remindText);

        // 在div上的文字下方添加一个按钮，点击后可以跳转到允许的网站
        var closePageButton = document.createElement("button");
        closePageButton.style.position = "fixed";
        closePageButton.style.top = "50%";
        closePageButton.style.left = "50%";
        closePageButton.style.transform = "translate(-50%,-50%)";
        closePageButton.style.zIndex = "9999";
        closePageButton.style.fontSize = "30px";
        closePageButton.style.color = "white";
        closePageButton.style.background = "rgba(0,0,0,0.5)";
        closePageButton.style.border = "none";
        closePageButton.style.outline = "none";
        closePageButton.style.borderRadius = "10px";
        closePageButton.style.padding = "10px 20px";
        closePageButton.innerHTML = "点击关闭网站";
        closePageButton.onclick = async function () {
            //   window.open("", "_self", "");
            //   window.close();
            await myFullAnimation(
                [
                    { elem: blurDiv, attr: "opacity", target: 1, format: "{value}", duration: 500 },
                    { elem: blurDiv, attr: "backdropFilter", target: "100", format: "blur({value}px)", duration: 500 },
                    { elem: remindText, attr: "opacity", target: 0, format: "{value}", duration: 500 },
                    { elem: closePageButton, attr: "opacity", target: 0, format: "{value}", duration: 500 },
                    { elem: continueButton, attr: "opacity", target: 0, format: "{value}", duration: 500 },
                ],
                120
            ).then(() => {
                console.log("多个动画结束");
            });
            window.top.open("about:blank", "_self").close();
        };
        document.body.appendChild(closePageButton);

        var continueButton = document.createElement("button");
        continueButton.style.position = "fixed";
        continueButton.style.top = "60%";
        continueButton.style.left = "50%";
        continueButton.style.transform = "translate(-50%,-50%)";
        continueButton.style.zIndex = "9999";
        continueButton.style.fontSize = "30px";
        continueButton.style.color = "white";
        continueButton.style.background = "rgba(0,0,0,0.5)";
        continueButton.style.border = "none";
        continueButton.style.outline = "none";
        continueButton.style.borderRadius = "10px";
        continueButton.style.padding = "10px 20px";
        continueButton.innerHTML = "我承诺这是学习网站。请放行！";

        var continueButton_state = 0;
        var continueButton_click = 0;
        continueButton.onclick = async function () {
            continueButton_click += 1;
            let time = 10;
            if (continueButton_state == 0) {
                // 将该按钮设置为不可点击
                continueButton.disabled = true;
                await sleep(1);
                // 将按钮的文字改为“将于xx秒后放行”
                // 每隔一秒将时间减一
                for (let i = 0; i < time; i++) {
                    continueButton.style.background = "rgba(0,0,0,0.5)";
                    continueButton.innerHTML = "将于" + (time - i) + "秒后继续";
                    await sleep(1000);
                }
                // 半透明yellow
                continueButton.style.background = "rgba(255,255,0,0.5)";
                continueButton.innerHTML = "你真的确定你在学习吗？如果不是，请他妈的滚回去学习！";
                continueButton.disabled = false;
                continueButton_state = 1;
                return;
            } else if (continueButton_state == 1) {
                // 将该按钮设置为不可点击
                continueButton.disabled = true;
                // 每隔一秒将时间减一
                for (let i = 0; i < time; i++) {
                    continueButton.innerHTML = "将于" + (time - i) + "秒后继续";
                    await sleep(1000);
                }
                // 半透明red
                continueButton.style.background = "rgba(255,0,0,0.5)";
                continueButton.innerHTML = "要是再他妈的不学习，请你以后不要再依靠Takagisan了！";
                continueButton.disabled = false;
                continueButton_state = 2;
                return;
            } else if (continueButton_state == 2) {
                // 将该按钮设置为不可点击
                continueButton.disabled = true;
                // 每隔一秒将时间减一
                for (let i = 0; i < time; i++) {
                    continueButton.innerHTML = "将于" + (time - i) + "秒后继续";
                    await sleep(1000);
                }

                // 将 blurDiv, remindText, closePageButton, continueButton 的透明度逐渐降低，直至消失
                // 删除毛玻璃层和文字、按钮，但是是渐变为透明度为0之后再删除
                await myFullAnimation(
                    [
                        { elem: blurDiv, attr: "opacity", target: 0, format: "{value}", duration: 1000 },
                        { elem: remindText, attr: "opacity", target: 0, format: "{value}", duration: 1000 },
                        { elem: closePageButton, attr: "opacity", target: 0, format: "{value}", duration: 1000 },
                        { elem: continueButton, attr: "opacity", target: 0, format: "{value}", duration: 1000 },
                    ],
                    120
                ).then(() => {
                    console.log("多个动画结束");
                    document.body.removeChild(blurDiv);
                    document.body.removeChild(remindText);
                    document.body.removeChild(closePageButton);
                    document.body.removeChild(continueButton);
                    isBanned = false;
                });
                return;
            }
        };
        document.body.appendChild(continueButton);

        // 该div可能会被用户通过f12删除，所以需要定时检测，如果被删除了，就重新添加
        setInterval(function () {
            if (isBanned) {
                if (!document.body.contains(blurDiv)) {
                    document.body.appendChild(blurDiv);
                }
                if (!document.body.contains(remindText)) {
                    document.body.appendChild(remindText);
                }
                if (!document.body.contains(closePageButton)) {
                    document.body.appendChild(closePageButton);
                }
                if (!document.body.contains(continueButton)) {
                    document.body.appendChild(continueButton);
                }
            }
        }, 500);

        setTimeout(async function () {
            // 执行：3s后自动关闭
            let maxTime = 2;
            for (let i = 0; i < maxTime; i++) {
                if (continueButton_click > 0) {
                    return;
                } else {
                    continueButton.style.background = "rgba(255,0,0,0.5)";
                    continueButton.innerHTML = "将于" + (maxTime - i) + "秒后立即执行制裁！";
                    await sleep(1000);
                }
            }
            continueButton.disabled = true;
            // 背景迅速变为模糊后关闭页面
            closePageButton.click(); // 直接关闭页面
        }, 0); // 立即执行

        setInterval(function () {
            console.log(continueButton_click);
        }, 100);
    }
})();
