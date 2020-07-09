# tree-component

[![Dependency Status](https://david-dm.org/plantain-00/tree-component.svg)](https://david-dm.org/plantain-00/tree-component)
[![devDependency Status](https://david-dm.org/plantain-00/tree-component/dev-status.svg)](https://david-dm.org/plantain-00/tree-component#info=devDependencies)
[![Build Status: Linux](https://travis-ci.org/plantain-00/tree-component.svg?branch=master)](https://travis-ci.org/plantain-00/tree-component)
[![Build Status: Windows](https://ci.appveyor.com/api/projects/status/github/plantain-00/tree-component?branch=master&svg=true)](https://ci.appveyor.com/project/plantain-00/tree-component/branch/master)
![Github CI](https://github.com/plantain-00/tree-component/workflows/Github%20CI/badge.svg)
[![npm version](https://badge.fury.io/js/tree-component.svg)](https://badge.fury.io/js/tree-component)
[![Downloads](https://img.shields.io/npm/dm/tree-component.svg)](https://www.npmjs.com/package/tree-component)
[![type-coverage](https://img.shields.io/badge/dynamic/json.svg?label=type-coverage&prefix=%E2%89%A5&suffix=%&query=$.typeCoverage.atLeast&uri=https%3A%2F%2Fraw.githubusercontent.com%2Fplantain-00%2Ftree-component%2Fmaster%2Fpackage.json)](https://github.com/plantain-00/tree-component)

A reactjs and vuejs tree component.

## features

+ vuejs component
+ reactjs component
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
+ drag and drop between different tree
+ composition model(reactjs children and vuejs slot)

## link css

```html
<link rel="stylesheet" href="./node_modules/tree-component/dist/tree.min.css" />
```

## vuejs component

[![gzip size](https://img.badgesize.io/https://unpkg.com/tree-vue-component?compression=gzip)](https://unpkg.com/tree-vue-component)

`npm i tree-vue-component`

```ts
import "tree-vue-component";
```

or

```html
<script src="./node_modules/vue/dist/vue.min.js"></script>
<script src="./node_modules/vue-class-component/dist/vue-class-component.min.js"></script>
<script src="./node_modules/tree-vue-component/dist/tree-vue-component.min.js"></script>
```

```html
<tree :data="data"
    @toggle="toggle($event)"
    @change="change($event)">
</tree>
```

the online demo: <https://plantain-00.github.io/tree-component/packages/vue/demo>

## reactjs component

[![gzip size](https://img.badgesize.io/https://unpkg.com/tree-react-component?compression=gzip)](https://unpkg.com/tree-react-component)

`npm i tree-react-component`

```ts
import { Tree } from "tree-react-component";
```

or

```html
<script src="./node_modules/react/umd/react.production.min.js"></script>
<script src="./node_modules/react-dom/umd/react-dom.production.min.js"></script>
<script src="./node_modules/tree-react-component/dist/tree-react-component.min.js"></script>
```

```html
<Tree data={data}
    toggle={this.toggle}
    change={this.change}>
</Tree>
```

the online demo: <https://plantain-00.github.io/tree-component/packages/react/demo>

## properties and events of the component

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
dragTarget | [DragTargetData](#drag-target-data-structure) | drag target, used when drag and drop between different tree
changeDragTarget | (dragTarget: [DragTargetData](#drag-target-data-structure)) => void | triggered when drag target changed

## tree data structure

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

const enum DropPosition {
    empty,
    up,
    inside,
    down,
}
// For javascript users, the enum type can not imported from the package,
// it is just number(0,1,2,3 in order), so you can use this instead:
const DropPosition = {
    empty: 0,
    up: 1,
    inside: 2,
    down: 3
}
```

## event data structure

```ts
type EventData<T = any> = {
    data: TreeData<T>; // the data of the node that triggered the event
    path: number[]; // the index array of path from root to the node that triggered the event
};
```

## drop data structure

```ts
type DropData<T = any> = {
    sourceData: TreeData<T>;
    sourcePath: number[];
    sourceRoot: TreeData<T>[];
    targetData: TreeData<T>;
    targetPath: number[];
};
```

## contextmenu data structure

```ts
type ContextMenuData<T = any> = {
    data: TreeData<T>;
    path: number[];
    root: TreeData<T>[];
    parent?: any;
};
```

## drag target data structure

```ts
type DragTargetData<T = any> = {
  root: TreeData<T>[];
  target: HTMLElement;
} | null
```

## changelogs

```bash
# v4
npm i tree-component

# v5
npm i tree-vue-component
npm i tree-react-component
npm i tree-angular-component
```

```ts
// v4
import "tree-component/vue";
import { Tree } from "tree-component/react";
import { TreeModule } from "tree-component/angular";

// v5
import "tree-vue-component";
import { Tree } from "tree-react-component";
import { TreeModule } from "tree-angular-component";
```

```html
// v4
<link rel="stylesheet" href="./node_modules/tree-component/tree.min.css" />

// v5
<link rel="stylesheet" href="./node_modules/tree-component/dist/tree.min.css" />
```

```ts
// v3 angular AOT:
import { TreeModule } from "tree-component/angular";

// v4 angular AOT:
import { TreeModule } from "tree-component/aot/angular";
```

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

```html
// v2:
<link rel="stylesheet" href="./node_modules/tree-component/tree.min.css" />

// v1:
<link rel="stylesheet" href="./node_modules/jstree/dist/themes/default/style.min.css" />
```
