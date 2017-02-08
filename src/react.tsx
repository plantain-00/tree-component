import * as React from "react";
import * as common from "./common";

class Node extends React.Component<{
    data: common.TreeData;
    last: boolean;
    checkbox?: boolean;
    path: number[];
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
                    checkbox={this.props.checkbox}
                    path={this.geChildPath(i)}
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
        const checkboxElement = this.props.checkbox ? <i className={this.checkboxClassName} role="presentation"></i> : null;
        return (
            <li role="treeitem" className={this.nodeClassName}>
                <i className="jstree-icon jstree-ocl" role="presentation" onClick={() => this.ontoggle()}></i><a className={this.anchorClassName} href="javascript:void(0)" onClick={() => this.onchange()} onDoubleClick={() => this.ontoggle()} onMouseEnter={() => this.hover(true)} onMouseLeave={() => this.hover(false)}>{checkboxElement}<i className="jstree-icon jstree-themeicon" role="presentation"></i>{this.props.data.text}</a>
                {childrenElement}
            </li>
        );
    }

    get nodeClassName() {
        return common.getNodeClassName(this.props.data, this.props.last);
    }

    get anchorClassName() {
        return common.getAnchorClassName(this.props.data, this.hovered);
    }

    get checkboxClassName() {
        return common.getCheckboxClassName(this.props.data);
    }

    geChildPath(index: number) {
        return this.props.path.concat(index);
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
                this.props.toggle({ data: this.props.data, path: this.props.path });
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
                this.props.change({ data: this.props.data, path: this.props.path });
            });
        }
    }
}

export class Tree extends React.Component<{
    data: common.TreeData[];
    checkbox?: boolean;
    toggle?: (eventData?: common.EventData) => void;
    change?: (eventData?: common.EventData) => void;
}, {}> {
    render() {
        const childrenElement = this.props.data.map((child, i) => (
            <Node data={child}
                last={i === this.props.data.length - 1}
                checkbox={this.props.checkbox}
                path={[i]}
                toggle={(data: common.EventData) => this.ontoggle(data)}
                change={(data: common.EventData) => this.onchange(data)}></Node>
        ));
        return (
            <div className={this.rootClassName} role="tree">
                <ul className="jstree-container-ul jstree-children" role="group">
                    {childrenElement}
                </ul>
            </div >
        );
    }

    get rootClassName() {
        return common.getRootClassName(this.props.checkbox);
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
