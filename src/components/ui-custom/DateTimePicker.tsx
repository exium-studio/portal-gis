import { Group, SimpleGrid } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import DatePickerInput from "./DatePickerInput";
import TimePickerInput from "./TimePickerInput";
import { Type__DisclosureSizes } from "@/constant/types";
import makeDateTime from "@/utils/makeDateTime";

interface Props {
  id?: string;
  name?: string;
  onChangeSetter?: (inputValue: string) => void;
  inputValue?: string;
  size?: Type__DisclosureSizes;
}
const DateTimePicker = ({
  id,
  name,
  onChangeSetter,
  inputValue,
  size,
}: Props) => {
  // States, Refs
  const [date, setDate] = useState<string[] | undefined>(undefined);
  const [time, setTime] = useState<string | undefined>(undefined);

  // Handle onchange all
  useEffect(() => {
    if (date && time) {
      onChangeSetter?.(makeDateTime(date[0], time).toISOString());
    }
  }, [date, time]);

  console.log(inputValue);

  return (
    <SimpleGrid columns={2} w={"full"}>
      <Group attached mr={"-1px"}>
        <DatePickerInput
          id={`${id}-time-picker`}
          onConfirm={(input) => {
            setDate(input);
          }}
          inputValue={date}
          size={size}
        />

        <TimePickerInput
          id={`${id}-time-picker`}
          onConfirm={(input) => {
            setTime(input);
          }}
          inputValue={time}
          size={size}
          disabled={!date}
        />
      </Group>
    </SimpleGrid>
  );
};

export default DateTimePicker;
