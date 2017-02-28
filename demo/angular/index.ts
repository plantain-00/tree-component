import "core-js/es6";
import "core-js/es7/reflect";
import "zone.js/dist/zone";

import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { enableProdMode } from "@angular/core";

enableProdMode();

import { Component } from "@angular/core";

import { data, clearSelectionOfTree, toggle, setSelectionOfTree, setParentsSelection, copy } from "../common";
import * as common from "../../dist/common";

@Component({
    selector: "app",
    template: `
    default:
    <tree [data]="data"
        (toggle)="ontoggle($event)"
        (change)="onchange($event)"></tree>
    selected id: {{selectedId}}
    <hr/>
    checkbox:
    <tree [data]="data2"
        [checkbox]="true"
        (toggle)="ontoggle2($event)"
        (change)="onchange2($event)"></tree>
    <hr/>
    draggable:
    <tree [data]="data3"
        [draggable]="true"
        (toggle)="ontoggle3($event)"
        (drop)="drop3($event)"></tree>
    <hr/>
    no dots:
    <tree [data]="data4"
        [nodots]="true"
        (toggle)="ontoggle4($event)"></tree>
    <hr/>
    large:
    <tree [data]="data5"
        size="large"
        (toggle)="ontoggle5($event)"></tree>
    <hr/>
    small:
    <tree [data]="data6"
        size="small"
        (toggle)="ontoggle6($event)"></tree>
    <hr/>
    dark theme:
    <tree [data]="data7"
        theme="dark"
        [checkbox]="true"
        [draggable]="true"
        (toggle)="ontoggle7($event)"
        (change)="onchange7($event)"
        (drop)="drop7($event)"></tree>
    `,
})
export class MainComponent {
    data = data;
    selectedId: number | null = null;
    data2 = JSON.parse(JSON.stringify(data));
    data3 = JSON.parse(JSON.stringify(data));
    data4 = JSON.parse(JSON.stringify(data));
    data5 = JSON.parse(JSON.stringify(data));
    data6 = JSON.parse(JSON.stringify(data));
    data7 = JSON.parse(JSON.stringify(data));
    ontoggle(eventData: common.EventData) {
        toggle(eventData);
    }
    onchange(eventData: common.EventData) {
        this.selectedId = eventData.data.state.selected ? null : eventData.data.value.id;
        if (!eventData.data.state.selected) {
            for (const child of this.data) {
                clearSelectionOfTree(child);
            }
        }
        eventData.data.state.selected = !eventData.data.state.selected;
    }
    ontoggle2(eventData: common.EventData) {
        toggle(eventData);
    }
    onchange2(eventData: common.EventData) {
        setSelectionOfTree(eventData.data, !eventData.data.state.selected);
        setParentsSelection(this.data2, eventData.path);
    }
    ontoggle3(eventData: common.EventData) {
        toggle(eventData);
    }
    drop3(dropData: common.DropData) {
        copy(dropData, this.data3);
    }
    ontoggle4(eventData: common.EventData) {
        toggle(eventData);
    }
    ontoggle5(eventData: common.EventData) {
        toggle(eventData);
    }
    ontoggle6(eventData: common.EventData) {
        toggle(eventData);
    }
    ontoggle7(eventData: common.EventData) {
        toggle(eventData);
    }
    onchange7(eventData: common.EventData) {
        setSelectionOfTree(eventData.data, !eventData.data.state.selected);
        setParentsSelection(this.data7, eventData.path);
    }
    drop7(dropData: common.DropData) {
        copy(dropData, this.data7);
    }
}

import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { NodeComponent, TreeComponent } from "../../dist/angular";

@NgModule({
    imports: [BrowserModule, FormsModule],
    declarations: [MainComponent, NodeComponent, TreeComponent],
    bootstrap: [MainComponent],
})
class MainModule { }

platformBrowserDynamic().bootstrapModule(MainModule);
