
export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
}

export const decorators = [(Story, {globals, args}) => {
  return <div {...globals}><Story /></div>;
}];

export const globalTypes = {
  hans: {
    defaultValue: 'wurst',
  },
  hansi: {
    defaultValue: 'würstchen',
  },
}
