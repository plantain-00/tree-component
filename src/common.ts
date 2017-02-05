export type TreeData = {
    text: string;
    state?: {
        opened?: boolean;
        selected?: boolean;
        disabled?: boolean;
    };
    children?: TreeData[];
};
