import { TreeData, TreeNodeState, EventData, DropPosition, DropData, getNodeFromPath } from "../dist/common";

const rawData: Data[] = [
    {
        text: "node 1",
        value: { id: 1 },
        state: {
            opened: true,
        },
        children: [
            {
                text: "node 11",
                value: { id: 11 },
            },
            {
                text: "node 12",
                value: { id: 12 },
                state: {
                    opened: true,
                },
                children: [
                    {
                        text: "node 121",
                        value: { id: 121 },
                    },
                    {
                        text: "node 122",
                        value: { id: 122 },
                    },
                    {
                        text: "node 123",
                        value: { id: 123 },
                    },
                ],
            },
        ],
    },
    {
        text: "loading node 2",
        value: { id: 2 },
        state: {
            openable: true,
        },
    },
];

const rawExtraData: Data[] = [
    {
        text: "node 21",
        value: { id: 21 },
    },
    {
        text: "disabled node 22",
        value: { id: 22 },
        state: {
            disabled: true,
        },
    },
    {
        text: "no icon node 23",
        value: { id: 23 },
        icon: false,
    },
    {
        text: "custom icon node 24",
        value: { id: 24 },
        icon: "my-custom-icon",
    },
    {
        text: "file icon node 25",
        value: { id: 25 },
        icon: "tree-file",
    },
    {
        text: "custom node 26",
        value: { id: 26 },
    },
    {
        text: "highlighted node 27",
        value: { id: 27 },
        state: {
            highlighted: true,
            openable: true,
        },
    },
];

function standardize(treeData: Data) {
    if (treeData.state === undefined) {
        treeData.state = {};
    }
    if (treeData.state.opened === undefined) {
        treeData.state.opened = false;
    }
    if (treeData.state.selected === undefined) {
        treeData.state.selected = false;
    }
    if (treeData.state.disabled === undefined) {
        treeData.state.disabled = false;
    }
    if (treeData.state.loading === undefined) {
        treeData.state.loading = false;
    }
    if (treeData.state.highlighted === undefined) {
        treeData.state.highlighted = false;
    }
    if (treeData.state.openable === undefined) {
        treeData.state.openable = false;
    }
    if (treeData.state.dropPosition === undefined) {
        treeData.state.dropPosition = DropPosition.empty;
    }
    if (treeData.state.dropAllowed === undefined) {
        treeData.state.dropAllowed = true;
    }
    if (treeData.children === undefined) {
        treeData.children = [];
    }
    for (const child of treeData.children) {
        standardize(child);
    }
}

for (const child of rawData) {
    standardize(child);
}
for (const child of rawExtraData) {
    standardize(child);
}

export const data = rawData as TreeData<Value>[];

export function clearSelectionOfTree(tree: TreeData<Value>) {
    if (tree.state.selected) {
        tree.state.selected = false;
    }
    if (tree.children) {
        for (const child of tree.children) {
            clearSelectionOfTree(child);
        }
    }
}

// tslint:disable-next-line:ban-types
export function toggle(eventData: EventData<Value>, customComponent?: string | Function, next?: () => void) {
    if (!eventData.data.state.opened && eventData.data.children.length === 0) {
        eventData.data.state.loading = true;
        setTimeout(() => {
            const newExtraData: TreeData[] = JSON.parse(JSON.stringify(rawExtraData));
            eventData.data.children = newExtraData;
            if (customComponent) {
                newExtraData[5].component = customComponent;
            }
            eventData.data.state.loading = false;
            eventData.data.state.opened = !eventData.data.state.opened;
            if (next) {
                next();
            }
        }, 500);
    } else {
        eventData.data.state.opened = !eventData.data.state.opened;
    }
    if (next) {
        next();
    }
}

export function setSelectionOfTree(tree: TreeData<Value>, selected: boolean) {
    if (tree.state.selected !== selected) {
        tree.state.selected = selected;
    }
    if (tree.children) {
        for (const child of tree.children) {
            setSelectionOfTree(child, selected);
        }
    }
}

// tslint:disable-next-line:ban-types
export function setContextMenu(tree: TreeData<Value>, component: string | Function) {
    tree.contextmenu = component;
    if (tree.children) {
        for (const child of tree.children) {
            setContextMenu(child, component);
        }
    }
}

export function setParentsSelection(tree: TreeData<Value>[], path: number[]) {
    const parents: TreeData<Value>[] = [];
    const parentPath = path.slice(0, path.length - 1);
    for (const index of parentPath) {
        if (parents.length === 0) {
            parents.unshift(tree[index]);
        } else {
            parents.unshift(parents[0].children[index]);
        }
    }
    for (const parent of parents) {
        parent.state.selected = parent.children.every(child => child.state.selected);
    }
}

export function canMove(dropData: DropData<Value>) {
    if (dropData.targetPath.length < dropData.sourcePath.length) {
        return true;
    }
    for (let i = 0; i < dropData.sourcePath.length; i++) {
        if (dropData.targetPath[i] !== dropData.sourcePath[i]) {
            return true;
        }
    }
    return dropData.targetData.state.dropPosition !== DropPosition.inside && dropData.targetPath.length === dropData.sourcePath.length;
}

export function move(dropData: DropData<Value>, treeData: TreeData<Value>[]) {
    if (!canMove(dropData)) {
        return;
    }

    const sourceParent = getNodeFromPath(treeData, dropData.sourcePath.slice(0, dropData.sourcePath.length - 1));
    const sourceChildren = sourceParent && sourceParent.children ? sourceParent.children : treeData;
    let sourceIndex = dropData.sourcePath[dropData.sourcePath.length - 1];

    if (dropData.targetData.state.dropPosition === DropPosition.inside) {
        if (dropData.targetData.children) {
            dropData.targetData.children.push(dropData.sourceData);
        } else {
            dropData.targetData.children = [dropData.sourceData];
        }
        dropData.targetData.state.opened = true;
    } else {
        const startIndex = dropData.targetPath[dropData.targetPath.length - 1] + (dropData.targetData.state.dropPosition === DropPosition.up ? 0 : 1);
        const targetParent = getNodeFromPath(treeData, dropData.targetPath.slice(0, dropData.targetPath.length - 1));
        const targetChildren = targetParent && targetParent.children ? targetParent.children : treeData;
        targetChildren.splice(startIndex, 0, dropData.sourceData);

        if (targetChildren === sourceChildren && startIndex < sourceIndex) {
            sourceIndex++;
        }
    }

    sourceChildren.splice(sourceIndex, 1);
}

type Data = {
    text?: string;
    value?: Value;
    icon?: string | false;
    state?: Partial<TreeNodeState>;
    children?: Data[];
    // tslint:disable-next-line:ban-types
    component?: string | Function;
};

export type Value = {
    id: number;
};
