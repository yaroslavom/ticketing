import 'bootstrap/dist/css/bootstrap.css';

import Header from "../components/header";

const AppComponent = ({ Component, pageProps }) => {
    return (
        <>
            <Header />
            <Component {...pageProps} />
        </>
    );
};

export default AppComponent;
