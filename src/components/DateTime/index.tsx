import { FC, useEffect, useState } from 'react';
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface Props{
    date:Date,
    onDateChange: (date: Date) => void;
}

const DateTime: FC<Props> = ({ date, onDateChange }) => {
    const [value, onChange] = useState<Value>(date);

  useEffect(()=>{
    if(value !== null){
        onDateChange(new Date(value.toLocaleString()))
    }
  }, [value])

  return (
      <DateTimePicker onChange={onChange} value={value} format={"dd MMM yyyy h:mm:ss a"} />
  );
}

export default DateTime;