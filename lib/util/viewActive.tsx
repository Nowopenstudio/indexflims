'use client'

import React, {useEffect, useRef } from 'react';
import {motion, useInView, useAnimation } from "framer-motion";
import useResize from '../hooks/useResize';




export function ViewActive({children, styleSet, count}:any){
   const ref= useRef<HTMLDivElement>(null!)
     const { mobile} = useResize()
   const isInView = useInView(ref,{once:false,margin: "-50% 0px -50% 0px"})


    
   useEffect(()=>{
    if(isInView && mobile){
       const el = document.getElementsByClassName('itemActive')
       if(el.length){
        el[0].classList.remove('itemActive')
       }
      if(ref.current){
        ref.current.classList.add('itemActive')
        console.log('active')
      }
    }
   },[isInView])
   return(
      
            <motion.div ref={ref} className={styleSet}
            >{children}</motion.div>

    
    )
}