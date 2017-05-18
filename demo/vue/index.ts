import * as Vue from "vue";
import Component from "vue-class-component";
import "../../dist/vue";
import { data, clearSelectionOfTree, toggle, setSelectionOfTree, setParentsSelection, move, canMove, setContextMenu } from "../common";
import * as common from "../../dist/common";

@Component({
    template: `<button @click="click()">delete</button>`,
    props: ["data"],
})
class DeleteButton extends Vue {
    data: common.ContextMenuData;
    click() {
        const parent = common.getNodeFromPath(this.data.root, this.data.path.slice(0, this.data.path.length - 1));
        const children = parent && parent.children ? parent.children : this.data.root;
        const index = this.data.path[this.data.path.length - 1];
        children.splice(index, 1);
    }
}
Vue.component("delete-button", DeleteButton);

const data8: typeof data = JSON.parse(JSON.stringify(data));
for (const tree of data8) {
    setContextMenu(tree, "delete-button");
}

/* tslint:disable:no-unused-expression */
new Vue({
    el: "#container",
    data() {
        return {
            data,
            selectedId: null,
            data2: JSON.parse(JSON.stringify(data)),
            data3: JSON.parse(JSON.stringify(data)),
            data4: JSON.parse(JSON.stringify(data)),
            data5: JSON.parse(JSON.stringify(data)),
            data6: JSON.parse(JSON.stringify(data)),
            data7: JSON.parse(JSON.stringify(data)),
            data8,
            dropAllowed: canMove,
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
        drop3(this: This, dropData: common.DropData) {
            move(dropData, this.data3);
        },
        toggle4(eventData: common.EventData) {
            toggle(eventData);
        },
        toggle5(eventData: common.EventData) {
            toggle(eventData);
        },
        toggle6(eventData: common.EventData) {
            toggle(eventData);
        },
        toggle7(eventData: common.EventData) {
            toggle(eventData);
        },
        change7(this: This, eventData: common.EventData) {
            setSelectionOfTree(eventData.data, !eventData.data.state.selected);
            setParentsSelection(this.data7, eventData.path);
        },
        drop7(this: This, dropData: common.DropData) {
            move(dropData, this.data7);
        },
        toggle8(eventData: common.EventData) {
            toggle(eventData);
        },
    },
});

type This = {
    data: common.TreeData[];
    selectedId: null | number;
    data2: common.TreeData[];
    data3: common.TreeData[];
    data7: common.TreeData[];
} & Vue;
