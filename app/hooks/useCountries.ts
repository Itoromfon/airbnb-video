import countries from "world-countries";

const formattedCountries = countries.map((country) => ({
    value: country.cca2,
    label: country.name.common,
    flag: country.flag,
    latlng: country.latlng,
    region: country.region
}));


//Now we have formatted countries let create the hook Now
const useCountries = () => {
    // first let define the function call get all
    const getAll = () => {
        return formattedCountries;
    }

    // Now let get by value
    /* get by value is we are going to search the 
       formatted countries map and we are going to
       find an item which value matches the value 
       which we would pass in this function when
       we use it in the future  
    */
    const getByValue = (value: string) => {
        return formattedCountries.find((item) => {                                                       
            return item.value === value
        })
    }; 

    /* now let return an object which will expose both
       get all and get by value
    */
    return {
        getAll,
        getByValue
    }
};

export default useCountries  

















































































































































































































































