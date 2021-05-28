export enum EventType {
  FILE_UPLOAD = "FILE_UPLOAD",
  FILE_PASTE = "FILE_PASTE",
  BREED_DETECT = "BREED_DETECT",
  BREED_SELECT = "BREED_SELECT",
  GALLERY_X = "GALLERY_X",
  GALLERY_Y = "GALLERY_Y",
  IMG_FETCH = "IMG_FETCH",
  TOAST = "TOAST",
  ML_LOAD = "ML_LOAD",
}

export enum EventCategory {
  FILE_UPLOAD = "FILE_UPLOAD",
  BREED = "BREED",
  GALLERY = "GALLERY",
  IMG_FETCH = "IMG_FETCH",
  NOTIFICATION = "NOTIFICATION",
  ML = "ML",
}

const CategoryMap: Record<EventType, EventCategory> = {
  [EventType.FILE_UPLOAD]: EventCategory.FILE_UPLOAD,
  [EventType.FILE_PASTE]: EventCategory.FILE_UPLOAD,
  [EventType.BREED_SELECT]: EventCategory.BREED,
  [EventType.BREED_DETECT]: EventCategory.BREED,
  [EventType.GALLERY_X]: EventCategory.GALLERY,
  [EventType.GALLERY_Y]: EventCategory.GALLERY,
  [EventType.IMG_FETCH]: EventCategory.IMG_FETCH,
  [EventType.TOAST]: EventCategory.NOTIFICATION,
  [EventType.ML_LOAD]: EventCategory.ML,
};

const LabelMap: Record<EventType, string> = {
  [EventType.FILE_UPLOAD]: "file type",
  [EventType.FILE_PASTE]: "file type",
  [EventType.BREED_SELECT]: "breed select",
  [EventType.BREED_DETECT]: "breed detect",
  [EventType.GALLERY_X]: "gallery x",
  [EventType.GALLERY_Y]: "gallery y",
  [EventType.IMG_FETCH]: "imgs requested",
  [EventType.TOAST]: "toast",
  [EventType.ML_LOAD]: "ml load time (ms)",
};

type eventArgs = {
  action: EventType;
  value?: Record<string, string | number>;
};

export const gtagEvent = ({ action, value }: eventArgs) => {
  typeof window !== "undefined" &&
    // @ts-ignore
    window.gtag?.("event", action, {
      event_category: CategoryMap[action],
      event_label: LabelMap[action],
      ...value,
    });
};
