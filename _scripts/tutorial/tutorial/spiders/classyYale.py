import scrapy
from datetime import datetime

class ClassyYaleSpider(scrapy.Spider):
    name = "lists"

    examplesThatWork = [
        "http://english.yale.edu/faculty-staff",
        'http://americanstudies.yale.edu/people/faculty',
        'http://afamstudies.yale.edu/people/faculty', # Afam Studies
        'http://anthropology.yale.edu/people/faculty',      # Anthropology
        'http://archaeology.yale.edu/people/faculty',       # Archaelogy
        'http://ceas.yale.edu/people/ceas-faculty', # East Asian studies
        'http://economics.yale.edu/people/faculty', # Economics
        'http://ling.yale.edu/people',                # Linguistics,
        'http://politicalscience.yale.edu/people/faculty', # Political Science
        'http://clais.macmillan.yale.edu/people/faculty', #International Development
    ]

    start_urls = examplesThatWork

    def parse(self, response):
        deptName = response.css('.site-name a').xpath('string(.)').extract_first()
        if deptName is not None:
            deptName = deptName.strip()
        else:
            deptName = '---Department?---'
        # print response.url
        
        pageInfo = {
            'deptName': deptName,
            'url': response.url,
            
            'couldScrape': False,
            'visitDate': datetime.now(),

            'hasPicture': False,
            'hasName': False,
            'hasEdit': False,
            'hasInterests': False,
        }

        # follow all the faculty links
        for link in response.css('a.username::attr("href")').extract():
            url = response.urljoin(link)
            request = scrapy.Request(url, self.parseProfilePage)
            request.meta['deptName'] = deptName
            yield request

            pageInfo['couldScrape'] = True
            pageInfo['hasName'] = True
        
        # if the names aren't links, maybe the websites are

        # follow the next-page links
        for link in response.css('li.pager-next a::attr("href")').extract():
            # print link
            url = response.urljoin(link)
            yield scrapy.Request(url, self.parse)
        
        # some info about the department page
        yield pageInfo
    
    def parseProfilePage(self, response):
        deptName = response.meta['deptName']
        
        name = response.css('h1.title::text').extract_first().strip()
        email = response.xpath("string(//div[contains(@class,'field-email')])").extract_first()
        website = response.url
        
        interests = response.xpath("string(//div[contains(@class, 'areas-of-interest')])").extract_first()
        bio = response.xpath("string(//div[contains(@class,'field-bio')])").extract_first()

        if bio is None:
            bio = ''
        if interests is None:
            interests = ''
        
        bio = bio + interests
        
        prettybio = ' '.join(bio[:65].encode('utf-8').splitlines())
        print '{2: <20}\t{0: <25} {1}'.format(name.encode('utf-8'), prettybio, deptName.encode('utf-8'))
        print '{0: >125} [link]'.format(response.url)

        # yield {
        #     'name': name,
        #     'email': email,
        #     'bio': bio,
        #     'department': deptName,
        #     'website': website
        # }

        