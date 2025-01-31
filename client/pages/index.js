import buildClient from "../api/build-client"

const LandingPage = ({ currentUser }) => {
    return (
    <>
        {currentUser ? <h1>Welcome, {currentUser.email}</h1> : <h1>You are not signed in</h1>}
    </>
)};

export async function getServerSideProps({ req }) {
    try {
        const client = buildClient({ req });
        const response = await client.get('/api/users/currentuser');
        return { props: response.data };
    } catch (err){
        console.log(err);
        return { props: { currentUser: undefined } }
    }
};

export default LandingPage;
