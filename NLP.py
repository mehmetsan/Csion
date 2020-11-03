import pythonWatson as pw
import csionLDA as lda
import globalMethods as gm
from pymongo import MongoClient
import sys

unseen_document     = sys.argv[1]
USERID              = sys.argv[2]



watsonResults   = pw.findKeywords(unseen_document)


if(watsonResults == -1):
  sys.exit()

ldaResults      = lda.find(unseen_document)
combined        = watsonResults + ldaResults


cluster = MongoClient("mongodb+srv://mehmetsan:Northern61@clustermehmet-aio9p.mongodb.net/test?retryWrites=true&w=majority")
db = cluster["Personality"]
collection = db['users']

results = collection.find({})
post = ''

for each in results:
    if(str(each['_id']) == USERID):
        post = each
        break
     
personalityType = post['personalityType'] 



collection = db['personalities']
results = collection.find({})
post = ''
for each in results:
    if(each['type'] == personalityType):
        post = each
        break



tends           = post["tends"]
strengths       = post["strengths"]
weaknesses      = post["weaknesses"]
motivations     = post["motivations"]
stresses        = post["Stresses"]
posCareer       = post["positiveCareer"]
negCareer       = post["negativeCareer"]
posFriendship   = post["positiveFriendship"]
negFriendship   = post["negativeFriendship"]
posRelationship = post["positiveRelationship"]
negRelationship = post["negativeRelationship"]



lists = [tends,strengths,weaknesses,motivations,stresses,posCareer,negCareer,posFriendship,
         negFriendship,posRelationship,negRelationship]

encourages  = []
discourages = []




for keyword in combined:
    featIndex = 0
    for feat in lists:
        for each in feat:
            if(gm.partialMatch( each, keyword)):
                if(featIndex in [ 1, 3, 5, 7, 9]):
                    if( each not in encourages):      
                        encourages.append(each)
                else:
                    if( each not in discourages):      
                        discourages.append(each)
        
        featIndex += 1              

posSize = len(encourages)  
negSize = len(discourages) 

result = 100 * (posSize/(posSize + negSize))
  
res = {
       "encourageKeywords"   : encourages, 
       "discourageKeywords"  : discourages, 
       "ratio"               : result, 
       "type"                : personalityType
       }


print(res)