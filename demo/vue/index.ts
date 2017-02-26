import * as Vue from "vue";
import "../../dist/vue";
import { data, clearSelectionOfTree, toggle, setSelectionOfTree, setParentsSelection, copy } from "../common";
import * as common from "../../dist/common";

/* tslint:disable:no-unused-new */

new Vue({
    el: "#container",
    data() {
        return {
            data,
            selectedId: null,
            data2: JSON.parse(JSON.stringify(data)),
            data3: JSON.parse(JSON.stringify(data)),
            data4: JSON.parse(JSON.stringify(data)),
        };
    },
    methods: {
        toggle(eventData: common.EventData) {
            toggle(eventData);
        },
        change(this: This, eventData: common.EventData) {
            this.selectedId = eventData.data.state.selected ? null : eventData.data.value.id;
            if (!eventData.data.state.selected) {
                for (const child of this.data) {
                    clearSelectionOfTree(child);
                }
            }
            eventData.data.state.selected = !eventData.data.state.selected;
        },
        toggle2(eventData: common.EventData) {
            toggle(eventData);
        },
        change2(this: This, eventData: common.EventData) {
            setSelectionOfTree(eventData.data, !eventData.data.state.selected);
            setParentsSelection(this.data2, eventData.path);
        },
        toggle3(eventData: common.EventData) {
            toggle(eventData);
        },
        change3(this: This, eventData: common.EventData) {
            // do nothing
        },
        drop3(this: This, dropData: common.DropData) {
            copy(dropData, this.data3);
        },
        toggle4(eventData: common.EventData) {
            toggle(eventData);
        },
        change4(this: This, eventData: common.EventData) {
            // do nothing
        },
    },
});

type This = {
    data: common.TreeData[];
    selectedId: null | number;
    data2: common.TreeData[];
    data3: common.TreeData[];
    data4: common.TreeData[];
} & Vue;
