// ==UserScript==
// @name         Master of Focus 专注大师
// @namespace    http://tampermonkey.net/
// @version      2.0
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
    const blacklist = [
        // 娱乐网站
        "bilibili.com",             // Bilibili
        "www.zhihu.com",            // 知乎
        "douyin.com",               // 抖音
        "tiktok.com",               // TikTok国际版
        "weibo.com",                // 微博
        "xiaohongshu.com",          // 小红书
        "iqiyi.com",                // 爱奇艺
        "youku.com",                // 优酷
        "v.qq.com",                 // 腾讯视频
        "mgtv.com",                 // 芒果TV
        "netflix.com",              // Netflix
        "youtube.com",              // YouTube
        "twitch.tv",                // Twitch直播
        "huya.com",                 // 虎牙直播
        "douyu.com",                // 斗鱼直播
        "kuaishou.com",             // 快手
        "taobao.com",               // 淘宝
        "jd.com",                   // 京东
        "pinduoduo.com",            // 拼多多

        // 游戏平台
        "steampowered.com",         // Steam
        "epicgames.com",            // Epic
        "nintendo.com",             // 任天堂
        "playstation.com",          // PlayStation
        "xbox.com",                 // Xbox
        "blizzard.com",             // 暴雪
        "origin.com",               // EA

        // 音乐/社交
        "spotify.com",              // Spotify
        "y.qq.com",                 // QQ音乐
        "kugou.com",                // 酷狗
        "kuwo.cn",                  // 酷我
        "music.163.com",            // 网易云音乐
        "yy.com",                   // YY语音
        "discord.com",              // Discord
        "reddit.com",               // Reddit
        "9gag.com",                 // 9GAG
        "instagram.com",            // Instagram
        "facebook.com",             // Facebook
        "twitter.com",              // Twitter
        "tumblr.com",               // Tumblr
        "pinterest.com",            // Pinterest

        // 小说/漫画
        "zongheng.com",             // 纵横中文网（补充）
        "qidian.com",               // 起点
        "jjwxc.net",                // 晋江
        "17k.com",                  // 17K
        "xxsy.net",                 // 潇湘书院
        "shuqi.com",                // 书旗小说
        "gongzicp.com",             // 长佩文学网
        "lofter.com",               // Lofter
        "acfun.cn",                 // A站
        "manhuagui.com",            // 漫画柜
        "dmzj.com",                 // 动漫之家
        "bcy.net",                  // 半次元
        "sakura.moe",               // 樱花动漫（补全）
        "mangadex.org",             // MangaDex（补充）
        "moegirl",                  // 萌娘百科
        "cycity",                   // 次元城动漫
        "age.tv",                   // Age动漫
        "agedm",                    // Age动漫

        // 新闻/综合
        "sina.com.cn",              // 新浪
        "sohu.com",                 // 搜狐
        "ifeng.com",                // 凤凰网
        "people.com.cn",            // 人民网
        "xinhuanet.com",            // 新华网
        "thepaper.cn",              // 澎湃新闻

        // 成人视频平台
        "pornhub",                  // PornHub
        "xvideos",                  // XVideos
        "missav",                   // MissAV
        "javbus.com",               // JavBus
        "jable.tv",                 // Jable
        "xhamster.com",             // XHamster
        "redtube.com",              // RedTube
        "youporn.com",              // YouPorn
        "brazzers.com",             // Brazzers
        "tnaflix.com",              // TNAFlix
        "spankbang.com",            // SpankBang
        "beeg.com",                 // Beeg
        "bellesaplus.com",          // Bellesa

        // 成人直播平台
        "chaturbate.com",           // Chaturbate
        "stripchat.com",            // StripChat
        "myfreecams.com",           // MyFreeCams

        // 成人内容订阅平台
        "onlyfans",                 // OnlyFans
        "fansly.com",               // Fansly
        "manyvids.com",             // ManyVids
        "clips4sale.com",           // Clips4Sale

        // 成人漫画/动画
        "fakku.net",                // Fakku
        "nhentai",                  // NHentai
        "hanime",                   // Hanime
        "rule34",                   // Rule34
        "e-hentai.org",             // E-Hentai
        "hentaihaven.xxx",          // HentaiHaven
        "8muses.com",               // 8muses

        // 二次元成人内容
        "hentai",                   // 二次元成人内容
        "chan.sankakucomplex.com",  // Sankaku Complex
        "gelbooru.com",             // Gelbooru
        "danbooru",                 // Danbooru
        "pixiv",                    // Pixiv（需配合R-18标签过滤）
        "kemono.party",             // Kemono
        "fantia.jp",                // Fantia

        // 其他成人内容平台
        "porndude.com",             // PornDude
        "motherless.com",           // Motherless
        "thothub.tv",               // ThotHub
        "camwhores.tv",             // CamWhores
        "literotica.com",           // Literotica
        "ashemaletube.com",         // AShemaleTube
        "f95zone.to",               // F95Zone
    ];

    const whitelist = [
        // 搜索引擎
        "google.com",           // Google
        "bing.com",             // Bing

        // 编程与技术社区
        "github",               // GitHub
        "gitee",                // Gitee
        "gitlab",               // GitLab
        "stackoverflow",        // Stack Overflow
        "segmentfault",         // SegmentFault
        "geeksforgeeks",        // GeeksforGeeks
        "leetcode",             // LeetCode
        "codeforces",           // Codeforces
        "luogu",                // 洛谷
        "oi-wiki",              // OI Wiki
        "visualgo",             // 算法可视化
        "cppreference",         // C++ 参考文档

        // 学习平台与在线教育
        ".edu",                 // 所有教育机构域名
        "xuetangx.com",         // 学堂在线
        "icourse163.org",       // 中国大学MOOC
        "zhihuishu.com",        // 智慧树
        "chaoxing.com",         // 超星
        "mooc",                 // MOOC中国
        "educoder",             // Educoder

        // 文档与教程
        "docs.",                // 通用文档
        "wikipedia.org",        // 维基百科
        "baike.baidu.com",      // 百度百科
        "cnki.net",             // CNKI
        "wanfangdata.com.cn",   // 万方数据
        "gitbook",              // GitBook
        "runoob.com",           // 菜鸟教程
        "w3school.com",         // W3School
        "docs.microsoft.com",   // Microsoft Docs
        "android.com",          // Android
        "segmentfault.com",     // SegmentFault
        "geeksforgeeks.org",    // GeeksforGeeks
        "stackoverflow.com",    // Stack Overflow
        "tutorialspoint.com",   // TutorialsPoint
        "learn.microsoft.com",  // Microsoft Learn
        "learnopengl.com",      // Learn OpenGL
        "learncpp.com",         // Learn C++
        "cplusplus.com",        // C++ Reference
        "python",               // Python 文档
        "numpy",                // NumPy
        "pandas",               // Pandas
        "scipy",                // SciPy
        "matplotlib",           // Matplotlib
        "tensorflow",           // TensorFlow
        "keras",                // Keras
        "pytorch",              // PyTorch
        "scikit",               // Scikit-learn
        "opencv",               // OpenCV
        "flask",                // Flask
        "django",               // Django REST Framework
        "fastapi.tiangolo.com", // FastAPI
        "vuejs",                // Vue.js
        "reactjs",              // React
        "angular.io",           // Angular
        "jquery.com",           // jQuery
        "bootstrap.com",        // Bootstrap
        "tailwindcss.com",      // Tailwind CSS
        "sass-lang.com",        // Sass
        "lesscss.org",          // Less
        "typescriptlang.org",   // TypeScript
        "nodejs.org",           // Node.js
        "expressjs.com",        // Express.js
        "mongodb.com",          // MongoDB
        "redis.io",             // Redis
        "postgresql.org",       // PostgreSQL
        "mysql.com",            // MySQL
        "sqlite.org",           // SQLite
        "firebase.google.com",  // Firebase
        "heroku.com",           // Heroku
        "aws.amazon.com",       // AWS
        "azure.microsoft.com",  // Azure
        "googlecloud.com",      // Google Cloud
        "digitalocean.com",     // DigitalOcean
        "vultr.com",            // Vultr
        "linode.com",           // Linode
        "github.io",            // GitHub Pages
        "gitlab.io",            // GitLab Pages
        "bitbucket.io",         // Bitbucket Pages

        // AI 与数据科学
        "openai",               // OpenAI
        "chatgpt",              // ChatGPT
        "deepseek",             // DeepSeek
        "claude",               // Claude
        "gemini",               // Google Gemini
        "huggingface",          // Hugging Face
        "kaggle",               // Kaggle
        "qwen",                 // 通义千问

        // 云服务与存储
        "pan.baidu.com",        // 百度网盘
        "aliyun.com",           // 阿里云
        "mail.qq.com",          // QQ邮箱
        "docs.qq.com",          // 腾讯文档
        "vscode.dev",           // VS Code Online
        "cloud.google.com",     // Google Cloud Console
        "aliyun.com",           // 阿里云
        "volcengine.com",       // 火山引擎

        // 其他实用工具
        "youdao.com",           // 有道词典
        "geogebra.org",         // GeoGebra
        "desmos",               // Desmos
        "dazi.kukuw.com",       // 打字练习

        // 技术博客与论坛
        "csdn.net",             // CSDN
        "cnblogs.com",          // 博客园
        "juejin.cn",            // 掘金
        "jianshu.com",          // 简书
        "blog.dev",             // 开发者博客

        // 其他
        "118.190.20.162",       // 内部IP
        "as.vivo.com",          // vivo 互传
        "graph.qq.com",         // QQ开放平台
        "oauth",                // OAuth服务
        "zlibrary",             // Z-Library
        "porn",
        "zhuanlan.zhihu.com",
        "overleaf",             // OverLeaf Online LaTeX Editor
        "latex",                // LaTeX
        ".pdf",                 // PDF Documents
        "microsoft",
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
        blurDiv.style.fontSize = "20px";
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
        remindText.style.fontSize = "20px";
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
        closePageButton.style.fontSize = "20px";
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
        continueButton.style.fontSize = "20px";
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
            let maxTime = 1;
            for (let i = 0; i < maxTime; i++) {
                if (continueButton_click > 0) {
                    return;
                } else {
                    continueButton.style.background = "rgba(255,0,0,0.5)";
                    continueButton.innerHTML = "将于" + (maxTime - i) + "秒后立即执行制裁！";
                    await sleep(1000);
                }
            }
            if (continueButton_click > 0) {
                return;
            } else {
                continueButton.innerHTML = "立即执行制裁！";
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
