import * as React from "react";
import * as common from "./common";

class Node extends React.Component<{
    data: common.TreeData;
    last: boolean;
    toggle: (eventData?: common.EventData) => void;
    change: (eventData?: common.EventData) => void;
}, {}> {
    hovered = false;
    doubleClick = new common.DoubleClick();

    render() {
        let childrenElement: JSX.Element | null;
        if (this.props.data.children) {
            const nodesElement: JSX.Element[] = this.props.data.children.map((child, i) => (
                <Node data={child}
                    last={i === this.props.data.children!.length - 1}
                    toggle={eventData => this.ontoggle(eventData)}
                    change={eventData => this.onchange(eventData)}>
                </Node>
            ));
            childrenElement = (
                <ul role="group" className="jstree-children">
                    {nodesElement}
                </ul>
            );
        } else {
            childrenElement = null;
        }
        return (
            <li role="treeitem" className={this.nodeClassName}>
                <i className="jstree-icon jstree-ocl" role="presentation" onClick={() => this.ontoggle()}></i><a className={this.anchorClassName} href="javascript:void(0)" onClick={() => this.onchange()} onMouseEnter={() => this.hover(true)} onMouseLeave={() => this.hover(false)}><i className="jstree-icon jstree-themeicon" role="presentation"></i>{this.props.data.text}</a>
                {childrenElement}
            </li>
        );
    }

    get nodeClassName() {
        const values = ["jstree-node"];
        if (this.props.data.children && this.props.data.children.length > 0) {
            if (this.props.data.state.opened) {
                values.push("jstree-open");
            } else {
                values.push("jstree-closed");
            }
        } else {
            values.push("jstree-leaf");
        }
        if (this.props.last) {
            values.push("jstree-last");
        }
        return values.join(" ");
    }

    get anchorClassName() {
        const values = ["jstree-anchor"];
        if (this.props.data.state.selected) {
            values.push("jstree-clicked");
        }
        if (this.props.data.state.disabled) {
            values.push("jstree-disabled");
        }
        if (this.hovered) {
            values.push("jstree-hovered");
        }
        return values.join(" ");
    }

    hover(hovered: boolean) {
        this.hovered = hovered;
        this.setState({ hovered: this.hovered });
    }
    ontoggle(eventData?: common.EventData) {
        if (eventData) {
            this.props.toggle(eventData);
        } else {
            if (this.props.data.children && this.props.data.children.length > 0) {
                this.props.toggle({ data: this.props.data });
            }
        }
    }
    onchange(eventData?: common.EventData) {
        if (eventData) {
            this.props.change(eventData);
        } else {
            if (this.props.data.state.disabled) {
                return;
            }

            this.doubleClick.onclick(() => {
                this.ontoggle(eventData);
            }, () => {
                this.props.change({ data: this.props.data });
            });
        }
    }
}

export class Tree extends React.Component<{
    data: common.TreeData[];
    toggle?: (eventData?: common.EventData) => void;
    change?: (eventData?: common.EventData) => void;
}, {}> {
    render() {
        const childrenElement = this.props.data.map((child, i) => (
            <Node data={child}
                last={i === this.props.data.length - 1}
                toggle={(data: common.EventData) => this.ontoggle(data)}
                change={(data: common.EventData) => this.onchange(data)}></Node>
        ));
        return (
            <div className="jstree jstree-default jstree-default-dark" role="tree">
                <ul className="jstree-container-ul jstree-children" role="group">
                    {childrenElement}
                </ul>
            </div >
        );
    }

    ontoggle(eventData: common.EventData) {
        if (this.props.toggle) {
            this.props.toggle(eventData);
        }
    }
    onchange(eventData: common.EventData) {
        if (this.props.change) {
            this.props.change(eventData);
        }
    }
}
