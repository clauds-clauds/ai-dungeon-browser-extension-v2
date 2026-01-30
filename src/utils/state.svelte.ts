export const editorState = $state({
  open: true,
  tab: "",
});

export const cardEditorState = $state({
  open: false,
  cardId: null as string | null,
});

export const imageGenerationState = $state({
  open: false,
});

export const focusState = $state({
  card: null as VisualCard | null,
});
