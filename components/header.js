import React, {useState} from 'react'
import { Grommet, Nav, Box, Collapsible, Text, Button, Grid, Header } from 'grommet'
import { Home, Menu } from 'grommet-icons'
import Link from 'next/link'
import { HomeTheme } from '../Themes/Hometheme'


import Image from 'next/image'


 function CollapsibleMenu() {
    const [open, setOpen] = useState(false);

    return (
      <Box align="start">
        <Button primary onClick={() => setOpen(!open)} label="Toggle" /> 
        <Collapsible open={open}>
          <Box
            background="light-2"
            round="medium"
            pad="medium"
            align="center"
            justify="center"
          >
            <Text>This is a box inside a Collapsible component</Text>
          </Box>
        </Collapsible>
        
      </Box>
    )}


function TopHeader(props) {
  return (
      <Grommet theme={HomeTheme} themeMode={props.isDarkMode ? 'dark' : 'light' }>
           <Grid 
                fill
                rows={['auto', 'flex']}
                columns={['auto', 'flex']}
                gap="small"
                areas={[
                    { name: 'header', start: [0, 0], end: [1, 0] }
                            ]}>

        <Header background="Nav"  gridArea='header'>

         <Link href={'/'}>
     <Button icon={<Home />} hoverIndicator />
                </Link>

  <Button  onClick={props.toggleTheme} icon={<Menu />} hoverIndicator />

</Header>

      
           </Grid>

      
      
      </Grommet>
     
  )
}

export default TopHeader