# --------------------------
# Parse through department websites and find faculty info for YURA database
# By Peter Wang
#
# For YURA internal use only
# --------------------------

# Import modules
import urllib, sys, re
from termcolor import colored, cprint
from bs4 import BeautifulSoup as bs

# Intro text
cprint ("~~~~~~~~~~~~~~~~~~~~~~~","cyan")
cprint ("This program creates a TSV file with the following columns in order:\n- Faculty Name\n- Department\n- Email\n- Website\n- Research Description\n","cyan")
cprint ("It works by the user feeding it a website where links to faculty are listed, and the program extracts the info we want automatically through every faculty's profile using identified markers in the HTML code.","cyan")
cprint ("~~~~~~~~~~~~~~~~~~~~~~~\n","cyan")

# Getting main listing website with links to each profile
try:
	mainweburl = raw_input("What is the main listing website we have?\n>> ")
	mainwebcontents = urllib.urlopen(mainweburl).read()
except:
	sys.exit("Error getting main listing website contents!")

# Set department
dpt = raw_input("What department are we looking at?\n>> ")

# Ready output file
try:
	out = open("outtable.tsv",'w')
except IOError:
	sys.exit("Error preparing output file.")

# Start parsing and searching!
print "Now we are going to look for the links to each faculty on the main listing."

# Counters
c = 0
skips = 0
skipsum = ""
nodesc = 0
nodessum = ""

# For parsing through listing website
prefix = re.escape(raw_input("String that needs to match before\n>> "))
suffix = re.escape(raw_input("String that needs to match after\n>> "))
mainRE = re.compile(prefix+r"(.*)"+suffix+r'*?')
mmatches = re.finditer(mainRE,mainwebcontents)

# For parsing through faculty profile websites
print "We also need to know how to look for the info we need on each faculty's page."
print "| Name:"
facprefixNAME = re.escape(raw_input("| Prefix:\n| >> "))
facsuffixNAME = re.escape(raw_input("| Suffix:\n| >> "))
facnameRE = re.compile(facprefixNAME+r"(.*)"+facsuffixNAME+r'*?')
print "| Email:"
facprefixEMAIL = re.escape(raw_input("| Prefix:\n| >> "))
facsuffixEMAIL = re.escape(raw_input("| Suffix:\n| >> "))
facemailRE = re.compile(facprefixEMAIL+r"(.*)"+facsuffixEMAIL+r'*?')
print "| Website:"
facprefixWEB = re.escape(raw_input("| Prefix:\n| >> "))
facsuffixWEB = re.escape(raw_input("| Suffix:\n| >> "))
facwebRE = re.compile(facprefixWEB+r"(.*)"+facsuffixWEB+r'*?')
print "| Description:"
facprefixDES = re.escape(raw_input("| Prefix:\n| >> "))
facsuffixDES = re.escape(raw_input("| Suffix:\n| >> "))
facdesRE = re.compile(facprefixDES+r"(.*)"+facsuffixDES,re.DOTALL)

for mmatch in mmatches:
	# Get URL
	facURLtail = mmatch.group(1)
	facURL = mainweburl + facURLtail
	try:
		facwebcontents = urllib.urlopen(facURL).read()
	except:
		print "Error accessing faculty webpage!"
		c += 1
		skips += 1
		nodessum += facURL + "\n"
		continue

	# Now we are ready to parse through each profile!
	facname = facnameRE.search(facwebcontents)
	facemail = facemailRE.search(facwebcontents)
	facweb = facwebRE.search(facwebcontents)
	facdes = facdesRE.search(facwebcontents)

	# Either skip or load into output
	if facname == None or facemail == None or facweb == None:
		skipsum += facURL + "\n"
		skips += 1
	elif facdes == None:
		out.write(facname.group(1)+"\t"+dpt+"\t"+facemail.group(1)+"\t"+facweb.group(1)+"\t\n")
		nodessum += facURL + "\n"
		nodesc += 1
	else:
		facdesinterSOUP = bs(facdes.group(1),"html.parser")
		facdesinter1 = facdesinterSOUP.get_text().encode('unicode_escape')
		facdesinter2 = facdesinter1.decode('string_escape')
		facdesinter3 = re.sub('\n','<br/>',facdesinter2)
		facdesinter4 = re.sub('(\t)|(\r)|(\v)','   ',facdesinter3)
		facdesinter = str(facdesinter4.strip())
		out.write(facname.group(1)+"\t"+dpt+"\t"+facemail.group(1)+"\t"+facweb.group(1)+"\t"+facdesinter+"\n")
	c += 1

cprint ("Complete!","green")
print "Faculty profiles gone through: ", c
print "Faculty without description processed: ", nodesc
print nodessum
print "Faculty skipped: ", skips
print skipsum
out.close()