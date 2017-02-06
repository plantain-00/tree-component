import * as React from "react";
import * as ReactDOM from "react-dom";
import { Tree } from "../../dist/react";
import { data } from "../data";
import * as common from "../../dist/common";

class Main extends React.Component<{}, {}> {
    data = data;
    selectedId: number | null = null;

    render() {
        return (
            <div>
                <Tree data={data}
                    toggle={(eventData: common.EventData) => this.toggle(eventData)}
                    change={(eventData: common.EventData) => this.change(eventData)}>
                </Tree>
                selected id: {this.selectedId}
            </div>
        );
    }

    toggle(eventData: common.EventData) {
        eventData.data.state.opened = !eventData.data.state.opened;
        this.setState({ data: this.data });
    }
    change(eventData: common.EventData) {
        this.selectedId = eventData.data.state!.selected ? null : eventData.data.value.id;
        this.setState({ selectedId: this.selectedId });
        if (!eventData.data.state.selected) {
            this.clearSelection();
        }
        eventData.data.state.selected = !eventData.data.state.selected;
        this.setState({ data: this.data });
    }
    clearSelectionOfTree(tree: common.TreeData) {
        if (tree.state.selected) {
            tree.state.selected = false;
        }
        if (tree.children) {
            for (const child of tree.children) {
                this.clearSelectionOfTree(child);
            }
        }
    }
    clearSelection() {
        for (const child of this.data) {
            this.clearSelectionOfTree(child);
        }
        this.setState({ data: this.data });
    }
}

ReactDOM.render(<Main />, document.getElementById("container"));
