package com.david.web.service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.david.web.config.TicketConfig;
import com.david.web.util.HttpService;
import com.david.web.util.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.TimeUnit;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.StreamSupport;

import static java.util.stream.Collectors.toList;

@Service
public class TicketService {

    private static final Logger logger = LoggerFactory.getLogger(TicketService.class);

    @Autowired
    private HttpService httpService;

    @Autowired
    private TicketConfig ticketConfig;

    @Autowired
    private RuoKuaiService ruoKuaiService;

    public void service(String fromStation, String toStation, String trainDate, String trainCode) throws Exception {
        login();
        String[] trainInfo = queryTrain(fromStation, toStation, trainDate, trainCode);
        submit(trainInfo, trainDate);
    }

    public void login() throws Exception {
        String result = null;

        if(!checkCaptcha(3)){
            logger.error("check captcha failed");
            throw new RuntimeException("check captcha failed");
        }

        int index = 30;
        while (index > 0){
            result = httpService.post(Constant.HOST + "/passport/web/login", String.format("username=%s&password=%s&appid=otn", ticketConfig.getUsername(), ticketConfig.getPassword()));
            System.out.println("login="+result);
            if (result != null && result.length() > 0){
                break;
            }
            index--;
        }
        if (result == null || result.length() == 0){
            logger.error("Login failed");
            throw new RuntimeException("Login failed");
        }

        JSONObject msgJson = JSON.parseObject(result);
        if (0 != msgJson.getInteger("result_code")){
            logger.info(msgJson.getString("result_message"));
            throw new RuntimeException("Login failed");
        }
        logger.info(msgJson.getString("result_message"));
        String uamtk = msgJson.getString("uamtk");

        httpService.post(Constant.HOST + "/otn/login/userLogin", "_json_att=");
        httpService.get(Constant.HOST + "/otn/passport?redirect=/otn/login/userLogin");
        result = httpService.post(Constant.HOST + "/passport/web/auth/uamtk", "appid=otn");
        msgJson = JSON.parseObject(result);
        String newapptk = msgJson.getString("newapptk");

        httpService.post(Constant.HOST + "/otn/uamauthclient", "tk="+newapptk);

        httpService.get(Constant.HOST + "/otn/index/initMy12306");
    }

    private boolean checkCaptcha(int retries) throws Exception {
        String result;
        while(retries-->0) {
            byte[] img = httpService.getForFile(Constant.HOST + "/passport/captcha/captcha-image?login_site=E&module=login&rand=sjrand&" + new Random().nextDouble());

            Path tmpFile = Files.createTempFile("captcha", ".png");
            Files.write(tmpFile, img);
            Pair<String, String> ruoKuaiResponse = ruoKuaiService.check(tmpFile);

            result = httpService.post(Constant.HOST + "/passport/captcha/captcha-check",
                    "answer=" + ruoKuaiResponse.getFirst() + "&login_site=E&rand=sjrand");
            JSONObject msgJson = JSON.parseObject(result);
            logger.info(msgJson.getString("result_message"));
            if (4 == msgJson.getInteger("result_code")) {
                return true;
            } else {
                ruoKuaiService.error(ruoKuaiResponse.getSecond());
            }

            Thread.sleep(1000L);
        }
        return false;
    }

    public List<Map<String,String>> queryTrain(String fromStation, String toStation, String trainDate) throws Exception{

        String  result = httpService.get(Constant.HOST + String.format("/otn/leftTicket/queryZ?leftTicketDTO.train_date=%s&" +
                        "leftTicketDTO.from_station=%s&leftTicketDTO.to_station=%s&purpose_codes=ADULT", trainDate,
                fromStation, toStation));
        JSONObject msgJson = JSON.parseObject(result);
        JSONArray jsonArray = msgJson.getJSONObject("data").getJSONArray("result");
        return (StreamSupport.stream(jsonArray.spliterator(), false).map(item ->{
            Map<String,String> map = new HashMap<>();
            String[] splitString = ((String)item).split("\\|");

            map.put("no", splitString[3]);
            map.put("from", splitString[6]);
            map.put("to", splitString[7]);
            map.put("start", splitString[4]);
            map.put("end", splitString[5]);
            map.put("startTime", splitString[8]);
            map.put("endTime", splitString[9]);
            map.put("duration", splitString[10]);
            map.put("secondClass", splitString[30]);
            map.put("firstClass", splitString[31]);
            map.put("businessClass", splitString[32]);

            return map;
        }).collect(toList()));
    }

