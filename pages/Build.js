import mainStyles from '../styles/Build.module.css'
import React from 'react'
import { motion, useTransform, useViewportScroll, scrollY} from 'framer-motion'


import { Grommet, Header, Image, WorldMap } from 'grommet'



function Build() {


  //Logic

  const {scrollY, scrollYProgress} = useViewportScroll()

//Lower opacity from 1 - 0 on scroll with range 0px to 200px
  const opacity = useTransform(scrollY, [0,200], [1,0])


     return (




      <div className={mainStyles.main}>
      
      <main className={mainStyles.mapSection}>
        
      <h1 className={mainStyles.mainText}>
      We are committed to helping people make the world a better place through quality software one entrepreneur at a time.
     </h1>
     
     <motion.div style={{opacity}} >
      <WorldMap className={mainStyles.map }
  color="white"
  onSelectPlace={(lat, lon) => {}}
  places={[
    {
      name: 'Los Angeles',
      location: [34.0522, -118.2437],
      color: 'accent-2',
      onClick: (name) => {},
    },
    {
      name: 'New York',
      location: [41.7624, -76.9738 ],
      color: 'accent-2',
      onClick: (name) => {},
    }



  ]}
  selectColor="accent-2"
/>
      </motion.div>
  
 
    </main>
    
    
    
    </div>

  )
}

export default Build