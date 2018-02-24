package com.david.web.util;

import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.message.BasicNameValuePair;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Service
public class HttpService {

    private static final Logger logger = LoggerFactory.getLogger(HttpService.class);

    @Autowired
    private HttpClient httpClient;

    private RequestConfig requestConfig;

    public HttpService() {
        requestConfig = RequestConfig.custom()
                .setConnectTimeout(50000).setConnectionRequestTimeout(10000)
                .setSocketTimeout(50000).build();
    }

    public String get(String url) throws Exception{
        CloseableHttpResponse response = null;
        logger.info("get request:" + url);
        HttpGet httpGet = new HttpGet(url);
        httpGet.setConfig(requestConfig);

        try {
            response = (CloseableHttpResponse) httpClient.execute(httpGet);
            InputStream x = response.getEntity().getContent();
            return inputStreamTOString(x);
        } finally {
            response.close();
        }
    }

    public byte[] getForFile(String url) throws Exception{
        CloseableHttpResponse response = null;
            logger.info("get request:" + url);
            HttpGet httpGet = new HttpGet(url);
            httpGet.setConfig(requestConfig);
        try {
            response = (CloseableHttpResponse)httpClient.execute(httpGet);
            return inputStreamTOByteArray(response.getEntity().getContent());
        }finally {
            response.close();
        }
    }

    public String post(String url, String parameter) throws Exception{
        CloseableHttpResponse response = null;
        logger.info("post request:" + url + "?" + parameter);
        List<NameValuePair> formParams = new ArrayList<NameValuePair>();
        if (parameter != null && parameter.length() > 0){
            String[] parameters = parameter.split("&");
            for (int i = 0; i < parameters.length; i++) {
                String[] kv = parameters[i].split("=");
                String k = kv[0];
                String v = kv.length > 1 ? kv[1] : "";
                formParams.add(new BasicNameValuePair(k, v));
            }
        }
        HttpPost httpPost = new HttpPost(url);
        httpPost.setConfig(requestConfig);
        UrlEncodedFormEntity uefEntity = new UrlEncodedFormEntity(formParams, "UTF-8");
        httpPost.setEntity(uefEntity);
        try {
            response = (CloseableHttpResponse) httpClient.execute(httpPost);
            InputStream x = response.getEntity().getContent();
            return inputStreamTOString(x);
        }finally {
            response.close();
        }
    }

    private String inputStreamTOString(InputStream in) throws Exception{
        ByteArrayOutputStream outStream = new ByteArrayOutputStream();
        byte[] data = new byte[1024];
        int count;
        while((count = in.read(data,0,1024)) != -1){
            outStream.write(data, 0, count);
        }
        return new String(outStream.toByteArray(), "utf-8");
    }

    private byte[] inputStreamTOByteArray(InputStream in) throws Exception{
        ByteArrayOutputStream outStream = new ByteArrayOutputStream();
        byte[] data = new byte[1024];
        int count;
        while((count = in.read(data,0,1024)) != -1){
            outStream.write(data, 0, count);
        }
        return outStream.toByteArray();
    }

}
