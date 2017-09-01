import "core-js/es6";
import "core-js/es7/reflect";
import "zone.js/dist/zone";

import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { enableProdMode, Component, NgModule } from "@angular/core";

enableProdMode();

import { data, clearSelectionOfTree, toggle, setSelectionOfTree, setParentsSelection, move, canMove, Value } from "../common";

@Component({
    selector: "app",
    template: `
    <div>
        <a href="https://github.com/plantain-00/tree-component/tree/master/demo/angular/index.ts" target="_blank">the source code of the demo</a>
        <br/>
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
            [dropAllowed]="dropAllowed"
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
        <hr/>
        node id:
        <tree [data]="data9"
            preid="test_"
            (toggle)="ontoggle9($event)"></tree>
    </div>
    `,
})
class MainComponent {
    data = data;
    selectedId: number | null = null;
    data2 = JSON.parse(JSON.stringify(data));
    data3 = JSON.parse(JSON.stringify(data));
    data4 = JSON.parse(JSON.stringify(data));
    data5 = JSON.parse(JSON.stringify(data));
    data6 = JSON.parse(JSON.stringify(data));
    data7 = JSON.parse(JSON.stringify(data));
    data9 = JSON.parse(JSON.stringify(data));
    dropAllowed = canMove;
    ontoggle(eventData: EventData<Value>) {
        toggle(eventData);
    }
    onchange(eventData: EventData<Value>) {
        this.selectedId = eventData.data.state.selected ? null : eventData.data.value!.id;
        if (!eventData.data.state.selected) {
            for (const child of this.data) {
                clearSelectionOfTree(child);
            }
        }
        eventData.data.state.selected = !eventData.data.state.selected;
    }
    ontoggle2(eventData: EventData<Value>) {
        toggle(eventData);
    }
    onchange2(eventData: EventData<Value>) {
        setSelectionOfTree(eventData.data, !eventData.data.state.selected);
        setParentsSelection(this.data2, eventData.path);
    }
    ontoggle3(eventData: EventData<Value>) {
        toggle(eventData);
    }
    drop3(dropData: DropData<Value>) {
        move(dropData, this.data3);
    }
    ontoggle4(eventData: EventData<Value>) {
        toggle(eventData);
    }
    ontoggle5(eventData: EventData<Value>) {
        toggle(eventData);
    }
    ontoggle6(eventData: EventData<Value>) {
        toggle(eventData);
    }
    ontoggle7(eventData: EventData<Value>) {
        toggle(eventData);
    }
    onchange7(eventData: EventData<Value>) {
        setSelectionOfTree(eventData.data, !eventData.data.state.selected);
        setParentsSelection(this.data7, eventData.path);
    }
    drop7(dropData: DropData<Value>) {
        move(dropData, this.data7);
    }
    toggle9(eventData: EventData<Value>) {
        toggle(eventData);
    }
}

import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { TreeModule, EventData, DropData } from "../../dist/angular";

@NgModule({
    imports: [BrowserModule, FormsModule, TreeModule],
    declarations: [MainComponent],
    bootstrap: [MainComponent],
})
class MainModule { }

platformBrowserDynamic().bootstrapModule(MainModule);
