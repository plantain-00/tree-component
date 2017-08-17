import Vue from "vue";
import Component from "vue-class-component";
import * as common from "./common";
export * from "./common";
import { vueNodeTemplateHtml, vueTreeTemplateHtml } from "./vue-variables";

@Component({
    template: vueNodeTemplateHtml,
    props: ["data", "last", "checkbox", "path", "draggable", "root", "zindex", "preid"],
})
class Node<T> extends Vue {
    data: common.TreeData<T>;
    last: boolean;
    checkbox?: boolean;
    path: number[];
    draggable?: boolean;
    root: common.TreeData<T>[];
    zindex?: number;
    preid?: string;

    contextmenuVisible = false;
    contextmenuStyle = {
        "position": "absolute",
        "left": "0px",
        "top": "0px",
        "z-index": typeof this.zindex === "number" ? this.zindex : 1,
    };
    private hovered = false;
    private doubleClick = new common.DoubleClick();

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

    private get eventData(): common.EventData<T> {
        return {
            data: this.data,
            path: this.path,
        };
    }
    get contextmenuData(): common.ContextMenuData<T> {
        return {
            data: this.data,
            path: this.path,
            root: this.root,
        };
    }
    get id() {
        return common.getId(this.path, this.preid);
    }

    geChildPath(index: number) {
        return this.path.concat(index);
    }

    hover(hovered: boolean) {
        this.hovered = hovered;
        if (!hovered) {
            this.contextmenuVisible = false;
        }
    }
    ontoggle(eventData?: common.EventData<T>) {
        if (eventData) {
            this.$emit("toggle", eventData);
        } else {
            if (this.data.state.openable || this.data.children.length > 0) {
                this.$emit("toggle", this.eventData);
            }
        }
    }
    onchange(eventData?: common.EventData<T>) {
        if (eventData) {
            this.$emit("change", eventData);
        } else {
            if (this.data.state.disabled) {
                return;
            }

            this.doubleClick.onclick(() => {
                this.$emit("change", this.eventData);
            });
        }
    }
    oncontextmenu(e: MouseEvent) {
        this.contextmenuVisible = true;
        this.contextmenuStyle.left = e.offsetX + "px";
        this.contextmenuStyle.top = e.offsetY + "px";
        e.preventDefault();
        return false;
    }
}

Vue.component("node", Node);

@Component({
    template: vueTreeTemplateHtml,
    props: ["data", "checkbox", "draggable", "nodots", "size", "theme", "dropAllowed", "zindex", "preid"],
})
class Tree<T> extends Vue {
    data: common.TreeData<T>[];
    checkbox?: boolean;
    draggable?: boolean;
    nodots?: boolean;
    size?: string;
    theme?: string;
    dropAllowed?: (dropData: common.DropData<T>) => boolean;
    zindex?: number;
    preid?: string;

    private dragTarget: HTMLElement | null = null;
    private dropTarget: HTMLElement | null = null;

    get rootClassName() {
        return common.getRootClassName(this.checkbox, this.size, this.theme);
    }
    get containerClassName() {
        return common.getContainerClassName(this.nodots);
    }

    ontoggle(eventData: common.EventData<T>) {
        this.$emit("toggle", eventData);
    }
    onchange(eventData: common.EventData<T>) {
        this.$emit("change", eventData);
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
        common.ondrag(event.pageY, this.dragTarget, this.dropTarget, this.data, this.dropAllowed);
        event.preventDefault();
    }
    ondragenter(event: DragEvent) {
        if (!this.canDrop(event)) {
            return;
        }
        this.dropTarget = event.target as HTMLElement;
        common.ondrag(event.pageY, this.dragTarget, this.dropTarget, this.data, this.dropAllowed);
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
    private canDrop(event: DragEvent) {
        return this.draggable && event.target && (event.target as HTMLElement).dataset && (event.target as HTMLElement).dataset.path;
    }
}

Vue.component("tree", Tree);
