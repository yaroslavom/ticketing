import Link from 'next/link';

export default ({ currentUser = undefined }) => {
    return (
        <div className='border-bottom glass sticky-top'>
            <nav className="container navbar">
                <Link className="navbar-brand ps-3" href="/">Tickets</Link>
                <div className="d-flex justify-content-end">
                    <ul className="nav d-flex align-items-center">
                        {currentUser ? <Link className="navbar-brand" href="/auth/signout">Sign Out</Link> :
                        <Link className="navbar-brand" href="/auth/signin/">Sign In</Link>}
                    </ul>
                </div>
            </nav>
        </div>
    )
}