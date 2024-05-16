import { useEffect } from 'react';
import './live.css'
function ChatComponent() {
        useEffect(() => {
            if (!window.$crisp) {
            window.$crisp = [];
            window.CRISP_WEBSITE_ID = "7df05386-8225-4ae2-991f-4d285e3a2fb2"; // Replace "your-website-id" with the ID from Crisp
        
            (function () {
                const d = document;
                const s = d.createElement("script");
        
                s.src = "https://client.crisp.chat/l.js";
                s.async = 1;
                d.getElementsByTagName("head")[0].appendChild(s);
            })();
            }
        }, []);
        
        return null; // This component does not render anything
        }

export default ChatComponent;
