import React from 'react';

// Bojagi Decorators work like Storybook decorators.
// With them you can wrap your stories inside other components.
// The global decorator is especially helpful to wrap context providers around your stories.

// If you want to know more about decorators, you can read about them in the docs:
// https://bojagi.io/docs/stories/#decorators

const withDecorator = story => <>{story()}</>;

export default withDecorator;
