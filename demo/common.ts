import { TreeData, TreeNodeState, EventData } from "../dist/common";

const rawData: Data[] = [
    {
        text: "Root node 1",
        value: { id: 1 },
        state: {
            opened: true,
        },
        children: [
            {
                text: "Child node 11",
                value: { id: 11 },
            },
            {
                text: "Disabled Child node 12",
                value: { id: 12 },
                state: {
                    opened: true,
                    disabled: true,
                },
                children: [
                    {
                        text: "Child node 121",
                        value: { id: 121 },
                    },
                    {
                        text: "Disabled Child node 122",
                        value: { id: 122 },
                        state: {
                            disabled: true,
                        },
                    },
                    {
                        text: "Highlighted Child node 123",
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
        text: "Loading Root node 2",
        value: { id: 2 },
        children: [
            {
                text: "Child node 21",
                value: { id: 21 },
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
    if (treeData.children) {
        for (const child of treeData.children) {
            standardize(child);
        }
    }
}

for (const child of rawData) {
    standardize(child);
}

console.log(rawData);

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
        }, 2000);
    } else {
        eventData.data.state.opened = !eventData.data.state.opened;
    }
    if (next) {
        next();
    }
}

type Data = {
    text: string;
    value?: any;
    state?: Partial<TreeNodeState>;
    children?: Data[];
};
