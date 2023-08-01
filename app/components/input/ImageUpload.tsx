'use client'
/* For the Image Upload we are going to use a 
   cloudinary Account 
*/

import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useCallback } from "react";
import { TbPhotoPlus } from "react-icons/tb";

//Now let declare some global variable for cloudinary
declare global {
    var cloudinary: any;
}

interface ImageUploadProps {
    /* onchange have a value which is a type of string
       and return a void.
    */
    onChange: (value: string) => void
    value: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    // now let extract onchange and value like that.  
    onChange,
    value
}) => {
    /* Now let write the option for successful upload. */
    const handleUpload = useCallback((result: any) => {
    /* handleUpload accept a result which is a type of
       any.
    */
        onChange(result.info.secure_url)
    }, [onChange])

    return ( 
        <CldUploadWidget
            onUpload={handleUpload}
            uploadPreset="za8r1djh"
            options={{
                maxFiles: 1
            }}
            /* we would open a curly bracket and we are 
               going to open a function and we are going to
               destructure open from it and then return an
               arrow function.
            */
        >
            {({ open }) => {
                return (
                    <div
                        onClick={() => open?.()}
                        className="
                            relative
                            cursor-pointer
                            hover:opacity-70
                            transition
                            border-dashed
                            border-2
                            p-20
                            border-neutral-300
                            flex
                            flex-col
                            justify-center
                            items-center
                            gap-4
                            text-neutral-600
                        "
                    >
                        <TbPhotoPlus size={50} />
                        <div className="font-semibold text-lg">
                            Click to upload
                        </div>
                        {value && (
                            <div
                                className="absolute inset-0 w-full h-full"
                            >
                                <Image 
                                    alt="Upload"
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    src={value}
                                />
                            </div>
                        )}
                    </div>
                )
            }}
        </CldUploadWidget>
     );
}
 
export default ImageUpload;