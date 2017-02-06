import { Component, Input, Output, EventEmitter } from "@angular/core";
import * as common from "./common";

@Component({
    selector: "node",
    template: `
    <li role="treeitem" [class]="nodeClassName">
        <i class="jstree-icon jstree-ocl" role="presentation" (click)="ontoggle()"></i><a [class]="anchorClassName" href="javascript:void(0)" (click)="onchange()" (mouseenter)="hover(true)" (mouseleave)="hover(false)"><i class="jstree-icon jstree-themeicon" role="presentation"></i>{{data.text}}</a>
        <ul *ngIf="data.children" role="group" class="jstree-children">
            <node *ngFor="let child of data.children; let i = index"
                [data]="child"
                [last]="i === data.children.length - 1"
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

    @Output()
    toggle = new EventEmitter<common.EventData>();
    @Output()
    change = new EventEmitter<common.EventData>();

    hovered = false;
    doubleClick = new common.DoubleClick();

    get nodeClassName() {
        const values = ["jstree-node"];
        if (this.data.children && this.data.children.length > 0) {
            if (this.data.state.opened) {
                values.push("jstree-open");
            } else {
                values.push("jstree-closed");
            }
        } else {
            values.push("jstree-leaf");
        }
        if (this.last) {
            values.push("jstree-last");
        }
        return values.join(" ");
    }

    get anchorClassName() {
        const values = ["jstree-anchor"];
        if (this.data.state.selected) {
            values.push("jstree-clicked");
        }
        if (this.data.state.disabled) {
            values.push("jstree-disabled");
        }
        if (this.hovered) {
            values.push("jstree-hovered");
        }
        return values.join(" ");
    }

    hover(hovered: boolean) {
        this.hovered = hovered;
    }
    ontoggle(eventData?: common.EventData) {
        if (eventData) {
            this.toggle.emit(eventData);
        } else {
            if (this.data.children && this.data.children.length > 0) {
                this.toggle.emit({ data: this.data });
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
                this.ontoggle(eventData);
            }, () => {
                this.change.emit({ data: this.data });
            });
        }
    }
}

@Component({
    selector: "tree",
    template: `
    <div class="jstree jstree-default jstree-default-dark" role="tree">
        <ul class="jstree-container-ul jstree-children" role="group">
            <node *ngFor="let child of data; let i = index"
                [data]="child"
                [last]="i === data.length - 1"
                (toggle)="ontoggle($event)"
                (change)="onchange($event)"></node>
        </ul>
    </div>
    `,
})
export class TreeComponent {
    @Input()
    data: common.TreeData[];

    @Output()
    toggle = new EventEmitter<common.EventData>();
    @Output()
    change = new EventEmitter<common.EventData>();

    ontoggle(eventData: common.EventData) {
        this.toggle.emit(eventData);
    }
    onchange(eventData: common.EventData) {
        this.change.emit(eventData);
    }
}
