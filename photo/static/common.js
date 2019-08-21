import axios from "axios"
export default {
    install(Vue, opt) {
        axios.get("./static/config.json", {}).then(res => {
            console.log(res);
            sessionStorage.localExpressUrl = res.data.localExpressUrl;
            sessionStorage.author = res.data.author;
        });

        Vue.prototype.testCommin = function () {
            alert("公共方法")
        }

        Vue.prototype.localExpressUrl = function () {
            return sessionStorage.localExpressUrl;
        }
    }
}