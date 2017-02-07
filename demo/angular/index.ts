import "core-js/es6";
import "core-js/es7/reflect";
import "zone.js/dist/zone";

import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { enableProdMode } from "@angular/core";

enableProdMode();

import { Component } from "@angular/core";

import { data, clearSelectionOfTree, toggle } from "../common";
import * as common from "../../dist/common";

@Component({
    selector: "app",
    template: `
    <tree [data]="data"
        (toggle)="ontoggle($event)"
        (change)="onchange($event)"></tree>
    selected id: {{selectedId}}
    `,
})
export class MainComponent {
    data = data;
    selectedId: number | null = null;
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
