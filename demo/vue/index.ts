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

@Component({
    template: `
    <div>
        <a href="https://github.com/plantain-00/tree-component/tree/master/demo/vue/index.ts" target="_blank">the source code of the demo</a>
        <br/>
        default:
        <tree :data="data"
            @toggle="toggle($event)"
            @change="change($event)"></tree>
        selected id: {{selectedId}}
        <hr/>
        checkbox:
        <tree :data="data2"
            :checkbox="true"
            @toggle="toggle2($event)"
            @change="change2($event)"></tree>
        <hr/>
        draggable:
        <tree :data="data3"
            :draggable="true"
            :drop-allowed="dropAllowed"
            @toggle="toggle3($event)"
            @drop="drop3($event)"></tree>
        <hr/>
        no dots:
        <tree :data="data4"
            :nodots="true"
            @toggle="toggle4($event)"></tree>
        <hr/>
        large:
        <tree :data="data5"
            size="large"
            @toggle="toggle5($event)"></tree>
        <hr/>
        small:
        <tree :data="data6"
            size="small"
            @toggle="toggle6($event)"></tree>
        <hr/>
        dark theme:
        <tree :data="data7"
            theme="dark"
            :checkbox="true"
            :draggable="true"
            @toggle="toggle7($event)"
            @change="change7($event)"
            @drop="drop7($event)"></tree>
        <hr/>
        contextmenu:
        <tree :data="data8"
            @toggle="toggle8($event)"></tree>
    </div>
    `,
})
class App extends Vue {
    data = data;
    selectedId: number | null = null;
    data2 = JSON.parse(JSON.stringify(data));
    data3 = JSON.parse(JSON.stringify(data));
    data4 = JSON.parse(JSON.stringify(data));
    data5 = JSON.parse(JSON.stringify(data));
    data6 = JSON.parse(JSON.stringify(data));
    data7 = JSON.parse(JSON.stringify(data));
    data8 = data8;
    dropAllowed = canMove;

    toggle(eventData: common.EventData) {
        toggle(eventData);
    }
    change(eventData: common.EventData) {
        this.selectedId = eventData.data.state.selected ? null : eventData.data.value.id;
        if (!eventData.data.state.selected) {
            for (const child of this.data) {
                clearSelectionOfTree(child);
            }
        }
        eventData.data.state.selected = !eventData.data.state.selected;
    }
    toggle2(eventData: common.EventData) {
        toggle(eventData);
    }
    change2(eventData: common.EventData) {
        setSelectionOfTree(eventData.data, !eventData.data.state.selected);
        setParentsSelection(this.data2, eventData.path);
    }
    toggle3(eventData: common.EventData) {
        toggle(eventData);
    }
    drop3(dropData: common.DropData) {
        move(dropData, this.data3);
    }
    toggle4(eventData: common.EventData) {
        toggle(eventData);
    }
    toggle5(eventData: common.EventData) {
        toggle(eventData);
    }
    toggle6(eventData: common.EventData) {
        toggle(eventData);
    }
    toggle7(eventData: common.EventData) {
        toggle(eventData);
    }
    change7(eventData: common.EventData) {
        setSelectionOfTree(eventData.data, !eventData.data.state.selected);
        setParentsSelection(this.data7, eventData.path);
    }
    drop7(dropData: common.DropData) {
        move(dropData, this.data7);
    }
    toggle8(eventData: common.EventData) {
        toggle(eventData);
    }
}

// tslint:disable-next-line:no-unused-expression
new App({ el: "#container" });
