# -*- coding: utf-8 -*-
"""
Created on Sun Mar 29 21:29:42 2020

@author: MehmetSanisoglu
"""
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

def capitalize(entry):      #FORMAT A SENTENCE OF WORD
    capitalized = ""
    cap = True
    for i in range(len(entry)):
        if(cap):
            capitalized += entry[i].upper()
            cap = False
        else:
            if(entry[i] == " "):
                cap = True
            capitalized += entry[i].lower()
    return capitalized


def capitalizeList( myList ):   #FORMAT A LIST
    result = []
    for each in myList:
        capped = capitalize(each)
        result.append(capped)
    return result

def capitalizeToList( myList ):   #FORMAT A LIST
    result = []
    for dict in myList:
        dict["text"] = capitalize(dict["text"] )
        result.append(dict)
    return result

def partialMatch( word, test ):
    
    words = test.split(' ')
    
    if(len(words) == 1): #IF NOT MORE THAN ONE MORE WORD
        return (test.lower() in word.lower())
    else:
        for each in words:
            if( len(each) > 0 ): #LOOKING FOR NON-EMPTY ONES
                if( each.lower() in word.lower() ):
                    return True
        
        return False    #IF NO PARTIAL MATCHES HAS BEEN FOUND

def sendVerificationMail(mailAddress):

  mail_content = "Hello, This is a simple mail. There is only text, no attachments are there The mail is sent using Python SMTP library. Thank You"

  #The mail addresses and password
  sender_address = 'csionapp@gmail.com'
  sender_pass = 'csionBilkent'
  receiver_address = mailAddress
  
  #Setup the MIME
  message = MIMEMultipart()
  message['From'] = sender_address
  message['To'] = receiver_address
  message['Subject'] = 'A test mail sent by Python. It has an attachment.'   #The subject line
  #The body and the attachments for the mail
  message.attach(MIMEText(mail_content, 'plain'))
  #Create SMTP session for sending the mail
  session = smtplib.SMTP('smtp.gmail.com', 587) #use gmail with port
  session.starttls() #enable security
  session.login(sender_address, sender_pass) #login with mail_id and password
  text = message.as_string()
  session.sendmail(sender_address, receiver_address, text)
  session.quit()


