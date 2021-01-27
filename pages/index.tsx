import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div>
        <ul className="ml-8 list-disc">
            <li><a href="/register">Register</a></li>
            <li><a href="/login">Login</a></li>
            <li><a href="/search">Search</a></li>
            <li><a href="/createQuiz">Create Quiz</a></li>
        </ul>
    </div>
  )
}
