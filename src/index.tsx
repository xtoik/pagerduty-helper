import React from 'react';
import {Container} from 'react-dom';
import {createRoot} from 'react-dom/client';
import {Content} from './popup/content';

const domNode: Container = document.getElementById('main-app')!;
const root = createRoot(domNode);
root.render(<Content />);
