
import React, { useState, useEffect } from 'react';




export default function useResize() {
    const [winX, setWidth] = useState<any>();
    const [winY,setHeight] = useState<any>();
    const [mobile,setMobile] = useState<any>(false);

    const onResize=()=>{
      setWidth(window.innerWidth)
      setHeight(window.innerHeight)
      if(window.innerWidth <= 850){
        setMobile(true)
      }else{
        setMobile(false)
      }
    }

  
    useEffect(() => {
      setWidth(window.innerWidth)
      setHeight(window.innerHeight)
      onResize();
      window.addEventListener("resize", onResize);
      return () => {
        window.removeEventListener("resize", onResize);
      }
  }, []);
      
    return {winX,winY,mobile}
    

    
  }


