import * as Vue from "vue";
import Component from "vue-class-component";
import * as common from "./common";

@Component({
    template: `
    <li role="treeitem" :class="nodeClassName">
        <i class="jstree-icon jstree-ocl" role="presentation" @click="ontoggle()"></i><a :class="anchorClassName" href="javascript:void(0)" :draggable="draggable" @click="onchange()" @dblclick="ontoggle()" @mouseenter="hover(true)" @mouseleave="hover(false)" :data-path="pathString"><i v-if="checkbox" :class="checkboxClassName" role="presentation"></i><i v-if="data.icon !== false" :class="iconClassName" role="presentation"></i>{{data.text}}<div v-if="hasMarker" :class="markerClassName">&#160;</div></a>
        <ul v-if="data.children" role="group" class="jstree-children">
            <node v-for="(child, i) in data.children"
                :data="child"
                :last="i === data.children.length - 1"
                :checkbox="checkbox"
                :path="geChildPath(i)"
                :draggable="draggable"
                @toggle="ontoggle(arguments[0])"
                @change="onchange(arguments[0])">
            </node>
        </ul>
    </li>
    `,
    props: ["data", "last", "checkbox", "path", "draggable"],
})
class Node extends Vue {
    data: common.TreeData;
    last: boolean;
    checkbox?: boolean;
    path: number[];
    draggable?: boolean;

    hovered = false;
    doubleClick = new common.DoubleClick();

    get nodeClassName() {
        return common.getNodeClassName(this.data, this.last);
    }

    get anchorClassName() {
        return common.getAnchorClassName(this.data, this.hovered);
    }

    get checkboxClassName() {
        return common.getCheckboxClassName(this.data);
    }

    get iconClassName() {
        return common.getIconClassName(this.data.icon);
    }

    get pathString() {
        return this.path.toString();
    }

    get hasMarker() {
        return this.draggable && this.data.state.dropPosition !== common.DropPosition.empty;
    }

    get markerClassName() {
        return common.getMarkerClassName(this.data);
    }

    geChildPath(index: number) {
        return this.path.concat(index);
    }

    hover(hovered: boolean) {
        this.hovered = hovered;
    }
    ontoggle(eventData?: common.EventData) {
        if (eventData) {
            this.$emit("toggle", eventData);
        } else {
            if (this.data.children && this.data.children.length > 0) {
                this.$emit("toggle", { data: this.data, path: this.path });
            }
        }
    }
    onchange(eventData?: common.EventData) {
        if (eventData) {
            this.$emit("change", eventData);
        } else {
            if (this.data.state.disabled) {
                return;
            }

            this.doubleClick.onclick(() => {
                this.$emit("change", { data: this.data, path: this.path });
            });
        }
    }
}

Vue.component("node", Node);

@Component({
    template: `
    <div :class="rootClassName" role="tree">
        <ul class="jstree-container-ul jstree-children" role="group" @drag="ondrag($event)" @dragstart="ondragstart($event)" @dragend="ondragend($event)" @dragover="ondragover($event)" @dragenter="ondragenter($event)" @dragleave="ondragleave($event)" @drop="ondrop($event)">
            <node v-for="(child, i) in data"
                :data="child"
                :last="i === data.length - 1"
                :checkbox="checkbox"
                :path="[i]"
                :draggable="draggable"
                @toggle="ontoggle(arguments[0])"
                @change="onchange(arguments[0])"></node>
        </ul>
    </div>
    `,
    props: ["data", "checkbox", "draggable"],
})
export class Tree extends Vue {
    data: common.TreeData[];
    checkbox?: boolean;
    draggable?: boolean;

    dragTarget: HTMLElement | null = null;
    dropTarget: HTMLElement | null = null;

    get rootClassName() {
        return common.getRootClassName(this.checkbox);
    }

    ontoggle(eventData: common.EventData) {
        this.$emit("toggle", eventData);
    }
    onchange(eventData: common.EventData) {
        this.$emit("change", eventData);
    }
    ondrag(event: DragEvent) {
        if (this.dropTarget) {
            const pathString = this.dropTarget.dataset["path"];
            if (pathString) {
                const path = pathString.split(",").map(s => +s);
                const node = common.getNodeFromPath(this.data, path);
                node.state.dropPosition = common.getDropPosition(event.pageY, this.dropTarget.offsetTop);
            }
        }
    }
    ondragstart(event: DragEvent) {
        this.dragTarget = event.target as HTMLElement;
    }
    ondragend(event: DragEvent) {
        this.dragTarget = null;
    }
    ondragover(event: DragEvent) {
        if (this.draggable) {
            event.preventDefault();
        }
    }
    ondragenter(event: DragEvent) {
        this.dropTarget = event.target as HTMLElement;
    }
    ondragleave(event: DragEvent) {
        const pathString = (event.target as HTMLElement).dataset["path"];
        if (pathString) {
            const path = pathString.split(",").map(s => +s);
            const node = common.getNodeFromPath(this.data, path);
            node.state.dropPosition = common.DropPosition.empty;
        }
    }
    ondrop(event: DragEvent) {
        const sourcePath = this.dragTarget!.dataset["path"].split(",").map(s => +s);
        const targetPathString = (event.target as HTMLElement).dataset["path"];
        if (targetPathString) {
            const targetPath = targetPathString.split(",").map(s => +s);
            const dropData: common.DropData = {
                sourcePath,
                targetPath,
                sourceData: common.getNodeFromPath(this.data, sourcePath),
                targetData: common.getNodeFromPath(this.data, targetPath),
            };
            if (dropData.targetData.state.dropPosition !== common.DropPosition.empty) {
                this.$emit("drop", dropData);
            }
        }
        for (const node of this.data) {
            common.clearDropPositionOfTree(node);
        }
    }
}

Vue.component("tree", Tree);
