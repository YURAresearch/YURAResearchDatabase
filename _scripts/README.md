
# YURAbot


## Idea/Goals
Going through faculty websites takes a lot of time. You have to manually go through each listing, copy it into a spreadsheet...

But wait a moment. Don't a lot of Yale pages look like this?
![yale_header](https://i.imgur.com/CA9w6oU.jpg)

If we want to get a list of faculty, some sites make it easily automatable:
![repeat2](/assets/repeat2.jpg)

For others, it's more complicated:
![different](/assets/different.jpg)

If we want to get accurate information for faculty in the Architecture department, we'd have to actually click the pages.

## Trus me, I'm a spider

Roughly speaking, there are two parts to automated "web scraping".

1) Travelling between pages
2) Understanding what is in each page

Both of these are very interesting. For YURAbot, though, we'll focus on a subset of 2). We want something that can extract repeated blocks of information - groups of elements with similar tags/styling.

In particular, faculty names and information!

## How it works
