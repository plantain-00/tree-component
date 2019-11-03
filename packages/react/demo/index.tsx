import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Tree, Node, ContextMenuData, getNodeFromPath, EventData, DropData, TreeData, DragTargetData } from '../dist/'
import { data, clearSelectionOfTree, toggle, setSelectionOfTree, setParentsSelection, move, canMove, setContextMenu, Value } from 'tree-component/demo/'

const DeleteButton: React.StatelessComponent<{ data: ContextMenuData<Value> }> = props => <button onClick={e => {
  const parent = getNodeFromPath(props.data.root, props.data.path.slice(0, props.data.path.length - 1))
  const children = parent && parent.children ? parent.children : props.data.root
  const index = props.data.path[props.data.path.length - 1]
  children.splice(index, 1);
  (props.data.parent as React.PureComponent<any, any>).forceUpdate()
}}>delete</button>

const data8: typeof data = JSON.parse(JSON.stringify(data))
for (const tree of data8) {
  setContextMenu(tree, DeleteButton)
}

const CustomNode: React.StatelessComponent<{ data: TreeData<Value> }> = props => <span><span style={{ color: 'red' }}>{props.data.value!.id}</span>{props.data.text}</span >

class Main extends React.Component<{}, {
  data: TreeData<Value>[],
  selectedId: number | null,
  data2: TreeData<Value>[],
  data3: TreeData<Value>[],
  data4: TreeData<Value>[],
  data5: TreeData<Value>[],
  data6: TreeData<Value>[],
  data7: TreeData<Value>[],
  data8: TreeData<Value>[],
  data9: TreeData<Value>[],
  data10: TreeData<Value>[],
  data11: TreeData<Value>[],
  dropAllowed: (dropData: DropData<Value>) => boolean,
  dragTarget?: DragTargetData | null
}> {
  constructor(props: any) {
    super(props)
    this.state = {
      data: data,
      selectedId: null,
      data2: JSON.parse(JSON.stringify(data)),
      data3: JSON.parse(JSON.stringify(data)),
      data4: JSON.parse(JSON.stringify(data)),
      data5: JSON.parse(JSON.stringify(data)),
      data6: JSON.parse(JSON.stringify(data)),
      data7: JSON.parse(JSON.stringify(data)),
      data8: data8,
      data9: JSON.parse(JSON.stringify(data)),
      data10: JSON.parse(JSON.stringify(data)),
      data11: JSON.parse(JSON.stringify(data)),
      dropAllowed: canMove
    }
  }

  render() {
    return (
      <div>
        <a href='https://github.com/plantain-00/tree-component/tree/master/packages/react/demo' target='_blank'>the source code of the demo</a>
        <br />
        default:
          <div className='default'>
          <Tree data={this.state.data}
            toggle={(eventData: EventData<Value>) => this.toggle(eventData)}
            change={(eventData: EventData<Value>) => this.change(eventData)}>
          </Tree>
        </div>
        selected id: {this.state.selectedId}
        <hr />
        checkbox:
          <div className='checkbox'>
          <Tree data={this.state.data2}
            checkbox={true}
            toggle={(eventData: EventData<Value>) => this.toggle2(eventData)}
            change={(eventData: EventData<Value>) => this.change2(eventData)}>
          </Tree>
        </div>
        <hr />
        draggable:
          <div className='draggable'>
          <Tree data={this.state.data3}
            draggable={true}
            dropAllowed={this.state.dropAllowed}
            dragTarget={this.state.dragTarget}
            toggle={(eventData: EventData<Value>) => this.toggle3(eventData)}
            drop={(dropData: DropData<Value>) => this.drop3(dropData)}
            changeDragTarget={(dragTarget) => this.setState({ dragTarget })}>
          </Tree>
        </div>
        <hr />
        draggable 2:
          <div className='draggable'>
          <Tree data={this.state.data10}
            draggable={true}
            dropAllowed={this.state.dropAllowed}
            dragTarget={this.state.dragTarget}
            toggle={(eventData: EventData<Value>) => this.toggle10(eventData)}
            drop={(dropData: DropData<Value>) => this.drop10(dropData)}
            changeDragTarget={(dragTarget) => this.setState({ dragTarget })}>
          </Tree>
        </div>
        <hr />
        no dots:
          <div className='no-dots'>
          <Tree data={this.state.data4}
            nodots={true}
            toggle={(eventData: EventData<Value>) => this.toggle4(eventData)}>
          </Tree>
        </div>
        <hr />
        large:
          <div className='large'>
          <Tree data={this.state.data5}
            size='large'
            toggle={(eventData: EventData<Value>) => this.toggle5(eventData)}>
          </Tree>
        </div>
        <hr />
        small:
          <div className='small'>
          <Tree data={this.state.data6}
            size='small'
            toggle={(eventData: EventData<Value>) => this.toggle6(eventData)}>
          </Tree>
        </div>
        <hr />
        dark theme:
          <div className='dark-theme'>
          <Tree data={this.state.data7}
            theme='dark'
            checkbox={true}
            draggable={true}
            toggle={(eventData: EventData<Value>) => this.toggle7(eventData)}
            change={(eventData: EventData<Value>) => this.change7(eventData)}
            drop={(dropData: DropData<Value>) => this.drop7(dropData)}>
          </Tree>
        </div>
        <hr />
        contextmenu:
          <div className='contextmenu'>
          <Tree data={this.state.data8}
            toggle={(eventData: EventData<Value>) => this.toggle8(eventData)}>
          </Tree>
        </div>
        <hr />
        node id:
          <div className='node-id'>
          <Tree data={this.state.data9}
            preid='test_'
            toggle={(eventData: EventData<Value>) => this.toggle9(eventData)}>
          </Tree>
        </div>
        <hr />
        children:
          <div className='children'>
          <Tree data={this.state.data11}>
            {this.state.data11.map((child, i) => (
              <Node data={child}
                key={i}
                last={i === this.state.data11.length - 1}
                path={[i]}
                root={this.state.data11}
                parent={this}
                toggle={(data) => {}}
                change={(data) => {}}></Node>
            ))}
          </Tree>
        </div>
      </div>
    )
  }

  private toggle(eventData: EventData<Value>) {
    toggle(eventData, CustomNode, () => {
      this.setState({ data: this.state.data })
    })
  }
  private change(eventData: EventData<Value>) {
    this.setState({ selectedId:  eventData.data.state.selected ? null : eventData.data.value!.id })
    if (!eventData.data.state.selected) {
      for (const child of this.state.data) {
        clearSelectionOfTree(child)
      }
    }
    eventData.data.state.selected = !eventData.data.state.selected
    this.setState({ data: this.state.data })
  }
  private toggle2(eventData: EventData<Value>) {
    toggle(eventData, CustomNode, () => {
      this.setState({ data2: this.state.data2 })
    })
  }
  private change2(eventData: EventData<Value>) {
    setSelectionOfTree(eventData.data, !eventData.data.state.selected)
    setParentsSelection(this.state.data2, eventData.path)
    this.setState({ data2: this.state.data2 })
  }
  private toggle3(eventData: EventData<Value>) {
    toggle(eventData, CustomNode, () => {
      this.setState({ data3: this.state.data3 })
    })
  }
  private drop3(dropData: DropData<Value>) {
    move(dropData, this.state.data3)
  }
  private toggle4(eventData: EventData<Value>) {
    toggle(eventData, CustomNode, () => {
      this.setState({ data3: this.state.data4 })
    })
  }
  private toggle5(eventData: EventData<Value>) {
    toggle(eventData, CustomNode, () => {
      this.setState({ data5: this.state.data5 })
    })
  }
  private toggle6(eventData: EventData<Value>) {
    toggle(eventData, CustomNode, () => {
      this.setState({ data6: this.state.data6 })
    })
  }
  private toggle7(eventData: EventData<Value>) {
    toggle(eventData, CustomNode, () => {
      this.setState({ data7: this.state.data7 })
    })
  }
  private change7(eventData: EventData<Value>) {
    setSelectionOfTree(eventData.data, !eventData.data.state.selected)
    setParentsSelection(this.state.data7, eventData.path)
    this.setState({ data7: this.state.data7 })
  }
  private drop7(dropData: DropData<Value>) {
    move(dropData, this.state.data7)
  }
  private toggle8(eventData: EventData<Value>) {
    toggle(eventData, CustomNode, () => {
      this.setState({ data8: this.state.data8 })
    })
  }
  private toggle9(eventData: EventData<Value>) {
    toggle(eventData, CustomNode, () => {
      this.setState({ data9: this.state.data9 })
    })
  }
  private toggle10(eventData: EventData<Value>) {
    toggle(eventData, CustomNode, () => {
      this.setState({ data10: this.state.data10 })
    })
  }
  private drop10(dropData: DropData<Value>) {
    move(dropData, this.state.data10)
  }
}

ReactDOM.render(<Main />, document.getElementById('container'))
