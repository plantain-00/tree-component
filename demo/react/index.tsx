import * as React from "react";
import * as ReactDOM from "react-dom";
import { Tree } from "../../dist/react";
import { data, clearSelectionOfTree, toggle, setSelectionOfTree, setParentsSelection, move, canMove, setContextMenu } from "../common";
import * as common from "../../dist/common";

class DeleteButton extends React.PureComponent<{ data: common.ContextMenuData }, {}> {
    click() {
        const parent = common.getNodeFromPath(this.props.data.root, this.props.data.path.slice(0, this.props.data.path.length - 1));
        const children = parent && parent.children ? parent.children : this.props.data.root;
        const index = this.props.data.path[this.props.data.path.length - 1];
        children.splice(index, 1);
        (this.props.data.parent as React.PureComponent<any, any>).forceUpdate();
    }
    render() {
        return (
            <button onClick={e => this.click()}>delete</button>
        );
    }
}

const data8: typeof data = JSON.parse(JSON.stringify(data));
for (const tree of data8) {
    setContextMenu(tree, DeleteButton);
}

class Main extends React.Component<{}, { data: common.TreeData[], selectedId: number | null, data2: common.TreeData[] }> {
    data = data;
    selectedId: number | null = null;
    data2 = JSON.parse(JSON.stringify(data));
    data3 = JSON.parse(JSON.stringify(data));
    data4 = JSON.parse(JSON.stringify(data));
    data5 = JSON.parse(JSON.stringify(data));
    data6 = JSON.parse(JSON.stringify(data));
    data7 = JSON.parse(JSON.stringify(data));
    data8 = data8;
    dropAllowed = canMove;

    render() {
        return (
            <div>
                default:
                <Tree data={this.data}
                    toggle={(eventData: common.EventData) => this.toggle(eventData)}
                    change={(eventData: common.EventData) => this.change(eventData)}>
                </Tree>
                selected id: {this.selectedId}
                <hr />
                checkbox:
                <Tree data={this.data2}
                    checkbox={true}
                    toggle={(eventData: common.EventData) => this.toggle2(eventData)}
                    change={(eventData: common.EventData) => this.change2(eventData)}>
                </Tree>
                <hr />
                draggable:
                <Tree data={this.data3}
                    draggable={true}
                    dropAllowed={this.dropAllowed}
                    toggle={(eventData: common.EventData) => this.toggle3(eventData)}
                    drop={(dropData: common.DropData) => this.drop3(dropData)}>
                </Tree>
                <hr />
                no dots:
                <Tree data={this.data4}
                    nodots={true}
                    toggle={(eventData: common.EventData) => this.toggle4(eventData)}>
                </Tree>
                <hr />
                large:
                <Tree data={this.data5}
                    size="large"
                    toggle={(eventData: common.EventData) => this.toggle5(eventData)}>
                </Tree>
                <hr />
                small:
                <Tree data={this.data6}
                    size="small"
                    toggle={(eventData: common.EventData) => this.toggle6(eventData)}>
                </Tree>
                <hr />
                dark theme:
                <Tree data={this.data7}
                    theme="dark"
                    checkbox={true}
                    draggable={true}
                    toggle={(eventData: common.EventData) => this.toggle7(eventData)}
                    change={(eventData: common.EventData) => this.change7(eventData)}
                    drop={(dropData: common.DropData) => this.drop7(dropData)}>
                </Tree>
                <hr />
                contextmenu:
                <Tree data={this.data8}
                    toggle={(eventData: common.EventData) => this.toggle8(eventData)}>
                </Tree>
            </div>
        );
    }

    toggle(eventData: common.EventData) {
        toggle(eventData, () => {
            this.setState({ data: this.data });
        });
    }
    change(eventData: common.EventData) {
        this.selectedId = eventData.data.state!.selected ? null : eventData.data.value.id;
        this.setState({ selectedId: this.selectedId });
        if (!eventData.data.state.selected) {
            for (const child of this.data) {
                clearSelectionOfTree(child);
            }
        }
        eventData.data.state.selected = !eventData.data.state.selected;
        this.setState({ data: this.data });
    }
    toggle2(eventData: common.EventData) {
        toggle(eventData, () => {
            this.setState({ data: this.data2 });
        });
    }
    change2(eventData: common.EventData) {
        setSelectionOfTree(eventData.data, !eventData.data.state.selected);
        setParentsSelection(this.data2, eventData.path);
        this.setState({ data: this.data2 });
    }
    toggle3(eventData: common.EventData) {
        toggle(eventData, () => {
            this.setState({ data: this.data3 });
        });
    }
    drop3(dropData: common.DropData) {
        move(dropData, this.data3);
    }
    toggle4(eventData: common.EventData) {
        toggle(eventData, () => {
            this.setState({ data: this.data4 });
        });
    }
    toggle5(eventData: common.EventData) {
        toggle(eventData, () => {
            this.setState({ data: this.data5 });
        });
    }
    toggle6(eventData: common.EventData) {
        toggle(eventData, () => {
            this.setState({ data: this.data6 });
        });
    }
    toggle7(eventData: common.EventData) {
        toggle(eventData, () => {
            this.setState({ data: this.data7 });
        });
    }
    change7(eventData: common.EventData) {
        setSelectionOfTree(eventData.data, !eventData.data.state.selected);
        setParentsSelection(this.data7, eventData.path);
        this.setState({ data: this.data7 });
    }
    drop7(dropData: common.DropData) {
        move(dropData, this.data7);
    }
    toggle8(eventData: common.EventData) {
        toggle(eventData);
    }
}

ReactDOM.render(<Main />, document.getElementById("container"));
