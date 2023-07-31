import React, { FC, useState } from "react";
import { MultiSelect } from "react-multi-select-component";
import { DropdownOption } from "../Dropdown";



interface Props{
  options: DropdownOption[],
  selectedOptions: DropdownOption[],
  onSelectedOptions: (selectedOptions: DropdownOption[]) => void;
}

const MultiSelectCheckBox:FC<Props> = ({ options, selectedOptions, onSelectedOptions }) => {
  const [selected, setSelected] = useState(selectedOptions);

  const onChangeHandler = (selected: DropdownOption[]) =>{
    console.log(selected);
    setSelected(selected);
    onSelectedOptions(selected);
  }

  return (
    <MultiSelect
      options={options}
      value={selected}
      onChange={onChangeHandler}
      labelledBy="Select"
    />
  );
};

export default MultiSelectCheckBox;