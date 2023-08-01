'use client'

import Image from "next/image";

interface AvatarProps {
    src: string | null | undefined;
    // string with the type of null or undefined
};

const Avatar: React.FC<AvatarProps> = ({
    src
}) => {
    return ( 
        <Image 
            className='rounded-full'
            width='30'
            height='30'
            alt='avatar'
            src={src || "/images/placeholder.jpg"}
            // it means src or image placeholder
        />
     );
}
 
export default Avatar;