export type TreeNode = {
    text: string;
    state?: {
        opened?: boolean;
        selected?: boolean;
        disabled?: boolean;
    };
    children?: TreeNode[];
};
