import { useEffect } from "react";

function Script({ onLoad, src, async = true, defer = false, ...rest }) {
    useEffect(() => {
        const script = document.createElement("script");

        script.src = src;
        script.async = async;
        script.defer = defer;

        Object.entries(rest).forEach(([key, value]) => {
            script.setAttribute(key, value);
        });

        if (onLoad) {
            script.onload = onLoad;
        }

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, [onLoad, src, async, defer]);

    return null;
}

export default Script;