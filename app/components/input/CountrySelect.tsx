'use client'

import useCountries from "@/app/hooks/useCountries";
import Select from "react-select";

/* export and define a type for the 
   value which this input will accept 
*/
export type CountrySelectValue = {
    flag: string;
    label: string;
    latlng: number[]
    region: string;
    value: string;
}

interface CountrySelectProps {
    value?: CountrySelectValue;
    onChange: (value: CountrySelectValue) => void;//return a void
}

const CountrySelect: React.FC<CountrySelectProps> = ({
    //extract value and onChange props
    // value and onChange are the props
    value,
    onChange
}) => {
    const { getAll } = useCountries();

    return ( 
        <div>
            <Select 
                placeholder="Anywhere"
                isClearable //make sure it's clearable
                options={getAll()}//options will be the get all function
                value={value}//current value would be whatever value pass in our props right here.
                onChange={(value) => onChange(value as CountrySelectValue)}
                /* onchange is going to have a value and
                   it's going to be an arrow function which
                   is going to call the props onchange and pass
                   this value as country select value
                */
               formatOptionLabel={(option: any) => (
               /* format option label will accept an option 
                  which is a type of any and will return Something
                  JSX
               */
                    <div className="flex flex-row items-center cursor-pointer gap-3">
                        <div>{option.flag}</div>
                        <div>
                            {option.label},
                            <span className="text-neutral-500 ml-1">
                                {option.region}
                            </span>
                        </div>
                    </div>
               )}
               classNames={{
                  control: () => 'p-3 border-2',
                  input: () => 'text-lg',
                  option: () => 'text-lg'
               }}
               theme={(theme) => ({
                /* we are using the props call theme so 
                   we are going to accept theme
                */
                  ...theme, //then we would spread the current theme inside
                  borderRadius: 6,
                  colors: {
                    ...theme.colors,
                    primary: 'black', //that is the primary color
                    primary25: '#ffe4e6'
                  }
               })}
            />
        </div>
     );
}
 
export default CountrySelect;








































































































































































