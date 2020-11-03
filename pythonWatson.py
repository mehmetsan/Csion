import requests
import json
import globalMethods as gm
import sys

##################################################
#############-------KEYWORDS-------###############
##################################################


def findKeywords(text):

    #CURL CONNECTION PART
    headers = {'Content-Type': 'application/json'}
    data = '{"text":"'+text+'","features":{"sentiment":{},"categories":{},"concepts":{},"entities":{},"keywords":{}}}'
    analyzeText = requests.post('https://gateway-lon.watsonplatform.net/natural-language-understanding/api/v1/analyze?version=2019-07-12', headers=headers, data=data, auth=('apikey', '7LNEjCMvP6ZcNShjAkjPob7QSCfIHeZMQkn4Ho3dQgte'))


    textResults = analyzeText.json()


    if(( 'keywords' not in textResults.keys()) or ('422' in str(textResults) )or ('content is empty' in str(textResults))):
      print("Not enough detail please try again")
      return -1
    

    keywords = textResults["keywords"]

    newKeywords = gm.capitalizeToList(keywords)
    
    keywords = [each['text'] for each in newKeywords]
    return keywords



