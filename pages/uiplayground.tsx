import Modal from '../components/UI/Modal';
import Button from '../components/UI/Button/Button';

const UiPlayground: React.FC = () => {
    return (
        <div className="flex flex-col w-1/3">
            <Modal title="test">
                <p>Hello</p>
            </Modal>
            <Button onClick={(e) => { }}> Click Me</Button>
            <Button onClick={(e) => { }} style="focus:outline-none rounded-full bg-emerald-500 text-white shadow-lg w-16 h-16"> <span className="text-2xl">+</span> </Button>
        </div>
    )
}

export default UiPlayground;