"use strict";

var defaultMessage = "Your browser is not support auto copy , please try the following steps: #{key}, Enter";

function format(message) {
    var copyKey = (/mac os x/i.test(navigator.userAgent) ? "⌘" : "Ctrl") + "+C";
    return message.replace(/#{\s*key\s*}/g, copyKey);
}

function getBrowserImfo() {
    var ua = navigator.userAgent;
    var ret = {}, webkit = ua.match(/WebKit\/([\d.]+)/),
        chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/),
        ie = ua.match(/MSIE\s([\d\.]+)/) || ua.match(/(?:trident)(?:.*rv:([\w.]+))?/i),
        firefox = ua.match(/Firefox\/([\d.]+)/),
        safari = ua.match(/Safari\/([\d.]+)/),
        opera = ua.match(/OPR\/([\d.]+)/);

    webkit && (ret.webkit = webkit[1]);
    chrome && (ret.chrome = chrome[1]);
    ie && (ret.ie = ie[1]);
    firefox && (ret.firefox = firefox[1]);
    safari && (ret.safari = safari[1]);
    opera && (ret.opera = opera[1]);
    return ret;
}

function copy(text, options) {
    var debug, success = false, message;

    if (!options) {
        options = {};
    }
    debug = options.debug || false;

    debug && console.log("Start to copy,the imformation of user's browser is:", getBrowserImfo());

    try {
        if (navigator && navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
            navigator.clipboard.writeText(text).then(function () {
                debug && console.log("navigator.clipboard.writeText success");
                success = true;
            })
        } else {
            throw new Error("the browser is not support navigator.clipboard.writeText");
        }
    } catch (error) {
        try {
            debug && console.error("navigator.clipboard.writeText copy failed", error);
            debug && console.warn("try to use execCommand");
            if (document.execCommand) {
                var copyinput = document.createElement('textarea');
                copyinput.value = text;
                document.body.appendChild(copyinput);
                copyinput.select();
                success = document.execCommand("Copy");
                document.body.removeChild(copyinput);
                if (success) {
                    debug && console.log("execCommand copy success");
                    success = true;
                } else {
                    throw new Error("execCommand return false")
                }
            } else {
                throw new Error("the browser is not support execCommand");
            }
        } catch (error) {
            try {
                debug && console.error("execCommand copy failed", error);
                debug && console.warn("try to use window.clipboardData.setData");
                if (window.clipboardData && window.clipboardData.setData) {
                    success = window.clipboardData.setData(text);
                    if (success) {
                        debug && console.log("window.clipboardData.setData copy success", text)
                        success = true;
                    } else {
                        throw new Error("window.clipboardData.setData return false")
                    }
                } else {
                    throw new Error("the browser is not support window.clipboardData.setData");
                }
            } catch (error) {
                debug && console.error("window.clipboardData.setData copy failed", error);
                debug && console.error("back to propt");
                message = format("message" in options ? options.message : defaultMessage);
                window.prompt(message, text);
            }
        }
    }
    return success;
}

module.exports = copy;