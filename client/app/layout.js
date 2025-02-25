import 'bootstrap/dist/css/bootstrap.css';
import './globals.css';

import Header from '../components/header'
import { MainHeaderBackground } from '../components/main-header-background';

export const metadata = {
  title: 'Tickets',
  description: 'Buy concert tickets',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {<MainHeaderBackground />}
        {<Header />}
        <div className='container'>
          {children}
        </div>
      </body>
    </html>
  );
}
