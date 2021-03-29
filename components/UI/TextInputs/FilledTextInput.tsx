interface FilledTextInputProps {
  type?: string;
  onChange?: (any) => any;
}

const FilledTextInput: React.FC<FilledTextInputProps> = (props) => {
  return (
    <input
      type={props.type}
      onChange={props.onChange}
      className="border-2 border-gray-300 bg-blue-gray-200 focus:outline-none focus:border-light-blue-600 rounded-md p-2"
    ></input>
  );
};

export default FilledTextInput;
