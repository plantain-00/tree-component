import { Component, Input, Output, EventEmitter } from "@angular/core";
import * as common from "./common";

@Component({
    selector: "node",
    template: `
    <li role="treeitem" [class]="nodeClassName">
        <i class="jstree-icon jstree-ocl" role="presentation" (click)="ontoggle()"></i><a [class]="anchorClassName" href="javascript:void(0)" (click)="onchange()" (dblclick)="ontoggle()" (mouseenter)="hover(true)" (mouseleave)="hover(false)"><i *ngIf="checkbox" [class]="checkboxClassName" role="presentation"></i><i class="jstree-icon jstree-themeicon" role="presentation"></i>{{data.text}}</a>
        <ul *ngIf="data.children" role="group" class="jstree-children">
            <node *ngFor="let child of data.children; let i = index"
                [data]="child"
                [last]="i === data.children.length - 1"
                [checkbox]="checkbox"
                [path]="geChildPath(i)"
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
    checkbox: boolean;
    @Input()
    path: number[];

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
        <ul class="jstree-container-ul jstree-children" role="group">
            <node *ngFor="let child of data; let i = index"
                [data]="child"
                [last]="i === data.length - 1"
                [checkbox]="checkbox"
                [path]="[i]"
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

    @Output()
    toggle = new EventEmitter<common.EventData>();
    @Output()
    change = new EventEmitter<common.EventData>();

    get rootClassName() {
        return common.getRootClassName(this.checkbox);
    }

    ontoggle(eventData: common.EventData) {
        this.toggle.emit(eventData);
    }
    onchange(eventData: common.EventData) {
        this.change.emit(eventData);
    }
}
