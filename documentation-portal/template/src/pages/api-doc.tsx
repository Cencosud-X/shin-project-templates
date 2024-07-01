import React, { useEffect, useState } from 'react';
import { RedocStandalone } from 'redoc';
import Layout from '@theme/Layout';
window.location.reload();

function Redocusaurus(props: any) {
  const [spec, setSpec] = useState('');
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const urlValue: string = urlParams.get('url') ||  "";

  
  useEffect(() => {
    const fetchSpec = async () => {
      try {
        const response = await fetch(urlValue);
        const specContent = await response.json();
        setSpec(specContent);
      } catch (error) {
        console.error('Error fetching Swagger spec:', error);
      }
    };

    fetchSpec();
  }, [props.specUrl]);

  const options = {
    expandResponses: 'all',
    disableSearch: true,
    hideDownloadButton: true,
    hideSingleRequestSampleTab: true,
    hideHostname: true,
    requiredPropsFirst: true,
    noAutoAuth: true,
    nativeScrollbars: true,
    pathInMiddlePanel: true,
  };
  return (
    <Layout
    title={`API Docs`}
    description={`Open API Reference Docs for the API`}
  >
      {
        spec != "" && (
           <RedocStandalone
           specUrl={urlValue}
           options={options}
          />
        )
      }
    </Layout>
  );
}

export default Redocusaurus;