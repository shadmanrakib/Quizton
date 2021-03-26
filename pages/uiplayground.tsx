import Modal from '../components/UI/Modal';
import Button from '../components/UI/Button/Button';

const UiPlayground: React.FC = () => {
    return (
        <div className="flex flex-col w-1/3">
            <Modal title="test">
                <p>Hello</p>
            </Modal>
            <Button onClick={(e) => { }}> Click Me</Button>
            <Button onClick={(e) => { }} style="focus:outline-none rounded-full bg-green-500 text-white shadow-lg text-xl w-16 h-16 h-10 p-3"> + </Button>
        </div>
    )
}

export default UiPlayground;