    public String[] queryTrain(String fromStation, String toStation, String trainDate, String trainCode) throws Exception{
        String result = httpService.get(Constant.HOST + String.format("/otn/leftTicket/log?leftTicketDTO.train_date=%s&" +
                        "leftTicketDTO.from_station=%s&leftTicketDTO.to_station=%s&" +
                        "purpose_codes=ADULT", trainDate,
                fromStation, toStation));
        JSONObject msgJson = JSON.parseObject(result);
        if (!msgJson.getBoolean("status")){
            logger.info("出行信息有误.");
            System.exit(0);
        }
        result = httpService.get(Constant.HOST + String.format("/otn/leftTicket/queryZ?leftTicketDTO.train_date=%s&" +
                        "leftTicketDTO.from_station=%s&leftTicketDTO.to_station=%s&purpose_codes=ADULT", trainDate,
                fromStation, toStation));
        msgJson = JSON.parseObject(result);
        JSONArray jsonArray = msgJson.getJSONObject("data").getJSONArray("result");
        String matchResult = (String)StreamSupport.stream(jsonArray.spliterator(), false).filter(item -> ((String)item).split("\\|")[3].equals(trainCode)).findFirst().get();

        return  matchResult.split("\\|");

    }

    public void submit(String[] trainInfo, String trainDate) throws Exception {
        String secretStr = trainInfo[0];
        String trainNo = trainInfo[2];
        String trainStationNO = trainInfo[3];
        String fromStation = trainInfo[6];
        String toStation = trainInfo[7];
        String leftTicket = trainInfo[12];
        String trainLocation = trainInfo[15];

        httpService.post(Constant.HOST + "/otn/login/checkUser", "_json_att=");
        String result = httpService.post(Constant.HOST + "/otn/leftTicket/submitOrderRequest", "secretStr="+URLDecoder.decode(secretStr,"UTF-8")+"&train_date=" + trainDate+ "&back_train_date=2018-02-11&tour_flag=dc&purpose_codes=ADULT&query_from_station_name="+fromStation+"&query_to_station_name="+toStation+"&undefined");
        logger.info(result);
        result = httpService.post(Constant.HOST + "/otn/confirmPassenger/initDc", "_json_att=");
        logger.info(result);

        String token="";
        String key_check_isChange="";
        Pattern pattern = Pattern.compile("var globalRepeatSubmitToken = '(.*?)'");
        Pattern pattern1 = Pattern.compile("'key_check_isChange':'(.*?)'" );
        Matcher matcher = pattern.matcher(result);
        Matcher matcher1 = pattern1.matcher(result);
        if (matcher.find())
        {
            token = matcher.group(1);
            logger.info(token);
        }

        if (matcher1.find())
        {
            key_check_isChange = matcher1.group(1);
            logger.info(key_check_isChange);
        }

        result = httpService.post(Constant.HOST + "/otn/confirmPassenger/getPassengerDTOs", "_json_att=&REPEAT_SUBMIT_TOKEN="+token);
        logger.info(result);
        JSONObject msgJson = JSON.parseObject(result);
        String passengerName = msgJson.getJSONObject("data").getJSONArray("normal_passengers").getJSONObject(0).getString("passenger_name");
        String passengerId = msgJson.getJSONObject("data").getJSONArray("normal_passengers").getJSONObject(0).getString("passenger_id_no");
        String passengerMobile = msgJson.getJSONObject("data").getJSONArray("normal_passengers").getJSONObject(0).getString("mobile_no");

        String newPassengerStr = "O,0,1,"+passengerName+",1,"+passengerId+","+passengerMobile+",N";
        String oldPassengerStr = passengerName+",1,"+passengerId+",1_";

        result = httpService.post(Constant.HOST+"/otn/confirmPassenger/checkOrderInfo", "cancel_flag=2&bed_level_order_num=000000000000000000000000000000&passengerTicketStr="+newPassengerStr+"&oldPassengerStr="+oldPassengerStr+"&tour_flag=dc&randCode=&whatsSelect=1&_json_att=&REPEAT_SUBMIT_TOKEN=" + token);
        logger.info(result);


        result = httpService.post(Constant.HOST+"/otn/confirmPassenger/confirmSingleForQueue", String.format("passengerTicketStr=%s&oldPassengerStr=%s&randCode=&purpose_codes=00&key_check_isChange=%s&leftTicketStr=%s&train_location=Q7&choose_seats=&seatDetailType=000&whatsSelect=1&roomType=00&dwAll=N&_json_att=&REPEAT_SUBMIT_TOKEN=%s", newPassengerStr,oldPassengerStr,key_check_isChange,leftTicket,token));
        logger.info(result);
    }
}
