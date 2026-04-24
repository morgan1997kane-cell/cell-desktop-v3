import { createRoot } from 'react-dom/client';
import { CaptureWindow } from './windows/CaptureWindow';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Capture window root element was not found.');
}

createRoot(rootElement).render(<CaptureWindow />);
