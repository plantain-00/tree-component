import * as Vue from "vue";
import Component from "vue-class-component";
import * as common from "./common";

@Component({
    template: require("raw-loader!./vue-node.html"),
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
    template: require("raw-loader!./vue-tree.html"),
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

    canDrop(event: DragEvent) {
        return this.draggable && (event.target as HTMLElement).dataset["path"];
    }
    ontoggle(eventData: common.EventData) {
        this.$emit("toggle", eventData);
    }
    onchange(eventData: common.EventData) {
        this.$emit("change", eventData);
    }
    ondrag(event: DragEvent) {
        if (!this.draggable) {
            return;
        }
        common.ondrag(event.pageY, this.dropTarget, this.data);
    }
    ondragstart(event: DragEvent) {
        if (!this.draggable) {
            return;
        }
        this.dragTarget = event.target as HTMLElement;
        this.dropTarget = event.target as HTMLElement;
    }
    ondragend(event: DragEvent) {
        if (!this.draggable) {
            return;
        }
        this.dragTarget = null;
        for (const tree of this.data) {
            common.clearMarkerOfTree(tree);
        }
    }
    ondragover(event: DragEvent) {
        if (!this.canDrop(event)) {
            return;
        }
        event.preventDefault();
    }
    ondragenter(event: DragEvent) {
        if (!this.canDrop(event)) {
            return;
        }
        this.dropTarget = event.target as HTMLElement;
    }
    ondragleave(event: DragEvent) {
        if (!this.canDrop(event)) {
            return;
        }
        if (event.target === this.dropTarget) {
            this.dropTarget = null;
        }
        common.ondragleave(event.target as HTMLElement, this.data);
    }
    ondrop(event: DragEvent) {
        if (!this.canDrop(event)) {
            return;
        }
        common.ondrop(event.target as HTMLElement, this.dragTarget, this.data, dropData => {
            this.$emit("drop", dropData);
        });
    }
}

Vue.component("tree", Tree);
