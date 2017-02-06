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
            selectedId: null,
        };
    },
    methods: {
        toggle(eventData: common.EventData) {
            eventData.data.state.opened = !eventData.data.state.opened;
        },
        change(this: This, eventData: common.EventData) {
            this.selectedId = eventData.data.state.selected ? null : eventData.data.value.id;
            if (!eventData.data.state.selected) {
                this.clearSelection();
            }
            eventData.data.state.selected = !eventData.data.state.selected;
        },
        clearSelectionOfTree(this: This, tree: common.TreeData) {
            if (tree.state.selected) {
                tree.state.selected = false;
            }
            if (tree.children) {
                for (const child of tree.children) {
                    this.clearSelectionOfTree(child);
                }
            }
        },
        clearSelection(this: This) {
            for (const child of this.data) {
                this.clearSelectionOfTree(child);
            }
        },
    },
});

type This = {
    data: common.TreeData[];
    selectedId: null | number;
    clearSelectionOfTree: (tree: common.TreeData) => void;
    clearSelection: () => void;
} & Vue;
