import * as React from "react";
import * as common from "./common";
export * from "./common";

/**
 * @public
 */
class Node<T> extends React.PureComponent<{
    data: common.TreeData<T>;
    last: boolean;
    checkbox?: boolean;
    path: number[];
    draggable?: boolean;
    root: common.TreeData<T>[];
    zindex?: number;
    preid?: string;
    parent: any;
    toggle: (eventData?: common.EventData<T>) => void;
    change: (eventData?: common.EventData<T>) => void;
}, { hovered: boolean; contextmenuVisible: boolean; contextmenuStyle: React.CSSProperties }> {
    private hovered = false;
    private doubleClick = new common.DoubleClick();
    private contextmenuVisible = false;
    private contextmenuStyle: React.CSSProperties = {
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
                    preid={this.props.preid}
                    toggle={(eventData: common.EventData<T>) => this.ontoggle(eventData)}
                    change={(eventData: common.EventData<T>) => this.onchange(eventData)}>
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
        const contextmenu = this.props.data.contextmenu && this.contextmenuVisible ? React.createElement(this.props.data.contextmenu as React.ComponentClass<{ data: common.ContextMenuData<T> }>, { data: this.contextmenuData }) : null;
        const text = this.props.data.component ? React.createElement(this.props.data.component as React.ComponentClass<{ data: common.TreeData<T> }>, { data: this.props.data }) : this.props.data.text;
        return (
            <li role="treeitem" className={this.nodeClassName} id={this.id}>
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
                    {text}
                    {markerElement}
                    <div style={this.contextmenuStyle}>{contextmenu}</div>
                </a>
                {childrenElement}
            </li>
        );
    }

    private get nodeClassName() {
        return common.getNodeClassName(this.props.data, this.props.last);
    }

    private get anchorClassName() {
        return common.getAnchorClassName(this.props.data, this.hovered);
    }

    private get checkboxClassName() {
        return common.getCheckboxClassName(this.props.data);
    }

    private get iconClassName() {
        return common.getIconClassName(this.props.data.icon);
    }

    private get pathString() {
        return this.props.path.toString();
    }

    private get hasMarker() {
        return this.props.draggable && this.props.data.state.dropPosition !== common.DropPosition.empty;
    }

    private get markerClassName() {
        return common.getMarkerClassName(this.props.data);
    }

    private get eventData(): common.EventData<T> {
        return {
            data: this.props.data,
            path: this.props.path,
        };
    }
    private get contextmenuData(): common.ContextMenuData<T> {
        return {
            data: this.props.data,
            path: this.props.path,
            root: this.props.root,
            parent: this.props.parent,
        };
    }
    private get id() {
        return common.getId(this.props.path, this.props.preid);
    }

    private geChildPath(index: number) {
        return this.props.path.concat(index);
    }

    private hover(hovered: boolean) {
        this.hovered = hovered;
        this.setState({ hovered: this.hovered });
        if (!hovered) {
            this.contextmenuVisible = false;
            this.setState({ contextmenuVisible: this.contextmenuVisible });
        }
    }
    private ontoggle(eventData?: common.EventData<T>) {
        if (eventData) {
            this.props.toggle(eventData);
        } else {
            if (this.props.data.state.openable || this.props.data.children.length > 0) {
                this.props.toggle(this.eventData);
            }
        }
    }
    private onchange(eventData?: common.EventData<T>) {
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

    private oncontextmenu(e: React.MouseEvent<HTMLAnchorElement>) {
        this.contextmenuVisible = true;
        this.contextmenuStyle.left = e.nativeEvent.offsetX + "px";
        this.contextmenuStyle.top = e.nativeEvent.offsetY + "px";
        this.setState({ contextmenuVisible: this.contextmenuVisible, contextmenuStyle: this.contextmenuStyle });
        e.preventDefault();
        return false;
    }
}

/**
 * @public
 */
export class Tree<T> extends React.PureComponent<{
    data: common.TreeData<T>[];
    checkbox?: boolean;
    draggable?: boolean;
    nodots?: boolean;
    size?: string;
    theme?: string;
    dropAllowed?: (dropData: common.DropData<T>) => boolean;
    zindex?: number;
    preid?: string;
    toggle?: (eventData?: common.EventData<T>) => void;
    change?: (eventData?: common.EventData<T>) => void;
    drop?: (dropData: common.DropData<T>) => void;
}, { dragTarget: HTMLElement | null, dropTarget: HTMLElement | null }> {
    private dragTarget: HTMLElement | null = null;
    private dropTarget: HTMLElement | null = null;

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
                preid={this.props.preid}
                toggle={(data: common.EventData<T>) => this.ontoggle(data)}
                change={(data: common.EventData<T>) => this.onchange(data)}></Node>
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

    private get rootClassName() {
        return common.getRootClassName(this.props.checkbox, this.props.size, this.props.theme);
    }
    private get containerClassName() {
        return common.getContainerClassName(this.props.nodots);
    }

    private canDrop(event: React.DragEvent<HTMLElement>) {
        return this.props.draggable && event.target && (event.target as HTMLElement).dataset && (event.target as HTMLElement).dataset.path;
    }
    private ontoggle(eventData: common.EventData<T>) {
        if (this.props.toggle) {
            this.props.toggle(eventData);
        }
    }
    private onchange(eventData: common.EventData<T>) {
        if (this.props.change) {
            this.props.change(eventData);
        }
    }
    private ondragstart(event: React.DragEvent<HTMLElement>) {
        if (!this.props.draggable) {
            return;
        }
        this.dragTarget = event.target as HTMLElement;
        this.dropTarget = event.target as HTMLElement;
        this.setState({ dragTarget: this.dragTarget, dropTarget: this.dropTarget });
    }
    private ondragend(event: React.DragEvent<HTMLElement>) {
        if (!this.props.draggable) {
            return;
        }
        this.dragTarget = null;
        for (const tree of this.props.data) {
            common.clearMarkerOfTree(tree);
        }
        this.setState({ dragTarget: this.dragTarget });
    }
    private ondragover(event: React.DragEvent<HTMLElement>) {
        if (!this.canDrop(event)) {
            return;
        }
        common.ondrag(event.pageY, this.dragTarget, this.dropTarget, this.props.data, this.props.dropAllowed, () => this.forceUpdate());
        event.preventDefault();
    }
    private ondragenter(event: React.DragEvent<HTMLElement>) {
        if (!this.canDrop(event)) {
            return;
        }
        this.dropTarget = event.target as HTMLElement;
        this.setState({ dropTarget: this.dropTarget });
        common.ondrag(event.pageY, this.dragTarget, this.dropTarget, this.props.data, this.props.dropAllowed, () => this.forceUpdate());
    }
    private ondragleave(event: React.DragEvent<HTMLElement>) {
        if (!this.canDrop(event)) {
            return;
        }
        if (event.target === this.dropTarget) {
            this.dropTarget = null;
        }
        this.setState({ dropTarget: this.dropTarget });
        common.ondragleave(event.target as HTMLElement, this.props.data);
    }
    private ondrop(event: React.DragEvent<HTMLElement>) {
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
