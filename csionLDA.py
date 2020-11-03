# -*- coding: utf-8 -*-
"""
Created on Mon May 25 16:11:17 2020

@author: MehmetSanisoglu
"""

import gensim
from gensim.utils import simple_preprocess
from gensim.parsing.preprocessing import STOPWORDS
import nltk
from nltk.stem import LancasterStemmer

import globalMethods as gm


lancaster=LancasterStemmer()
def lemmatize_stemming(text):
    return lancaster.stem(text)
def preprocess(text):
    result = []
    for token in gensim.utils.simple_preprocess(text):
        if token not in gensim.parsing.preprocessing.STOPWORDS and len(token) > 3:
            result.append(lemmatize_stemming(token))
    return result

'''
#GET THE DATA
data = data = pd.read_csv('Data\\blogtext.csv', error_bad_lines=False);
data2 = data[:300000]
data_text = data2['text'].apply(lambda x: x.replace('urlLink','').replace('blog',''))

documents = data_text.to_frame()

#PROCESS THE DOCS AND CREATE A DICTIONARY

processed_docs = documents['text'].map(preprocess)

dictionary = gensim.corpora.Dictionary(processed_docs)
dictionary.save("csionLDADictionary")

#GENSIM DICTIONARY TO BOW
bow_corpus = [dictionary.doc2bow(doc) for doc in processed_docs]

#TRAINING
lda_model = gensim.models.LdaMulticore(bow_corpus, num_topics=20, id2word=dictionary, passes=2)

lda_model.save("csionLDA")

'''
def find(textInput):
    lda2    = gensim.models.LdaMulticore.load("ldamodel/csionLDA")
    dict2   = gensim.corpora.Dictionary.load("ldamodel/csionLDADictionary")

    ##PREDICT

    unseen_document = textInput

    bow_vector = dict2.doc2bow(preprocess(unseen_document))


    relevanceSorted = sorted(lda2[bow_vector], key=lambda tup: -1*tup[1])

    topicIndex = relevanceSorted[0][0]
    temp = lda2.print_topic(topicIndex, 50).split('+')

    keywords = [entry.split('"')[1]  for entry in temp]
    return(gm.capitalizeList(keywords))

