[![Dependency Status](https://david-dm.org/plantain-00/tree-component.svg)](https://david-dm.org/plantain-00/tree-component)
[![devDependency Status](https://david-dm.org/plantain-00/tree-component/dev-status.svg)](https://david-dm.org/plantain-00/tree-component#info=devDependencies)
[![Build Status: Linux](https://travis-ci.org/plantain-00/tree-component.svg?branch=master)](https://travis-ci.org/plantain-00/tree-component)
[![Build Status: Windows](https://ci.appveyor.com/api/projects/status/github/plantain-00/tree-component?branch=master&svg=true)](https://ci.appveyor.com/project/plantain-00/tree-component/branch/master)
[![npm version](https://badge.fury.io/js/tree-component.svg)](https://badge.fury.io/js/tree-component)
[![Downloads](https://img.shields.io/npm/dm/tree-component.svg)](https://www.npmjs.com/package/tree-component)

# tree-component
A reactjs, angular and vuejs tree component.

#### features

+ vuejs component
+ reactjs component
+ angular component
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
+ contextmenu(vuejs and reactjs only)
+ node id
+ custom node(vuejs and reactjs only)

#### install

`npm i tree-component`

#### link css

```html
<link rel="stylesheet" href="./node_modules/tree-component/tree.min.css" />
```

#### vuejs component demo

`npm i vue vue-class-component`

```ts
import "tree-component/vue";
```

```html
<tree :data="data"
    @toggle="toggle($event)"
    @change="change($event)">
</tree>
```

the online demo: https://plantain-00.github.io/tree-component/demo/vue/index.html

#### reactjs component demo

```ts
import { Tree } from "tree-component/react";
```

```html
<Tree data={data}
    toggle={this.toggle}
    change={this.change}>
</Tree>
```

the online demo: https://plantain-00.github.io/tree-component/demo/react/index.html

#### angular component demo

```ts
import { TreeModule } from "tree-component/angular";

@NgModule({
    imports: [BrowserModule, FormsModule, TreeModule],
    declarations: [MainComponent],
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
zindex | number? | z-index of contextmenu
preid | string? | the node id prefix, eg: if `preid = "test_"`, then a node's id can be `test_1-2-3`
toggle | (eventData: [EventData](#event-data-structure)) => void | triggered when opening or closing a node
change | (eventData: [EventData](#event-data-structure)) => void | triggered when selecting or deselecting a node
drop | (dropData: [DropData](#drop-data-structure)) => void | triggered when drag a node, then drop it

#### tree data structure

```ts
type TreeData<T = any> = {
    text?: string;
    value?: T; // anything attached to the node
    icon?: string | false; // the icon class string, or no icon if is false
    state: TreeNodeState;
    children?: TreeData<T>[];
    contextmenu?: string | Function; // the contextmenu component, props: (data: ContextMenuData<T>)
    component?: string | Function; // the node component, props: (data: TreeData<T>)
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
type EventData<T = any> = {
    data: TreeData<T>; // the data of the node that triggered the event
    path: number[]; // the index array of path from root to the node that triggered the event
};
```

#### drop data structure

```ts
type DropData<T = any> = {
    sourceData: TreeData<T>;
    sourcePath: number[];
    targetData: TreeData<T>;
    targetPath: number[];
};
```

#### contextmenu data structure

```ts
type ContextMenuData<T = any> = {
    data: TreeData<T>;
    path: number[];
    root: TreeData<T>[];
    parent?: any;
};
```

#### changelogs

##### v2

```ts
// v3
import "tree-component/vue";
import { TreeComponent, NodeComponent } from "tree-component/angular";
import { Tree } from "tree-component/react";

// v2
import "tree-component/dist/vue";
import { TreeComponent, NodeComponent } from "tree-component/dist/angular";
import { Tree } from "tree-component/dist/react";
```

```
// v2:
<link rel="stylesheet" href="./node_modules/tree-component/tree.min.css" />

// v1:
<link rel="stylesheet" href="./node_modules/jstree/dist/themes/default/style.min.css" />
```
