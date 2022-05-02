import React from 'react'
import { Main, Heading, Paragraph, Box, Image, Stack } from 'grommet'
import { motion, useMotionValue, useTransform, useViewportScroll, scrollY } from 'framer-motion'


import mainStyles from '../styles/Home.module.css'


function MainSection() {
  const variants = {
    hidden: { opacity: 0, scale: .5 },
    visible: { opacity: 1, scale: 1 },
  }

  const { scrollY, scrollYProgress } = useViewportScroll()

  const opacity = useTransform(scrollY, [0,200], [1,0])
  const scale = useTransform(scrollY, [0,200, 400 ], [1, 2, 1])
const questionScale =  useTransform(scrollY, [0,200], [.5, 1])

  const y =  useTransform(scrollY, [0,200], [0, -400])
  return (


           <>
               <main className={mainStyles.firstSection}>

            <motion.div animate={variants.visible} initial={variants.hidden} className={mainStyles.center} drag="y" style={{y,opacity, scale}}>
                 <Stack className={mainStyles.Stack}>
                      

                      <Box align='center' justify='center' >

                     <Box height="small" width="medium">
                     <Image src={'/assets/mainUnhash.png'}/>
                     </Box>
                  </Box>
                      </Stack> 
          </motion.div>


     </main>

<main className={mainStyles.mainSection}  >
                     <motion.div animate={variants.visible} initial={variants.hidden} className={mainStyles.center} drag="y" style={{ y, opacity, scale}}>
                     <Image fit='cover' src='/assets/mesh.jpeg' />
              
                    </motion.div>
                    
             <motion.div
                     justify="center"
                   style={{y,scale: questionScale}}
                  > 
                  <h1> Who are we? </h1> 


            </motion.div>
                    
                </main>
    </>
            
    
  )
}

export default MainSection