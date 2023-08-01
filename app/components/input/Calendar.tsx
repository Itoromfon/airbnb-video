'use client';

import { DateRange, Range, RangeKeyDict } from "react-date-range";

// Now let import some style
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

interface CalendarProps {
    //t will have the following props
    value: Range;
    onChange: (value: RangeKeyDict) => void;
    disabledDates?: Date[]
}

const Calendar: React.FC<CalendarProps> = ({
    //Now let extract the props
    value,
    onChange,
    disabledDates
}) => {
    return ( 
        //Now let return date-range
        <DateRange 
            //Now let's add some props here.
            rangeColors={["#262626"]}
            ranges={[value]}
            date={new Date()}
            onChange={onChange}//it would the type of onChange props
            direction="vertical"
            showDateDisplay={false}
            minDate={new Date()}
            disabledDates={disabledDates}
        />
        //now let go to listing reservation.
     );
}
 
export default Calendar;