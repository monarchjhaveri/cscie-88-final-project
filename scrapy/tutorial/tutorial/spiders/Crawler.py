from twisted.internet import reactor
from scrapy.crawler import CrawlerProcess
from twisted.internet import task
import sys
sys.path.insert(0, '/Users/labuser/Desktop/tutorial/tutorial/spiders')
import StackSpider

def run_crawl():
    """
    Run a spider within Twisted. Once it completes,
    wait 5 seconds and run another spider.
    """
    runner = CrawlerProcess({
        'USER_AGENT': 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1)',
        'FEED_FORMAT': 'csv',
        'FEED_URI' : 'blanks.csv'
        })
    deferred = runner.crawl(StackSpider.StackSpider())


l = task.LoopingCall(run_crawl)
l.start(5)

reactor.run()   # you have to run the reactor yourself


