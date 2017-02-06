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
