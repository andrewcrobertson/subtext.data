export enum Mode {
  Edit = 'Edit',
  Normal = 'Normal',
}

export interface ModeChangeEventDetail {
  mode: Mode;
}
