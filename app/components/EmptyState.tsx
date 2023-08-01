//since we are using hooks->useRouter, at the top let make sure it 
// a use client

'use client'

import { useRouter } from "next/navigation";
import Header from "./Header";
import Button from "./Button";

interface EmptyStateProps {
    //props with their types
    title?: string;
    subtitle?: string;
    showReset?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({
    //we then extract the props
    title="No exact matches",
    subtitle="Try changing or removing some of your filters",
    showReset
}) => {
    //let add our router
    const router = useRouter();
    return ( 
        <div
            className="
                h-[60vh]
                flex
                flex-col
                gap-2
                justify-center
                items-center
            "
        >
            <Header 
                //we can also add a center props
                center
                title={title}
                subtitle={subtitle}
            />
            <div className="w-48 mt-4">
                {showReset && (
                    <Button 
                        outline
                        label="Remove all filters"
                        onClick={() => router.push('/')}
                        /* it going to call router and push
                           to an empty slash so you can restart
                           all of the filters.
                        */
                    />
                )}
            </div>
        </div>
     );
}
 
export default EmptyState;