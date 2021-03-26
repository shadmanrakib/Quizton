import Modal from '../components/testComponents/Modal';
import Button from '../components/testComponents/Button/Button';

const UiPlayground: React.FC = () => {
    return (
        <div className="flex flex-col w-1/3">
            <Modal title="test">
                <p>Hello</p>
            </Modal>
            <Button text="Click me!" onClick={() => {}}/>
        </div>
    )
}

export default UiPlayground;