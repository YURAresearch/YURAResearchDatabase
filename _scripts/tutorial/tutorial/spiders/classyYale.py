import scrapy
from datetime import datetime

class ClassyYaleSpider(scrapy.Spider):
    name = "lists"

    examplesThatWork = {
        "http://english.yale.edu/faculty-staff": "English",
        'http://americanstudies.yale.edu/people/faculty': "American Studies",
        'http://afamstudies.yale.edu/people/faculty': "Afam Studies",
        "http://anthropology.yale.edu/people/faculty":"Anthropology",
        'http://archaeology.yale.edu/people/faculty':"Archaelogy",
        'http://ceas.yale.edu/people/ceas-faculty':"East Asian Studies",
        'http://economics.yale.edu/people/faculty': "Economics",
        'http://ling.yale.edu/people': "Linguistics",
        'http://politicalscience.yale.edu/people/faculty': "Political Science",
        'http://clais.macmillan.yale.edu/people/faculty':"International Development",
    }

    start_urls = examplesThatWork.keys()

    def parse(self, response):
        if 'deptName' not in response.meta:
            deptName = response.css('.site-name a').xpath('string(.)').extract_first()
            if deptName is not None:
                deptName = deptName.strip()
            else:
                deptName = ClassyYaleSpider.examplesThatWork[response.url]
        else:
            deptName = response.meta['deptName']

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
            request = scrapy.Request(url, self.parse)
            request.meta['deptName'] = deptName
            yield request
        
        # some info about the department page
        self.log(pageInfo)
    
    def process(self, string):
        if string is None:
            return ''

        string = string.replace(r'\u00a0', '')
        string = string.strip()

        return string

    def parseProfilePage(self, response):
        deptName = response.meta['deptName']
        
        name = response.css('h1.title::text').extract_first()
        email = response.xpath("string(//div[contains(@class,'field-email')])").extract_first()
        website = response.url
        
        interests = response.xpath("string(//div[contains(@class, 'areas-of-interest')])").extract_first()
        bio = response.xpath("string(//div[contains(@class,'field-bio')])").extract_first()

        process = self.process
        
        name, interests, bio = process(name), process(interests), process(bio)
        bio = bio + interests
        
        prettybio = ' '.join(bio[:65].encode('utf-8').splitlines())
        print '{2: <20}\t{0: <25} {1}'.format(name.encode('utf-8'), prettybio, deptName.encode('utf-8'))
        print '{0: >125} [link]'.format(response.url)

        yield {
            'name': name,
            'email': email,
            'bio': bio,
            'department': deptName,
            'website': website
        }

        