import React from 'react'
import router from 'next/router'

const QuizCard = ({id, quiz}) => {

    return (
        <div className="border max-w-2xl bg-white p-4" onClick={() => router.push(`/quiz/${id}`)}>
            <div className="text-lg">{quiz.title}</div>
            <div className="mt-2">
            {quiz.allTags.map((tag, index) => (
                <span key={index} className="rounded-full bg-gray-50 border text-sm p-2 text-center">{tag}</span>
            ))}
            </div>
        </div>
    )
}

export default QuizCard
