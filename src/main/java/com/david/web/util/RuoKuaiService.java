package com.david.web.util;

import com.david.web.config.TicketConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.data.util.Pair;
import org.springframework.http.*;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.io.Serializable;
import java.nio.file.Path;
import java.security.MessageDigest;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

import static java.util.stream.Collectors.toList;

@Service
public class RuoKuaiService {

    private RestTemplate restTemplate = new RestTemplate();

    @Autowired
    private TicketConfig ticketConfig;

    public RuoKuaiService() {
        MappingJackson2HttpMessageConverter mappingJackson2HttpMessageConverter = new MappingJackson2HttpMessageConverter();
        mappingJackson2HttpMessageConverter.setSupportedMediaTypes(Arrays.asList(MediaType.APPLICATION_JSON, MediaType.ALL));
        restTemplate.getMessageConverters().add(mappingJackson2HttpMessageConverter);    }

    public void error(String id) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON_UTF8));
        MultiValueMap<String, Object> map= new LinkedMultiValueMap<>();
        map.add("softid", "96061");
        map.add("softkey", "6facb9da7bb645ad9c4a229464b2cf89");
        map.add("username", ticketConfig.getRuokuai().getUsername());
        map.add("password", MD5(ticketConfig.getRuokuai().getPassword()));

        map.add("id", id);

        HttpEntity<MultiValueMap<String, Object>> request = new HttpEntity<>(map, headers);

        ResponseEntity<Object> errorResponse = restTemplate.exchange("http://api.ruokuai.com/reporterror.json", HttpMethod.POST, request, Object.class);

    }

    public Pair<String,String> check(Path path) throws IOException {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON_UTF8));
        MultiValueMap<String, Object> map= new LinkedMultiValueMap<>();
        map.add("softid", "96061");
        map.add("softkey", "6facb9da7bb645ad9c4a229464b2cf89");
        map.add("username", ticketConfig.getRuokuai().getUsername());
        map.add("password", MD5(ticketConfig.getRuokuai().getPassword()));
        map.add("typeid", "6113");

        map.add("image", new FileSystemResource(path.toString()));

        HttpEntity<MultiValueMap<String, Object>> request = new HttpEntity<>(map, headers);

        ResponseEntity<Response> captchaCheckResponse = restTemplate.exchange("http://api.ruokuai.com/create.json", HttpMethod.POST, request, Response.class);
        System.out.println(captchaCheckResponse.getStatusCode());

        Response responseBody = captchaCheckResponse.getBody();
        List<Integer> decodeResult = new ArrayList<>();
        String id = "";
        if(responseBody.getResult()!=null) {
            String result = responseBody.getResult();
            for(int i = 0 ; i < result.length() ; i++) {
                decodeResult.add(Character.getNumericValue(result.charAt(i)));
            }
            id = responseBody.getId();

        }

        List<Integer> coordinatesList = decodeResult.stream().map(item -> {
            if (item == 1) {
                return Arrays.asList(46, 42);
            } else if (item == 2) {
                return Arrays.asList(46, 105);
            } else if (item == 3) {
                return Arrays.asList(45, 184);
            } else if (item == 4) {
                return Arrays.asList(48, 256);
            } else if (item == 5) {
                return Arrays.asList(36, 117);
            } else if (item == 6) {
                return Arrays.asList(112, 115);
            } else if (item == 7) {
                return Arrays.asList(114, 181);
            } else if (item == 8) {
                return Arrays.asList(111, 252);
            } else {
                return null;
            }
        }).filter(Objects::nonNull).flatMap(List::stream).collect(toList());

        return Pair.of(coordinatesList.toString().replaceAll("\\[","").replaceAll("\\]","").replaceAll(" ",""), id);
    }


    public final static String MD5(String s) {
        char hexDigits[] = { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F' };
        try {
            byte[] btInput = s.getBytes();
            MessageDigest mdInst = MessageDigest.getInstance("MD5");
            mdInst.update(btInput);
            byte[] md = mdInst.digest();
            int j = md.length;
            char str[] = new char[j * 2];
            int k = 0;
            for (int i = 0; i < j; i++) {
                byte byte0 = md[i];
                str[k++] = hexDigits[byte0 >>> 4 & 0xf];
                str[k++] = hexDigits[byte0 & 0xf];
            }
            return new String(str);
        } catch (Exception e) {

            return null;
        }
    }

    private static class Response implements Serializable {
        public String Result;
        public String Id;

        public String getResult() {
            return Result;
        }

        public void setResult(String result) {
            Result = result;
        }

        public String getId() {
            return Id;
        }

        public void setId(String id) {
            Id = id;
        }
    }

}

