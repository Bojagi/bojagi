import React from 'react';

window.localStorage.setItem('bojagi', 'local storage test');

export const localStorage = () => <div>{window.localStorage.getItem('bojagi')}</div>;
