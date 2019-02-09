import { Component } from '@angular/core'

import { EventData, DropData } from '../dist/'

import { data, clearSelectionOfTree, toggle, setSelectionOfTree, setParentsSelection, move, canMove, Value } from 'tree-component/demo'

@Component({
  selector: 'app',
  template: `
    <div>
        <a href="https://github.com/plantain-00/tree-component/tree/master/packages/angular/demo" target="_blank">the source code of the demo</a>
        <br/>
        default:
        <div class="default">
            <tree [data]="data"
                (toggle)="ontoggle($event)"
                (change)="onchange($event)"></tree>
        </div>
        selected id: {{selectedId}}
        <hr/>
        checkbox:
        <div class="checkbox">
            <tree [data]="data2"
                [checkbox]="true"
                (toggle)="ontoggle2($event)"
                (change)="onchange2($event)"></tree>
        </div>
        <hr/>
        draggable:
        <div class="draggable">
            <tree [data]="data3"
                [draggable]="true"
                [dropAllowed]="dropAllowed"
                [dragTarget]="dragTarget"
                (toggle)="ontoggle3($event)"
                (drop)="drop3($event)"
                (changeDragTarget)="changeDragTarget($event)"></tree>
        </div>
        <hr/>
        draggable 2:
        <div class="draggable">
            <tree [data]="data10"
                [draggable]="true"
                [dropAllowed]="dropAllowed"
                [dragTarget]="dragTarget"
                (toggle)="ontoggle10($event)"
                (drop)="drop10($event)"
                (changeDragTarget)="changeDragTarget($event)"></tree>
        </div>
        <hr/>
        no dots:
        <div class="no-dots">
            <tree [data]="data4"
                [nodots]="true"
                (toggle)="ontoggle4($event)"></tree>
        </div>
        <hr/>
        large:
        <div class="large">
            <tree [data]="data5"
                size="large"
                (toggle)="ontoggle5($event)"></tree>
        </div>
        <hr/>
        small:
        <div class="small">
            <tree [data]="data6"
                size="small"
                (toggle)="ontoggle6($event)"></tree>
        </div>
        <hr/>
        dark theme:
        <div class="dark-theme">
            <tree [data]="data7"
                theme="dark"
                [checkbox]="true"
                [draggable]="true"
                (toggle)="ontoggle7($event)"
                (change)="onchange7($event)"
                (drop)="drop7($event)"></tree>
        </div>
        <hr/>
        node id:
        <div class="node-id">
            <tree [data]="data9"
                preid="test_"
                (toggle)="ontoggle9($event)"></tree>
        </div>
    </div>
    `
})
export class MainComponent {
  data = data as any
  selectedId: number | null = null
  data2 = JSON.parse(JSON.stringify(data))
  data3 = JSON.parse(JSON.stringify(data))
  data4 = JSON.parse(JSON.stringify(data))
  data5 = JSON.parse(JSON.stringify(data))
  data6 = JSON.parse(JSON.stringify(data))
  data7 = JSON.parse(JSON.stringify(data))
  data9 = JSON.parse(JSON.stringify(data))
  data10 = JSON.parse(JSON.stringify(data))
  dropAllowed = canMove
  dragTarget: HTMLElement | null = null

  changeDragTarget(dragTarget: HTMLElement | null) {
    this.dragTarget = dragTarget
  }
  ontoggle(eventData: EventData<Value>) {
    toggle(eventData)
  }
  onchange(eventData: EventData<Value>) {
    this.selectedId = eventData.data.state.selected ? null : eventData.data.value!.id
    if (!eventData.data.state.selected) {
      for (const child of this.data) {
        clearSelectionOfTree(child)
      }
    }
    eventData.data.state.selected = !eventData.data.state.selected
  }
  ontoggle2(eventData: EventData<Value>) {
    toggle(eventData)
  }
  onchange2(eventData: EventData<Value>) {
    setSelectionOfTree(eventData.data, !eventData.data.state.selected)
    setParentsSelection(this.data2, eventData.path)
  }
  ontoggle3(eventData: EventData<Value>) {
    toggle(eventData)
  }
  drop3(dropData: DropData<Value>) {
    move(dropData, this.data3)
  }
  ontoggle4(eventData: EventData<Value>) {
    toggle(eventData)
  }
  ontoggle5(eventData: EventData<Value>) {
    toggle(eventData)
  }
  ontoggle6(eventData: EventData<Value>) {
    toggle(eventData)
  }
  ontoggle7(eventData: EventData<Value>) {
    toggle(eventData)
  }
  onchange7(eventData: EventData<Value>) {
    setSelectionOfTree(eventData.data, !eventData.data.state.selected)
    setParentsSelection(this.data7, eventData.path)
  }
  drop7(dropData: DropData<Value>) {
    move(dropData, this.data7)
  }
  ontoggle9(eventData: EventData<Value>) {
    toggle(eventData)
  }
  ontoggle10(eventData: EventData<Value>) {
    toggle(eventData)
  }
  drop10(dropData: DropData<Value>) {
    move(dropData, this.data10)
  }
}
