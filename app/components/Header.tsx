'use client'

interface HeaderProps { /*will have the following property */
    title: string;
    subtitle?: string;
    center?: boolean; /* Optional Boolean */
}

const Header: React.FC<HeaderProps> = ({
    title,
    subtitle,
    center      
}) => {
    return ( 
        <div className={center ? 'text-center' : 'text-start'}>
            <div className="text-2xl font-bold">
                {title}
            </div>
            <div className="font-light text-neutral-500 mt-2">
                {subtitle}
            </div>
        </div>
     );
}
 
export default Header;