import * as React from "react";
import * as ReactDOM from "react-dom";
import { Tree, ContextMenuData, getNodeFromPath, EventData, DropData, TreeData } from "../../dist/react";
import { data, clearSelectionOfTree, toggle, setSelectionOfTree, setParentsSelection, move, canMove, setContextMenu, Value } from "../common";

const DeleteButton: React.StatelessComponent<{ data: ContextMenuData<Value> }> = props => <button onClick={e => {
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

const CustomNode: React.StatelessComponent<{ data: TreeData<Value> }> = props => <span><span style={{ color: "red" }}>{props.data.value!.id}</span>{props.data.text}</span >;

class Main extends React.Component<{}, { data: TreeData<Value>[], selectedId: number | null, data2: TreeData<Value>[] }> {
    private data = data;
    private selectedId: number | null = null;
    private data2 = JSON.parse(JSON.stringify(data));
    private data3 = JSON.parse(JSON.stringify(data));
    private data4 = JSON.parse(JSON.stringify(data));
    private data5 = JSON.parse(JSON.stringify(data));
    private data6 = JSON.parse(JSON.stringify(data));
    private data7 = JSON.parse(JSON.stringify(data));
    private data8 = data8;
    private data9 = JSON.parse(JSON.stringify(data));
    private dropAllowed = canMove;

    render() {
        return (
            <div>
                <a href="https://github.com/plantain-00/tree-component/tree/master/demo/react/index.tsx" target="_blank">the source code of the demo</a>
                <br />
                default:
                <Tree data={this.data}
                    toggle={(eventData: EventData<Value>) => this.toggle(eventData)}
                    change={(eventData: EventData<Value>) => this.change(eventData)}>
                </Tree>
                selected id: {this.selectedId}
                <hr />
                checkbox:
                <Tree data={this.data2}
                    checkbox={true}
                    toggle={(eventData: EventData<Value>) => this.toggle2(eventData)}
                    change={(eventData: EventData<Value>) => this.change2(eventData)}>
                </Tree>
                <hr />
                draggable:
                <Tree data={this.data3}
                    draggable={true}
                    dropAllowed={this.dropAllowed}
                    toggle={(eventData: EventData<Value>) => this.toggle3(eventData)}
                    drop={(dropData: DropData<Value>) => this.drop3(dropData)}>
                </Tree>
                <hr />
                no dots:
                <Tree data={this.data4}
                    nodots={true}
                    toggle={(eventData: EventData<Value>) => this.toggle4(eventData)}>
                </Tree>
                <hr />
                large:
                <Tree data={this.data5}
                    size="large"
                    toggle={(eventData: EventData<Value>) => this.toggle5(eventData)}>
                </Tree>
                <hr />
                small:
                <Tree data={this.data6}
                    size="small"
                    toggle={(eventData: EventData<Value>) => this.toggle6(eventData)}>
                </Tree>
                <hr />
                dark theme:
                <Tree data={this.data7}
                    theme="dark"
                    checkbox={true}
                    draggable={true}
                    toggle={(eventData: EventData<Value>) => this.toggle7(eventData)}
                    change={(eventData: EventData<Value>) => this.change7(eventData)}
                    drop={(dropData: DropData<Value>) => this.drop7(dropData)}>
                </Tree>
                <hr />
                contextmenu:
                <Tree data={this.data8}
                    toggle={(eventData: EventData<Value>) => this.toggle8(eventData)}>
                </Tree>
                <hr />
                node id:
                <Tree data={this.data9}
                    preid="test_"
                    toggle={(eventData: EventData<Value>) => this.toggle9(eventData)}>
                </Tree>
            </div>
        );
    }

    private toggle(eventData: EventData<Value>) {
        toggle(eventData, CustomNode, () => {
            this.setState({ data: this.data });
        });
    }
    private change(eventData: EventData<Value>) {
        this.selectedId = eventData.data.state!.selected ? null : eventData.data.value!.id;
        this.setState({ selectedId: this.selectedId });
        if (!eventData.data.state.selected) {
            for (const child of this.data) {
                clearSelectionOfTree(child);
            }
        }
        eventData.data.state.selected = !eventData.data.state.selected;
        this.setState({ data: this.data });
    }
    private toggle2(eventData: EventData<Value>) {
        toggle(eventData, CustomNode, () => {
            this.setState({ data: this.data2 });
        });
    }
    private change2(eventData: EventData<Value>) {
        setSelectionOfTree(eventData.data, !eventData.data.state.selected);
        setParentsSelection(this.data2, eventData.path);
        this.setState({ data: this.data2 });
    }
    private toggle3(eventData: EventData<Value>) {
        toggle(eventData, CustomNode, () => {
            this.setState({ data: this.data3 });
        });
    }
    private drop3(dropData: DropData<Value>) {
        move(dropData, this.data3);
    }
    private toggle4(eventData: EventData<Value>) {
        toggle(eventData, CustomNode, () => {
            this.setState({ data: this.data4 });
        });
    }
    private toggle5(eventData: EventData<Value>) {
        toggle(eventData, CustomNode, () => {
            this.setState({ data: this.data5 });
        });
    }
    private toggle6(eventData: EventData<Value>) {
        toggle(eventData, CustomNode, () => {
            this.setState({ data: this.data6 });
        });
    }
    private toggle7(eventData: EventData<Value>) {
        toggle(eventData, CustomNode, () => {
            this.setState({ data: this.data7 });
        });
    }
    private change7(eventData: EventData<Value>) {
        setSelectionOfTree(eventData.data, !eventData.data.state.selected);
        setParentsSelection(this.data7, eventData.path);
        this.setState({ data: this.data7 });
    }
    private drop7(dropData: DropData<Value>) {
        move(dropData, this.data7);
    }
    private toggle8(eventData: EventData<Value>) {
        toggle(eventData, CustomNode, () => {
            this.setState({ data: this.data8 });
        });
    }
    private toggle9(eventData: EventData<Value>) {
        toggle(eventData, CustomNode, () => {
            this.setState({ data: this.data9 });
        });
    }
}

ReactDOM.render(<Main />, document.getElementById("container"));
