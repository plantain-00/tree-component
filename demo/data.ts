import { TreeData } from "../dist/common";

export const data: TreeData[] = [
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
                text: "Child node 12",
                value: { id: 12 },
                state: {
                    opened: true,
                },
                children: [
                    {
                        text: "Child node 121",
                        value: { id: 121 },
                    },
                    {
                        text: "Child node 122",
                        value: { id: 122 },
                        state: {
                            disabled: true,
                        },
                    },
                ],
            },
        ],
    },
    {
        text: "Root node 2",
        value: { id: 2 },
    },
];
