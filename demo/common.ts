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
                text: "disabled node 12",
                value: { id: 12 },
                state: {
                    opened: true,
                    disabled: true,
                },
                children: [
                    {
                        text: "node 121",
                        value: { id: 121 },
                    },
                    {
                        text: "disabled node 122",
                        value: { id: 122 },
                        state: {
                            disabled: true,
                        },
                    },
                    {
                        text: "highlighted node 123",
                        value: { id: 123 },
                        state: {
                            highlighted: true,
                        },
                    },
                ],
            },
        ],
    },
    {
        text: "loading node 2",
        value: { id: 2 },
        children: [
            {
                text: "node 21",
                value: { id: 21 },
            },
            {
                text: "node 22",
                value: { id: 22 },
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
        ],
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
    if (treeData.state.dropPosition === undefined) {
        treeData.state.dropPosition = DropPosition.empty;
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

export const data: TreeData[] = rawData as any;

export function clearSelectionOfTree(tree: TreeData) {
    if (tree.state.selected) {
        tree.state.selected = false;
    }
    if (tree.children) {
        for (const child of tree.children) {
            clearSelectionOfTree(child);
        }
    }
}

export function toggle(eventData: EventData, next?: () => void) {
    if (eventData.data.value.id === 2 && !eventData.data.state.opened) {
        eventData.data.state.loading = true;
        setTimeout(() => {
            eventData.data.state.loading = false;
            eventData.data.state.opened = !eventData.data.state.opened;
            if (next) {
                next();
            }
        }, 1000);
    } else {
        eventData.data.state.opened = !eventData.data.state.opened;
    }
    if (next) {
        next();
    }
}

export function setSelectionOfTree(tree: TreeData, selected: boolean) {
    if (tree.state.selected !== selected) {
        tree.state.selected = selected;
    }
    if (tree.children) {
        for (const child of tree.children) {
            setSelectionOfTree(child, selected);
        }
    }
}

export function setParentsSelection(tree: TreeData[], path: number[]) {
    const parents: TreeData[] = [];
    const parentPath = path.slice(0, path.length - 1);
    for (const index of parentPath) {
        if (parents.length === 0) {
            parents.unshift(tree[index]);
        } else {
            parents.unshift(parents[0].children![index]);
        }
    }
    for (const parent of parents) {
        parent.state.selected = parent.children!.every(child => child.state.selected);
    }
}

export function copy(dropData: DropData, treeData: TreeData[]) {
    if (dropData.targetData.state.dropPosition === DropPosition.inside) {
        if (dropData.targetData.children) {
            dropData.targetData.children.push(JSON.parse(JSON.stringify(dropData.sourceData)));
        } else {
            dropData.targetData.children = [JSON.parse(JSON.stringify(dropData.sourceData))];
        }
        dropData.targetData.state.opened = true;
    } else {
        const startIndex = dropData.targetPath[dropData.targetPath.length - 1] + (dropData.targetData.state.dropPosition === DropPosition.up ? 0 : 1);
        const parent = getNodeFromPath(treeData, dropData.targetPath.slice(0, dropData.targetPath.length - 1));
        if (parent && parent.children) {
            parent.children!.splice(startIndex, 0, JSON.parse(JSON.stringify(dropData.sourceData)));
        } else {
            treeData.splice(startIndex, 0, JSON.parse(JSON.stringify(dropData.sourceData)));
        }
    }
}

type Data = {
    text: string;
    value?: any;
    icon?: string | false;
    state?: Partial<TreeNodeState>;
    children?: Data[];
};
