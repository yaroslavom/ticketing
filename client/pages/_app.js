import 'bootstrap/dist/css/bootstrap.css';

import Header from "../components/header";

const AppComponent = ({ Component }) => {
    return (
        <>
            <Header />
            <Component />
        </>
    );
};

export default AppComponent;
