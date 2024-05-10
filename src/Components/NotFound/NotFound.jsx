import React from 'react'
import notFoundImg from '../img/NotFound.png'
import { Link } from 'react-router-dom';



export default function NotFound() {
    return (
        <>
            <section>
                <div className='container my-5 d-flex justify-content-center align-items-center'>
                    <div className="column text-center">
                        <div>
                            <img src={notFoundImg} alt="Error" />
                        </div>
                        <h3 className='my-4'> Page Not Found</h3>
                        <Link to='/home' role='btn' className='btn btn-primary'>Back to Home</Link>
                    </div>
                </div>
            </section>
        </>
    )
}
