# -*- coding: utf-8 -*-
# based on https://stackoverflow.com/questions/45260585/is-it-possible-to-find-the-nodes-with-same-dom-structure

import re

import bs4
from bs4 import element
import scrapy


class ExampleSpider(scrapy.Spider):
    name = "example"
    start_urls = ['http://african.macmillan.yale.edu/people/faculty]

    def parse(self, response):
        min_occurs = 5
        max_occurs = 1000
        min_depth = 7
        max_depth = 7
        pattern = re.compile('^/html/body/.*/(span|div)$')
        extract_content = lambda e: e.css('::text').extract_first()
        #extract_content = lambda e: ' '.join(e.css('*::text').extract())

        doc = bs4.BeautifulSoup(response.body, 'html.parser')

        paths = {}
        self._walk(doc, '', paths)
        paths = self._filter(paths, pattern, min_depth, max_depth,
                             min_occurs, max_occurs)

        for path in paths.keys():
            for e in response.xpath(path):
                yield {'content': extract_content(e)}

    def _walk(self, doc, parent, paths):
        for tag in doc.children:
            if isinstance(tag, element.Tag):
                path = parent + '/' + tag.name
                paths[path] = paths.get(path, 0) + 1
                self._walk(tag, path, paths)

    def _filter(self, paths, pattern, min_depth, max_depth, min_occurs, max_occurs):
        return dict((path, count) for path, count in paths.items()
                        if pattern.match(path) and
                                min_depth <= path.count('/') <= max_depth and
                                min_occurs <= count <= max_occurs)