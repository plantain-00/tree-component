import * as React from "react";
import * as ReactDOM from "react-dom";
import { Tree, ContextMenuData, getNodeFromPath, EventData, DropData, TreeData } from "../../dist/react";
import { data, clearSelectionOfTree, toggle, setSelectionOfTree, setParentsSelection, move, canMove, setContextMenu } from "../common";

const DeleteButton: React.StatelessComponent<{ data: ContextMenuData }> = props => <button onClick={e => {
    const parent = getNodeFromPath(props.data.root, props.data.path.slice(0, props.data.path.length - 1));
    const children = parent && parent.children ? parent.children : props.data.root;
    const index = props.data.path[props.data.path.length - 1];
    children.splice(index, 1);
    (props.data.parent as React.PureComponent<any, any>).forceUpdate();
}}>delete</button>;

const data8: typeof data = JSON.parse(JSON.stringify(data));
for (const tree of data8) {
    setContextMenu(tree, DeleteButton);
}

class Main extends React.Component<{}, { data: TreeData[], selectedId: number | null, data2: TreeData[] }> {
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
                <a href="https://github.com/plantain-00/tree-component/tree/master/demo/react/index.tsx" target="_blank">the source code of the demo</a>
                <br />
                default:
                <Tree data={this.data}
                    toggle={(eventData: EventData) => this.toggle(eventData)}
                    change={(eventData: EventData) => this.change(eventData)}>
                </Tree>
                selected id: {this.selectedId}
                <hr />
                checkbox:
                <Tree data={this.data2}
                    checkbox={true}
                    toggle={(eventData: EventData) => this.toggle2(eventData)}
                    change={(eventData: EventData) => this.change2(eventData)}>
                </Tree>
                <hr />
                draggable:
                <Tree data={this.data3}
                    draggable={true}
                    dropAllowed={this.dropAllowed}
                    toggle={(eventData: EventData) => this.toggle3(eventData)}
                    drop={(dropData: DropData) => this.drop3(dropData)}>
                </Tree>
                <hr />
                no dots:
                <Tree data={this.data4}
                    nodots={true}
                    toggle={(eventData: EventData) => this.toggle4(eventData)}>
                </Tree>
                <hr />
                large:
                <Tree data={this.data5}
                    size="large"
                    toggle={(eventData: EventData) => this.toggle5(eventData)}>
                </Tree>
                <hr />
                small:
                <Tree data={this.data6}
                    size="small"
                    toggle={(eventData: EventData) => this.toggle6(eventData)}>
                </Tree>
                <hr />
                dark theme:
                <Tree data={this.data7}
                    theme="dark"
                    checkbox={true}
                    draggable={true}
                    toggle={(eventData: EventData) => this.toggle7(eventData)}
                    change={(eventData: EventData) => this.change7(eventData)}
                    drop={(dropData: DropData) => this.drop7(dropData)}>
                </Tree>
                <hr />
                contextmenu:
                <Tree data={this.data8}
                    toggle={(eventData: EventData) => this.toggle8(eventData)}>
                </Tree>
            </div>
        );
    }

    toggle(eventData: EventData) {
        toggle(eventData, () => {
            this.setState({ data: this.data });
        });
    }
    change(eventData: EventData) {
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
    toggle2(eventData: EventData) {
        toggle(eventData, () => {
            this.setState({ data: this.data2 });
        });
    }
    change2(eventData: EventData) {
        setSelectionOfTree(eventData.data, !eventData.data.state.selected);
        setParentsSelection(this.data2, eventData.path);
        this.setState({ data: this.data2 });
    }
    toggle3(eventData: EventData) {
        toggle(eventData, () => {
            this.setState({ data: this.data3 });
        });
    }
    drop3(dropData: DropData) {
        move(dropData, this.data3);
    }
    toggle4(eventData: EventData) {
        toggle(eventData, () => {
            this.setState({ data: this.data4 });
        });
    }
    toggle5(eventData: EventData) {
        toggle(eventData, () => {
            this.setState({ data: this.data5 });
        });
    }
    toggle6(eventData: EventData) {
        toggle(eventData, () => {
            this.setState({ data: this.data6 });
        });
    }
    toggle7(eventData: EventData) {
        toggle(eventData, () => {
            this.setState({ data: this.data7 });
        });
    }
    change7(eventData: EventData) {
        setSelectionOfTree(eventData.data, !eventData.data.state.selected);
        setParentsSelection(this.data7, eventData.path);
        this.setState({ data: this.data7 });
    }
    drop7(dropData: DropData) {
        move(dropData, this.data7);
    }
    toggle8(eventData: EventData) {
        toggle(eventData);
    }
}

ReactDOM.render(<Main />, document.getElementById("container"));
