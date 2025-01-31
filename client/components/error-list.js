const ErrorList = ({ errors }) => {

    return (
        <>
            {!!errors && errors.length && (
                <div className="alert alert-danger">
                    <ul className="my-0">
                        {errors.map((e) => (
                            <li key={e.message}>{e.message}</li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
};

export default ErrorList;
