import { useEffect } from "react";

export default function HighRisk() {
  useEffect(() => {
    const load = () => {
      new window.MaverickClient({
        target: 'maverick',
        url: window.webroot + "/js/campaign/client.js",
        options: {
          id: '1243',
          agentId: '1440',
          referral: '1',
          title: '',
          theme: 'light',
          label: 'true'
        }
      });
    };

    if (typeof window.MaverickClient === 'undefined') {
      window.webroot = "https://ezpaydashboard.com";
      const script = document.createElement('script');
      script.async = true;
      script.src = window.webroot + "/js/campaign/client.js?v=" + Date.now();
      document.getElementsByTagName('head')[0].appendChild(script);
      script.onload = script.onreadystatechange = function () { load(); };
    } else {
      load();
    }
  }, []);

  return (
    <div>
      <div id="maverick"></div>
    </div>
  );
}