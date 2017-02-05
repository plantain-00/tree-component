export type TreeData = {
    text: string;
    value?: any;
    state?: {
        opened?: boolean;
        selected?: boolean;
        disabled?: boolean;
    };
    children?: TreeData[];
};

export type EventData = {
    data: TreeData;
};

import "tslib";
