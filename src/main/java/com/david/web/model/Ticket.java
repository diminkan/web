package com.david.web.model;

/**
 * Created by diminkan on 4/2/2018.
 */
public class Ticket
{
    private String status;

    private TicketData data;

    private String httpstatus;

    private String messages;

    public String getStatus ()
    {
        return status;
    }

    public void setStatus (String status)
    {
        this.status = status;
    }

    public TicketData getData ()
    {
        return data;
    }

    public void setData (TicketData data)
    {
        this.data = data;
    }

    public String getHttpstatus ()
    {
        return httpstatus;
    }

    public void setHttpstatus (String httpstatus)
    {
        this.httpstatus = httpstatus;
    }

    public String getMessages ()
    {
        return messages;
    }

    public void setMessages (String messages)
    {
        this.messages = messages;
    }

    @Override
    public String toString()
    {
        return "ClassPojo [status = "+status+", data = "+data+", httpstatus = "+httpstatus+", messages = "+messages+"]";
    }
}

