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
    timer: number | null = null;

    constructor(private timeout = 333) { }

    onclick(doubleClick: () => void, singleClick: () => void) {
        if (this.clicked) { // is a double click
            this.clicked = false;
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
            }
            doubleClick();
        } else { // first click
            this.clicked = true;
            this.timer = setTimeout(() => {
                this.clicked = false;
                singleClick();
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
