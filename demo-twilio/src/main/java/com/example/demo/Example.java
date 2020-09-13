package com.example.demo;

// Install the Java helper library from twilio.com/docs/java/install

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Call;
import com.twilio.type.PhoneNumber;
import com.twilio.type.Twiml;

public class Example {
    // Find your Account Sid and Token at twilio.com/console
    // DANGER! This is insecure. See http://twil.io/secure
    public static final String ACCOUNT_SID = "AC48c369f9799036ec145408543a52fbc5";
    public static final String AUTH_TOKEN = "4ae4caf3dcf5e405992c20e6cec123bd";

    public static void main(String[] args) {
        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);
        Call call = Call.creator(
                new com.twilio.type.PhoneNumber("+917259671671"),
                new com.twilio.type.PhoneNumber("+917259671671"),
                new com.twilio.type.Twiml("<Response><Say>Hi Chaitanya and keerhi...Maggi tinnara...emi chestunnave !</Say></Response>"))
            .create();

        System.out.println(call.getSid());
    }
}
