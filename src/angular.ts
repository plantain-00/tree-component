import { Component, Input, Output, EventEmitter, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import * as common from "./common";
export * from "./common";
import { angularNodeTemplateHtml, angularTreeTemplateHtml } from "./angular-variables";

/**
 * @public
 */
@Component({
    selector: "node",
    template: angularNodeTemplateHtml,
})
export class NodeComponent<T> {
    @Input()
    data: common.TreeData<T>;
    @Input()
    last: boolean;
    @Input()
    checkbox?: boolean;
    @Input()
    path: number[];
    @Input()
    draggable?: boolean;
    @Input()
    preid?: string;

    @Output()
    toggle = new EventEmitter<common.EventData<T>>();
    @Output()
    change = new EventEmitter<common.EventData<T>>();

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
    get id() {
        return common.getId(this.path, this.preid);
    }

    geChildPath(index: number) {
        return this.path.concat(index);
    }

    hover(hovered: boolean) {
        this.hovered = hovered;
    }
    ontoggle(eventData?: common.EventData<T>) {
        if (eventData) {
            this.toggle.emit(eventData);
        } else {
            if (this.data.state.openable || this.data.children.length > 0) {
                this.toggle.emit(this.eventData);
            }
        }
    }
    onchange(eventData?: common.EventData<T>) {
        if (eventData) {
            this.change.emit(eventData);
        } else {
            if (this.data.state.disabled) {
                return;
            }

            this.doubleClick.onclick(() => {
                this.change.emit(this.eventData);
            });
        }
    }
}

/**
 * @public
 */
@Component({
    selector: "tree",
    template: angularTreeTemplateHtml,
})
export class TreeComponent<T> {
    @Input()
    data: common.TreeData<T>[];
    @Input()
    checkbox?: boolean;
    @Input()
    draggable?: boolean;
    @Input()
    nodots?: boolean;
    @Input()
    size?: string;
    @Input()
    theme?: string;
    @Input()
    dropAllowed?: (dropData: common.DropData<T>) => boolean;
    @Input()
    preid?: string;

    @Output()
    toggle = new EventEmitter<common.EventData<T>>();
    @Output()
    change = new EventEmitter<common.EventData<T>>();
    @Output()
    drop = new EventEmitter<common.DropData<T>>();

    private dragTarget: HTMLElement | null = null;
    private dropTarget: HTMLElement | null = null;

    get rootClassName() {
        return common.getRootClassName(this.checkbox, this.size, this.theme);
    }
    get containerClassName() {
        return common.getContainerClassName(this.nodots);
    }

    ontoggle(eventData: common.EventData<T>) {
        this.toggle.emit(eventData);
    }
    onchange(eventData: common.EventData<T>) {
        this.change.emit(eventData);
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
        event.stopPropagation();
        if (!this.canDrop(event)) {
            return;
        }
        common.ondrop(event.target as HTMLElement, this.dragTarget, this.data, dropData => {
            this.drop.emit(dropData);
        });
    }
    private canDrop(event: DragEvent) {
        return this.draggable && event.target && (event.target as HTMLElement).dataset && (event.target as HTMLElement).dataset.path;
    }
}

/**
 * @public
 */
@NgModule({
    declarations: [
        TreeComponent,
        NodeComponent,
    ],
    imports: [
        CommonModule,
    ],
    exports: [
        TreeComponent,
        NodeComponent,
    ],
})
export class TreeModule { }
