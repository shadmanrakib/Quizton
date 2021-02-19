import React from 'react'
import { useForm } from "react-hook-form";

interface AuthorInfo {
    uid: string;
    name: string;
    profilePicture: string;
};

interface Timestamp {
    seconds: number,
    nanoseconds :  number,
};

interface Input {
    question: string,
    explanaton: string,
    choices: Array<string>,
    tags: Array<string>,
    mcAnswer: number
}

interface FinalData extends Input {
    author: AuthorInfo,
    date: Timestamp;
};

export const CreateMCForm = () => {
    const { register, handleSubmit, watch, errors } = useForm<Inputs>();
    const onSubmit = data => console.log(data);
    return (
        <div>
            
        </div>
    )
}
