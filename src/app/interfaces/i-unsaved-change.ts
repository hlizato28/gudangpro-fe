export interface IUnsavedChange {
    canDeactivate: () => boolean | Promise<boolean>;
}
