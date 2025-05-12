// components/WordPressFooter.tsx
"use client"
import { useEffect, useState } from 'react';
export default function WordPressFooter() {
    const [footerHtml, setFooterHtml] = useState('');
  
    useEffect(() => {
      const fetchFooter = async () => {
        
          const response = await fetch('https://uccricket.live/wp-json/uc-cricket/v1/footer');
          const data = await response.json();
          setFooterHtml(data.html || '');
        
      };
  
      fetchFooter();
    }, []);
  console.log("setFooterHtml",setFooterHtml);
    return (
      <div 
        className="wp-footer" 
        dangerouslySetInnerHTML={{ __html: footerHtml }}
      />
    );
  }