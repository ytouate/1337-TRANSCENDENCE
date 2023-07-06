import { useEffect } from "react";

export function useOnHoverOutside(ref, handler) {
    console.log('hook called');
    useEffect(() => {
        const listener = (event) => {
            if (!ref.current ) {
                return;
            }
            handler(event);
        };
        document.addEventListener("mouseover", listener);
        return () => {
            document.removeEventListener("mouseout", listener);
        };
    }, [ref, handler]);
}
