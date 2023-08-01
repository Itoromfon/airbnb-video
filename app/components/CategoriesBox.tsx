'use client'

/* use router and use search param can both be
   import next navigation
*/
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { IconType } from "react-icons";
import qs from "query-string";

interface CategoriesBoxProps {
    icon: IconType;
    label: string;
    selected?: boolean// it will be an optional boolean
    // for now description won't be needed
}

const CategoryBox: React.FC<CategoriesBoxProps> = ({
    /* Now we would write Icon in our props icon right here */
    icon: Icon,//Now we can use this Icon as a component
    label, 
    selected
}) => {
    /* we want to add something once we click 
       on the category box, to do this we would 
       use router and params
    */
   const router = useRouter();
   const params = useSearchParams();

   /* handle click is a use call back which can be
      imported from react
   */
   const handleClick = useCallback(() => {
       //first let define the current-query
       let currentQuery = {};

       /* Now we are going to check if we have
          params cause params can be a type of
          null
       */
      if (params) {
        currentQuery = qs.parse(params.toString());
        /* we parse them so that they are an object 
           and not a string
           Note: params to string is a string
        */
      }

      const updatedQuery: any = {
        /* updated query with an option of any */
        ...currentQuery,
        category: label
        /* category will be the current label */
        /* Now we spread the current query and add 
           the new category in there
        */
      }

      if (params?.get('category') === label) {
        delete updatedQuery.category
        /* if the new category is already selected
           we need to remove from our updated query,
           we want to deselect it if we are clicking 
           on it again just like a toggle on and off
        */
      }

      /* and now we generate the url string using
         query-string stringify url 
      */
      const url = qs.stringifyUrl({
        url: '/',// our path name is always going to be a slash /
        query: updatedQuery // this is the newest query
      }, { skipNull: true });//Now we have filtered out all of the empty options

      router.push(url);
     },[label, params, router])
   
    return ( 
            <div
                onClick={handleClick} 
                className={`
                    flex
                    flex-col
                    items-center
                    justify-center
                    gap-2
                    p-3
                    border-b-2
                    hover:text-neutral-800
                    transition
                    cursor-pointer
                    ${selected ? 'border-b-neutral-800' : 'border-transparent'}
                    ${selected ? 'text-neutral-800' : 'text-neutral-500'}
                `}
            >
                <Icon size={27} />
                <div className="font-medium text-sm">
                    {label}
                </div>
            </div>
     );
}
 
export default CategoryBox;