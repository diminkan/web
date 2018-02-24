package com.david.web.model;

import java.util.Map;

/**
 * Created by diminkan on 4/2/2018.
 */
public class TicketData
{
    private String[] result;

    private String flag;

    private Map map;

    public String[] getResult ()
    {
        return result;
    }

    public void setResult (String[] result)
    {
        this.result = result;
    }

    public String getFlag ()
    {
        return flag;
    }

    public void setFlag (String flag)
    {
        this.flag = flag;
    }

    public Map getMap ()
    {
        return map;
    }

    public void setMap (Map map)
    {
        this.map = map;
    }

    @Override
    public String toString()
    {
        return "ClassPojo [result = "+result+", flag = "+flag+", map = "+map+"]";
    }
}
