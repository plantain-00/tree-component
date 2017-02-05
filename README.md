[![Dependency Status](https://david-dm.org/plantain-00/tree-component.svg)](https://david-dm.org/plantain-00/tree-component)
[![devDependency Status](https://david-dm.org/plantain-00/tree-component/dev-status.svg)](https://david-dm.org/plantain-00/tree-component#info=devDependencies)
[![Build Status](https://travis-ci.org/plantain-00/tree-component.svg?branch=master)](https://travis-ci.org/plantain-00/tree-component)
[![npm version](https://badge.fury.io/js/tree-component.svg)](https://badge.fury.io/js/tree-component)
[![Downloads](https://img.shields.io/npm/dm/tree-component.svg)](https://www.npmjs.com/package/tree-component)

# tree-component
A reactjs, angular2 and vuejs tree component.

#### install

`npm i tree-component`

#### vuejs component demo

```ts
import "tree-component/dist/vue";
```

```html
<tree :data="data"
    @toggle="toggle(arguments[0])"
    @change="change(arguments[0])"></tree>
```

the online demo: https://plantain-00.github.io/tree-component/demo/vue/index.html

the source code of the demo: https://github.com/plantain-00/tree-component/tree/master/demo/vue

#### properties and events of the component

name | type | description
--- | --- | ---
data | property | the data of the tree, [the structure](#tree-data-structure)
toggle | event | triggered when opening or closing a node, [the structure of first parameter](#event-data-structure)
change | event | triggered when selecting or deselecting a node, [the structure first parameter](#event-data-structure)

#### tree data structure

```ts
type TreeData = {
    text: string;
    value?: any;
    state?: {
        opened?: boolean;
        selected?: boolean;
        disabled?: boolean;
    };
    children?: TreeData[];
};
```

#### event data structure

```ts
type EventData = {
    data: TreeData;
};
```

#### features

+ vuejs component
+ reactjs component
+ angular2 component
