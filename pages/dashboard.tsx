import { useUser } from '../hooks/useUser';

const Dashboard: React.FC = () => {
    
    const user = useUser();
    console.log(user);
    return (
        <></>
    )
}

export default Dashboard;