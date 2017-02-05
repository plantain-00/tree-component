import * as Vue from "vue";
import "../../dist/vue";
import { data } from "../data";

/* tslint:disable:no-unused-new */
/* tslint:disable:object-literal-shorthand */

new Vue({
    el: "#container",
    data() {
        return {
            data,
        };
    },
});
