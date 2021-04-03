import Modal from '../../components/UI/Modal';
import Button from '../../components/UI/Button/Button';
import Tooltip from '../../components/UI/Tooltip';
import FilledTextInput from '../../components/UI/TextInputs/FilledTextInput';

const UiPlayground: React.FC = () => {
    return (
        <div className="flex flex-col w-1/3">
            <Modal title="test">
                <p>Hello</p>
            </Modal>
            <Button onClick={(e) => { }}> Click Me</Button>
            <Button onClick={(e) => { }} style="focus:outline-none rounded-full bg-green-500 text-white shadow-lg text-xl w-16 h-16 h-10 p-3"> + </Button>
            <Tooltip>This is a tooltip</Tooltip>
            <FilledTextInput type="text" />
            {/* <FilledTextInput type="number"/> */}
        </div>
    )
}

export default UiPlayground;