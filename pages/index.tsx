import React, { useState } from 'react'
import Navbar from '../components/Navbar/Navbar'

const index = () => {

    const [query, setQuery] = useState('')

    return (
        <>
            <Navbar changeQuery={setQuery} />
        </>
    )
}

export default index
