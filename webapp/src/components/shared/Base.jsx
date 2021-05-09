import React from 'react';
import Head from "next/head";
import config from 'react-reveal/globals';
import {ClientContext, GraphQLClient} from 'graphql-hooks'
import { ThemeProvider } from '@emotion/react'

config({ ssrFadeout: true });

import '../../styles/bootstrap.min.css';
import '../../styles/styles.css';
import 'srx/styles/styles.css';

const defaultSEOTags = {
    "siteName": "Register For Event",
    "tagLine": "",
    "description": ""
};

const graphQLEndpoint = process.env.GRAPHQL_SERVER_ENDPOINT || '/api/graphql/';


const Base = ({ children, meta }) => {
    const seoTags = process.env?.SEOTags || defaultSEOTags;

    const title = `${meta && meta.title ? `${meta.title} |` : '' } ${seoTags.siteName} - ${seoTags.tagLine}`;

    const GoogleAnalyticsIDs =  process.env?.analytics?.GoogleAnalyticsIDs || [];
    const FacebookPixelIDs = process.env?.analytics?.FacebookPixelIDs || []

    const client = new GraphQLClient({
        url: graphQLEndpoint,
        fetchOptions: {
            credentials: 'include'
        }
    });

    let theme = {
        colors: {
            primary: 'red',
            primaryInv: 'white'
        }
    };

    if(process?.env?.theme)
        theme = process.env.theme;



    return <React.Fragment>
        <Head>
            <title>{title}</title>
            <meta charSet='utf-8'/>
            <meta name='theme-color' content={theme.colors.primary} />
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <meta httpEquiv='X-UA-Compatible' content='IE=edge'/>
            <meta name="description" content={meta && meta.description ? meta.description : seoTags.description} />
            <meta name="twitter:title" content={title} />
            <meta property="og:title" content={title} />
            {   meta && meta.image && <meta property="og:image" content={meta.image} /> }
            <meta name="viewport" content="width=device-width, minimum-scale=1, shrink-to-fit=no, initial-scale=1" />
            <link rel="manifest" href="/manifest.json" />
            <link href='/images/icons/icon-72x72.png' rel='icon' type='image/png' sizes='72x72' />
            <link href='/images/icons/icon-96x96.png' rel='icon' type='image/png' sizes='96x96' />
            <link href='/images/icons/icon-128x128.png' rel='icon' type='image/png' sizes='128x128' />
            <link href='/images/icons/icon-152x152.png' rel='icon' type='image/png' sizes='144x144' />
            <link href='/images/icons/icon-152x152.png' rel='icon' type='image/png' sizes='152x152' />
            <link href='/images/icons/icon-180x180.png' rel='icon' type='image/png' sizes='180x180' />
            <link rel='apple-touch-icon' href='/images/icons/icon-180x180.png' />
            <link rel="shortcut icon" href="../images/icons/icon-72x72.png" />
            <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap" rel="stylesheet" />


            {GoogleAnalyticsIDs?.length > 0 && GoogleAnalyticsIDs.map((ID) =>
            <React.Fragment>
                <script rel="preconnect" async src={`https://www.googletagmanager.com/gtag/js?id=${ID}`} />
                <script dangerouslySetInnerHTML={{
                    __html: `
                          window.dataLayer = window.dataLayer || [];
                          function gtag(){dataLayer.push(arguments);}
                          gtag('js', new Date()); 
                          gtag('config', '${ID}');
                    `
                }} />
            </React.Fragment>)}

            {FacebookPixelIDs?.length > 0 && FacebookPixelIDs.map((ID) =>
            <React.Fragment>
                <script dangerouslySetInnerHTML={{
                    __html: `
                         !function(f,b,e,v,n,t,s)
                    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                        n.queue=[];t=b.createElement(e);t.async=!0;
                        t.src=v;s=b.getElementsByTagName(e)[0];
                        s.parentNode.insertBefore(t,s)}(window, document,'script',
                    'https://connect.facebook.net/en_US/fbevents.js');
                    fbq('init', '${ID}');
                    fbq('track', 'PageView');
                    `
                }} />
                <noscript>
                    <img
                        height="1" width="1" style={{ display: "none" }}
                        src={`https://www.facebook.com/tr?id=${ID}&ev=PageView&noscript=1`}
                    />
                </noscript>
            </React.Fragment>)}

        </Head>
        <div className="app">
            <ThemeProvider theme={theme}>
                <ClientContext.Provider value={client}>
                    {children}
                </ClientContext.Provider>
            </ThemeProvider>
        </div>
    </React.Fragment>
};

export default Base;