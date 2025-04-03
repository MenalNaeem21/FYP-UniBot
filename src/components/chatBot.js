import { useEffect } from "react";

const Chatbot = () => {
  useEffect(() => {
    const script1 = document.createElement("script");
    script1.src = "https://cdn.botpress.cloud/webchat/v2.3/inject.js";
    script1.async = true;
    document.body.appendChild(script1);

    const script2 = document.createElement("script");
    script2.src = "https://files.bpcontent.cloud/2025/03/15/11/20250315113013-9VL7504E.js";
    script2.async = true;
    document.body.appendChild(script2);
  }, []);

  return null; // No visible UI, just injects the bot
};

export default Chatbot;
