import Link from 'next/link';

export default ({ currentUser = undefined }) => {
    return (
        <nav className="navbar navbar-light bg-light">
            <Link className="navbar-brand" href="/">Tickets</Link>
            <div className="d-flex justify-content-end">
                <ul className="nav d-flex align-items-center">
                    {currentUser ? <Link className="navbar-brand" href="/auth/signout">Sign Out</Link> :
                    <Link className="navbar-brand" href="/auth/signin/">Sign In</Link>}
                </ul>
            </div>
        </nav>
    )
}