export type TreeData = {
    text: string;
    value?: any;
    state: {
        opened: boolean;
        selected: boolean;
        disabled: boolean;
    };
    children?: TreeData[];
};

export type EventData = {
    data: TreeData;
};

import "tslib";

export class DoubleClick {
    clicked = false;

    constructor(private timeout = 300) { }

    onclick(singleClick: () => void) {
        if (!this.clicked) {
            this.clicked = true;
            singleClick();
            setTimeout(() => {
                this.clicked = false;
            }, this.timeout);
        }
    }
}

export function getNodeClassName(data: TreeData, last: boolean) {
    const values = ["jstree-node"];
    if (data.children && data.children.length > 0) {
        if (data.state.opened) {
            values.push("jstree-open");
        } else {
            values.push("jstree-closed");
        }
    } else {
        values.push("jstree-leaf");
    }
    if (last) {
        values.push("jstree-last");
    }
    return values.join(" ");
}

export function getAnchorClassName(data: TreeData, hovered: boolean) {
    const values = ["jstree-anchor"];
    if (data.state.selected) {
        values.push("jstree-clicked");
    }
    if (data.state.disabled) {
        values.push("jstree-disabled");
    }
    if (hovered) {
        values.push("jstree-hovered");
    }
    return values.join(" ");
}
