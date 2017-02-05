import { TreeData } from "../dist/common";

export const data: TreeData = {
    text: "Root node",
    state: {
        opened: true,
    },
    children: [
        {
            text: "Child node 1",
        },
        {
            text: "Child node 2",
            state: {
                opened: true,
            },
            children: [
                {
                    text: "Child node 3",
                    state: {
                        selected: true,
                    },
                },
                {
                    text: "Child node 4",
                    state: {
                        disabled: true,
                    },
                },
            ],
        },
    ],
};
