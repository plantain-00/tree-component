[![Dependency Status](https://david-dm.org/plantain-00/tree-component.svg)](https://david-dm.org/plantain-00/tree-component)
[![devDependency Status](https://david-dm.org/plantain-00/tree-component/dev-status.svg)](https://david-dm.org/plantain-00/tree-component#info=devDependencies)
[![Build Status](https://travis-ci.org/plantain-00/tree-component.svg?branch=master)](https://travis-ci.org/plantain-00/tree-component)
[![npm version](https://badge.fury.io/js/tree-component.svg)](https://badge.fury.io/js/tree-component)
[![Downloads](https://img.shields.io/npm/dm/tree-component.svg)](https://www.npmjs.com/package/tree-component)

# tree-component
A reactjs, angular and vuejs tree component.

#### install

`npm i tree-component`

#### link css

```html
<link rel="stylesheet" href="./node_modules/tree-component/dist/tree.min.css" />
```

#### vuejs component demo

`npm i vue vue-class-component`

```ts
import "tree-component/dist/vue";
```

```html
<tree :data="data"
    @toggle="toggle(arguments[0])"
    @change="change(arguments[0])">
</tree>
```

the online demo: https://plantain-00.github.io/tree-component/demo/vue/index.html

the source code of the demo: https://github.com/plantain-00/tree-component/tree/master/demo/vue

#### reactjs component demo

```ts
import { Tree } from "tree-component/dist/react";
```

```html
<Tree data={data}
    toggle={this.toggle}
    change={this.change}>
</Tree>
```

the online demo: https://plantain-00.github.io/tree-component/demo/react/index.html

the source code of the demo: https://github.com/plantain-00/tree-component/tree/master/demo/react

#### angular component demo

```ts
import { TreeComponent, NodeComponent } from "tree-component/dist/angular";

@NgModule({
    imports: [BrowserModule, FormsModule],
    declarations: [MainComponent, TreeComponent, NodeComponent],
    bootstrap: [MainComponent],
})
class MainModule { }
```

```html
<tree [data]="data"
    (toggle)="toggle($event)"
    (change)="change($event)">
</tree>
```

the online demo: https://plantain-00.github.io/tree-component/demo/angular/index.html

the source code of the demo: https://github.com/plantain-00/tree-component/tree/master/demo/angular

#### properties and events of the component

name | type | description
--- | --- | ---
data | [TreeData](#tree-data-structure)[] | the data of the tree
checkbox | boolean? | show checkbox for node
draggable | boolean? | whether the node is draggable
nodots | boolean? | the tree will have no dots
size | string? | can also be "large", "small"
theme | string? | can be "default"(the default theme), "dark"
dropAllowed | (dropData: common.DropData) => boolean | optional, a function to show whether the drop action is allowed
toggle | (eventData: [EventData](#event-data-structure)) => void | triggered when opening or closing a node
change | (eventData: [EventData](#event-data-structure)) => void | triggered when selecting or deselecting a node
drop | (dropData: [DropData](#drop-data-structure)) => void | triggered when drag a node, then drop it

#### tree data structure

```ts
type TreeData = {
    text: string;
    value?: any; // anything attached to the node
    icon?: string | false; // the icon class string, or no icon if is false
    state: TreeNodeState;
    children?: TreeData[];
};

type TreeNodeState = {
    opened: boolean; // whether the node show its children
    selected: boolean;
    disabled: boolean; // disabled node can not be selected and deselected
    loading: boolean; // show the loading icon, usually used when loading child nodes
    highlighted: boolean;
    openable: boolean; // can open or close even no children
    dropPosition: DropPosition;
    dropAllowed: boolean; // whether the drop action is allowed
};

enum DropPosition {
    empty,
    up,
    inside,
    down,
}
```

#### event data structure

```ts
type EventData = {
    data: TreeData; // the data of the node that triggered the event
    path: number[]; // the index array of path from root to the node that triggered the event
};
```

#### drop data structure

```ts
type DropData = {
    sourceData: TreeData;
    sourcePath: number[];
    targetData: TreeData;
    targetPath: number[];
};
```

#### features

+ vuejs component
+ reactjs component
+ angular component
+ commonjs module
+ open and close
+ select and deselect
+ disabled
+ loading
+ highlighted
+ checkbox
+ custom icon or no icon
+ drag and drop
+ no dots
+ large and small
+ default and dark theme

#### changelogs

##### v2

```
// v1:
<link rel="stylesheet" href="./node_modules/jstree/dist/themes/default/style.min.css" />

// v2:
<link rel="stylesheet" href="./node_modules/tree-component/dist/tree.min.css" />
```
