import { Component, Input, Output, EventEmitter } from "@angular/core";
import * as common from "./common";

@Component({
    selector: "node",
    template: `
    <li role="treeitem" [class]="nodeClassName">
        <i class="jstree-icon jstree-ocl" role="presentation" (click)="ontoggle()"></i><a [class]="anchorClassName" href="javascript:void(0)" [draggable]="draggable" (click)="onchange()" (dblclick)="ontoggle()" (mouseenter)="hover(true)" (mouseleave)="hover(false)" [attr.data-path]="pathString"><i *ngIf="checkbox" [class]="checkboxClassName" role="presentation"></i><i *ngIf="data.icon !== false" [class]="iconClassName" role="presentation"></i>{{data.text}}<div *ngIf="hasMarker" [class]="markerClassName">&#160;</div></a>
        <ul *ngIf="data.children" role="group" class="jstree-children">
            <node *ngFor="let child of data.children; let i = index"
                [data]="child"
                [last]="i === data.children.length - 1"
                [checkbox]="checkbox"
                [path]="geChildPath(i)"
                [draggable]="draggable"
                (toggle)="ontoggle($event)"
                (change)="onchange($event)">
            </node>
        </ul>
    </li>
    `,
})
export class NodeComponent {
    @Input()
    data: common.TreeData;
    @Input()
    last: boolean;
    @Input()
    checkbox?: boolean;
    @Input()
    path: number[];
    @Input()
    draggable?: boolean;

    @Output()
    toggle = new EventEmitter<common.EventData>();
    @Output()
    change = new EventEmitter<common.EventData>();

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
            this.toggle.emit(eventData);
        } else {
            if (this.data.children && this.data.children.length > 0) {
                this.toggle.emit({ data: this.data, path: this.path });
            }
        }
    }
    onchange(eventData?: common.EventData) {
        if (eventData) {
            this.change.emit(eventData);
        } else {
            if (this.data.state.disabled) {
                return;
            }

            this.doubleClick.onclick(() => {
                this.change.emit({ data: this.data, path: this.path });
            });
        }
    }
}

@Component({
    selector: "tree",
    template: `
    <div [class]="rootClassName" role="tree">
        <ul class="jstree-container-ul jstree-children" role="group" (drag)="ondrag($event)" (dragstart)="ondragstart($event)" (dragend)="ondragend($event)" (dragover)="ondragover($event)" (dragenter)="ondragenter($event)" (dragleave)="ondragleave($event)" (drop)="ondrop($event)">
            <node *ngFor="let child of data; let i = index"
                [data]="child"
                [last]="i === data.length - 1"
                [checkbox]="checkbox"
                [path]="[i]"
                [draggable]="draggable"
                (toggle)="ontoggle($event)"
                (change)="onchange($event)"></node>
        </ul>
    </div>
    `,
})
export class TreeComponent {
    @Input()
    data: common.TreeData[];
    @Input()
    checkbox?: boolean;
    @Input()
    draggable?: boolean;

    @Output()
    toggle = new EventEmitter<common.EventData>();
    @Output()
    change = new EventEmitter<common.EventData>();
    @Output()
    drop = new EventEmitter<common.DropData>();

    dragTarget: HTMLElement | null = null;
    dropTarget: HTMLElement | null = null;

    get rootClassName() {
        return common.getRootClassName(this.checkbox);
    }

    canDrop(event: DragEvent) {
        return this.draggable && (event.target as HTMLElement).dataset["path"];
    }
    ontoggle(eventData: common.EventData) {
        this.toggle.emit(eventData);
    }
    onchange(eventData: common.EventData) {
        this.change.emit(eventData);
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
        event.stopPropagation();
        if (!this.canDrop(event)) {
            return;
        }
        common.ondrop(event.target as HTMLElement, this.dragTarget, this.data, dropData => {
            this.drop.emit(dropData);
        });
    }
}
