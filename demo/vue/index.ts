import * as Vue from "vue";
import "../../dist/vue";
import { data } from "../data";
import * as common from "../../dist/common";

/* tslint:disable:no-unused-new */

new Vue({
    el: "#container",
    data() {
        return {
            data,
        };
    },
    methods: {
        toggle(eventData: common.EventData) {
            eventData.data.state!.opened = !eventData.data.state!.opened;
        },
        change(eventData: common.EventData) {
            eventData.data.state!.selected = !eventData.data.state!.selected;
        },
    },
});
