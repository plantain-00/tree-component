import * as Vue from "vue";
import Component from "vue-class-component";

@Component({
    template: `
    <div class="jstree jstree-default jstree-default-dark" role="tree">
        <ul class="jstree-container-ul jstree-children" role="group">
            <li role="treeitem" class="jstree-node jstree-open jstree-last">
                <i class="jstree-icon jstree-ocl" role="presentation"></i><a class="jstree-anchor" href="javascript:void(0)"><i class="jstree-icon jstree-themeicon" role="presentation"></i>Root node</a>
                <ul role="group" class="jstree-children">
                    <li role="treeitem" class="jstree-node jstree-leaf">
                        <i class="jstree-icon jstree-ocl" role="presentation"></i><a class="jstree-anchor jstree-clicked" href="javascript:void(0)"><i class="jstree-icon jstree-themeicon" role="presentation"></i>Child node 1</a>
                    </li>
                    <li role="treeitem" class="jstree-node jstree-open jstree-last">
                        <i class="jstree-icon jstree-ocl" role="presentation"></i><a class="jstree-anchor" href="javascript:void(0)"><i class="jstree-icon jstree-themeicon" role="presentation"></i>Child node 2</a>
                        <ul role="group" class="jstree-children">
                            <li role="treeitem" class="jstree-node jstree-leaf">
                                <i class="jstree-icon jstree-ocl" role="presentation"></i><a class="jstree-anchor jstree-clicked" href="javascript:void(0)"><i class="jstree-icon jstree-themeicon" role="presentation"></i>Child node 3</a>
                            </li>
                            <li role="treeitem" class="jstree-node jstree-leaf jstree-last">
                                <i class="jstree-icon jstree-ocl" role="presentation"></i><a class="jstree-anchor jstree-hovered" href="javascript:void(0)"><i class="jstree-icon jstree-themeicon" role="presentation"></i>Child node 4</a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
    `,
    props: [],
})
class Tree extends Vue {
}

Vue.component("tree", Tree);

type TreeNode = {
    text: string;
    state: {
        opened?: boolean;
        selected?: boolean;
        disabled?: boolean;
    };
    children?: TreeNode[];
};
