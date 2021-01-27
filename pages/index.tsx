import Link from 'next/link';

export default function Home() {
  return (
    <div>
        <ul className="ml-8 list-disc">
            <li>    
                <Link href="/login">
                    <a>Login</a>
                </Link>
            </li>
            <li>    
                <Link href="/register">
                    <a>Register</a>
                </Link>
            </li>
            <li>    
                <Link href="/search">
                    <a>Search</a>
                </Link>
            </li>
            <li>    
                <Link href="/createQuiz">
                    <a>Create Quiz</a>
                </Link>
            </li>
        </ul>
    </div>
  )
}
