import { createRoot } from 'react-dom/client';
import { MainWindow } from './windows/MainWindow';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Main window root element was not found.');
}

createRoot(rootElement).render(<MainWindow />);
