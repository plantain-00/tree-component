import * as React from "react";
import * as ReactDOM from "react-dom";
import { Tree } from "../../dist/react";
import { data, clearSelectionOfTree, toggle, setSelectionOfTree, setParentsSelection, copy } from "../common";
import * as common from "../../dist/common";

class Main extends React.Component<{}, { data: common.TreeData[], selectedId: number | null, data2: common.TreeData[] }> {
    data = data;
    selectedId: number | null = null;
    data2 = JSON.parse(JSON.stringify(data));
    data3 = JSON.parse(JSON.stringify(data));
    data4 = JSON.parse(JSON.stringify(data));
    data5 = JSON.parse(JSON.stringify(data));
    data6 = JSON.parse(JSON.stringify(data));

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
        copy(dropData, this.data3);
    }
    toggle4(eventData: common.EventData) {
        toggle(eventData, () => {
            this.setState({ data: this.data4 });
        });
    }
    toggle5(eventData: common.EventData) {
        toggle(eventData, () => {
            this.setState({ data: this.data4 });
        });
    }
    toggle6(eventData: common.EventData) {
        toggle(eventData, () => {
            this.setState({ data: this.data4 });
        });
    }
}

ReactDOM.render(<Main />, document.getElementById("container"));
