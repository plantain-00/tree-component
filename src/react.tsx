import * as React from "react";
import * as common from "./common";
export * from "./common";

class Node extends React.PureComponent<{
    data: common.TreeData;
    last: boolean;
    checkbox?: boolean;
    path: number[];
    draggable?: boolean;
    root: common.TreeData[];
    zindex?: number;
    parent: any;
    toggle: (eventData?: common.EventData) => void;
    change: (eventData?: common.EventData) => void;
}, { hovered: boolean; contextmenuVisible: boolean; contextmenuStyle: React.CSSProperties }> {
    hovered = false;
    doubleClick = new common.DoubleClick();
    contextmenuVisible = false;
    contextmenuStyle: React.CSSProperties = {
        position: "absolute",
        left: "0px",
        top: "0px",
        zIndex: typeof this.props.zindex === "number" ? this.props.zindex : 1,
    };

    render() {
        let childrenElement: JSX.Element | null;
        if (this.props.data.children) {
            const nodesElement: JSX.Element[] = this.props.data.children.map((child, i) => (
                <Node data={child}
                    key={i}
                    last={i === this.props.data.children.length - 1}
                    checkbox={this.props.checkbox}
                    path={this.geChildPath(i)}
                    draggable={this.props.draggable}
                    root={this.props.root}
                    parent={this}
                    zindex={this.props.zindex}
                    toggle={eventData => this.ontoggle(eventData)}
                    change={eventData => this.onchange(eventData)}>
                </Node>
            ));
            childrenElement = (
                <ul role="group" className="tree-children">
                    {nodesElement}
                </ul>
            );
        } else {
            childrenElement = null;
        }
        const checkboxElement = this.props.checkbox ? <i className={this.checkboxClassName} role="presentation"></i> : null;
        const iconElement = this.props.data.icon !== false ? <i className={this.iconClassName} role="presentation"></i> : null;
        const markerElement = this.hasMarker ? <span className={this.markerClassName}>&#160;</span> : null;
        const contextmenu = this.props.data.contextmenu && this.contextmenuVisible ? React.createElement(this.props.data.contextmenu as React.ComponentClass<{ data: common.ContextMenuData }>, { data: this.contextmenuData }) : null;
        return (
            <li role="treeitem" className={this.nodeClassName}>
                <i className="tree-icon tree-ocl" role="presentation" onClick={() => this.ontoggle()}></i>
                <a className={this.anchorClassName}
                    href="javascript:void(0)"
                    draggable={this.props.draggable}
                    onClick={() => this.onchange()}
                    onDoubleClick={() => this.ontoggle()}
                    onMouseEnter={() => this.hover(true)}
                    onMouseLeave={() => this.hover(false)}
                    onContextMenu={e => this.oncontextmenu(e)}
                    data-path={this.pathString}>
                    {checkboxElement}
                    {iconElement}
                    {this.props.data.text}
                    {markerElement}
                    <div style={this.contextmenuStyle}>{contextmenu}</div>
                </a>
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

    get iconClassName() {
        return common.getIconClassName(this.props.data.icon);
    }

    get pathString() {
        return this.props.path.toString();
    }

    get hasMarker() {
        return this.props.draggable && this.props.data.state.dropPosition !== common.DropPosition.empty;
    }

    get markerClassName() {
        return common.getMarkerClassName(this.props.data);
    }

    get eventData(): common.EventData {
        return {
            data: this.props.data,
            path: this.props.path,
        };
    }
    get contextmenuData(): common.ContextMenuData {
        return {
            data: this.props.data,
            path: this.props.path,
            root: this.props.root,
            parent: this.props.parent,
        };
    }

    geChildPath(index: number) {
        return this.props.path.concat(index);
    }

    hover(hovered: boolean) {
        this.hovered = hovered;
        this.setState({ hovered: this.hovered });
        if (!hovered) {
            this.contextmenuVisible = false;
            this.setState({ contextmenuVisible: this.contextmenuVisible });
        }
    }
    ontoggle(eventData?: common.EventData) {
        if (eventData) {
            this.props.toggle(eventData);
        } else {
            if (this.props.data.state.openable || this.props.data.children.length > 0) {
                this.props.toggle(this.eventData);
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
                this.props.change(this.eventData);
            });
        }
    }

    oncontextmenu(e: React.MouseEvent<HTMLAnchorElement>) {
        this.contextmenuVisible = true;
        this.contextmenuStyle.left = e.nativeEvent.offsetX + "px";
        this.contextmenuStyle.top = e.nativeEvent.offsetY + "px";
        this.setState({ contextmenuVisible: this.contextmenuVisible, contextmenuStyle: this.contextmenuStyle });
        e.preventDefault();
        return false;
    }
}

export class Tree extends React.PureComponent<{
    data: common.TreeData[];
    checkbox?: boolean;
    draggable?: boolean;
    nodots?: boolean;
    size?: string;
    theme?: string;
    dropAllowed?: (dropData: common.DropData) => boolean;
    zindex?: number;
    toggle?: (eventData?: common.EventData) => void;
    change?: (eventData?: common.EventData) => void;
    drop?: (dropData: common.DropData) => void;
}, { dragTarget: HTMLElement | null, dropTarget: HTMLElement | null }> {
    dragTarget: HTMLElement | null = null;
    dropTarget: HTMLElement | null = null;

    render() {
        const childrenElement = this.props.data.map((child, i) => (
            <Node data={child}
                key={i}
                last={i === this.props.data.length - 1}
                checkbox={this.props.checkbox}
                path={[i]}
                draggable={this.props.draggable}
                root={this.props.data}
                parent={this}
                zindex={this.props.zindex}
                toggle={(data: common.EventData) => this.ontoggle(data)}
                change={(data: common.EventData) => this.onchange(data)}></Node>
        ));
        return (
            <div className={this.rootClassName} role="tree">
                <ul className={this.containerClassName}
                    role="group"
                    onDragStart={eventData => this.ondragstart(eventData)}
                    onDragEnd={eventData => this.ondragend(eventData)}
                    onDragOver={eventData => this.ondragover(eventData)}
                    onDragEnter={(eventData) => this.ondragenter(eventData)}
                    onDragLeave={eventData => this.ondragleave(eventData)}
                    onDrop={eventData => this.ondrop(eventData)}>
                    {childrenElement}
                </ul>
            </div>
        );
    }

    get rootClassName() {
        return common.getRootClassName(this.props.checkbox, this.props.size, this.props.theme);
    }
    get containerClassName() {
        return common.getContainerClassName(this.props.nodots);
    }

    canDrop(event: React.DragEvent<HTMLElement>) {
        return this.props.draggable && event.target && (event.target as HTMLElement).dataset && (event.target as HTMLElement).dataset.path;
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
    ondragstart(event: React.DragEvent<HTMLElement>) {
        if (!this.props.draggable) {
            return;
        }
        this.dragTarget = event.target as HTMLElement;
        this.dropTarget = event.target as HTMLElement;
        this.setState({ dragTarget: this.dragTarget, dropTarget: this.dropTarget });
    }
    ondragend(event: React.DragEvent<HTMLElement>) {
        if (!this.props.draggable) {
            return;
        }
        this.dragTarget = null;
        for (const tree of this.props.data) {
            common.clearMarkerOfTree(tree);
        }
        this.setState({ dragTarget: this.dragTarget });
    }
    ondragover(event: React.DragEvent<HTMLElement>) {
        if (!this.canDrop(event)) {
            return;
        }
        common.ondrag(event.pageY, this.dragTarget, this.dropTarget, this.props.data, this.props.dropAllowed, () => this.forceUpdate());
        event.preventDefault();
    }
    ondragenter(event: React.DragEvent<HTMLElement>) {
        if (!this.canDrop(event)) {
            return;
        }
        this.dropTarget = event.target as HTMLElement;
        this.setState({ dropTarget: this.dropTarget });
        common.ondrag(event.pageY, this.dragTarget, this.dropTarget, this.props.data, this.props.dropAllowed, () => this.forceUpdate());
    }
    ondragleave(event: React.DragEvent<HTMLElement>) {
        if (!this.canDrop(event)) {
            return;
        }
        if (event.target === this.dropTarget) {
            this.dropTarget = null;
        }
        this.setState({ dropTarget: this.dropTarget });
        common.ondragleave(event.target as HTMLElement, this.props.data);
    }
    ondrop(event: React.DragEvent<HTMLElement>) {
        if (!this.canDrop(event)) {
            return;
        }
        common.ondrop(event.target as HTMLElement, this.dragTarget, this.props.data, dropData => {
            if (this.props.drop) {
                this.props.drop(dropData);
            }
        });
    }
}
