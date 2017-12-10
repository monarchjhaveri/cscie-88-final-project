from scrapy import Spider
from scrapy.selector import Selector
from scrapy.http.request import Request

from scrapy.item import Item, Field
import os


class StackItem(Item):
    combo = Field()

class HeapItem(Item):
    url = Field()


class StackSpider(Spider):
    name = "stack"
    allowed_domains = ["npmjs.com"]
    start_urls = ["https://www.npmjs.com/package/browserify", 
                  "http://www.npmjs.com/package/grunt-cli", 
                  "http://www.npmjs.com/package/bower",
                  "http://www.npmjs.com/package/gulp", 
                  "http://www.npmjs.com/package/grunt", 
                  "http://www.npmjs.com/package/express",
                  "http://www.npmjs.com/package/npm", 
                  "http://www.npmjs.com/package/cordova", 
                  "http://www.npmjs.com/package/forever",
    ]

    def parse(self, response):
        siblings = Selector(response).xpath(".//h3[contains(text(),'Dependencies (')]/following-sibling::p")
        for sibling in siblings:
            attributes = sibling.xpath(".//a[contains(@href,'package')]/@href").extract()
            for attribute in attributes:
               item = StackItem()
               url  = HeapItem()
               item['combo'] = response.url + " " + "https://www.npmjs.com" + attribute + " " + "PARENT_OF"
               url['url'] = response.url 
               f = open('workfile.csv','a+')
               #if url['url'] not in f.read():
               f.write(url['url'] + os.linesep)
               f.close
               #yield url
               yield item
               yield Request("https://www.npmjs.com" + attribute, callback=self.parse)


