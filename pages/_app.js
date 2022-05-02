import '../styles/globals.css'
import { HashConnect } from 'hashconnect'
import HashConnectProviderAPI from '../contexts/Hashpack'
import { Grommet, Header, Image } from 'grommet'
import React, { useState } from 'react';
import TopHeader from '../components/header';
import { HomeTheme } from '../Themes/Hometheme';

import styles from '../styles/Home.module.css'

const Hashconnect = new HashConnect(true)



function MyApp({ Component, pageProps }) {

  const [isDarkMode, setDarkMode] = useState(true);

  return (
  
  <HashConnectProviderAPI hashConnect={Hashconnect}>

              <Grommet theme={HomeTheme} themeMode={isDarkMode? 'dark': 'light'}>

                <TopHeader toggleTheme={() => setDarkMode(!isDarkMode)} isDarkMode={isDarkMode}/>
              
                <Component {...pageProps} />


                  <footer className={styles.footer}>
                  Powered by{' '}
             
              <span className={styles.logo}> 
                <Image src="/assets/mainUnhash.png" alt="" width={72} height={50} />
              </span>
   
                </footer>
              
              </Grommet>
          </HashConnectProviderAPI> )
}

export default MyApp
