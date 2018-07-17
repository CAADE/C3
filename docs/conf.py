from recommonmark.parser import CommonMarkParser

source_parsers = {
    '.md': CommonMarkParser,
}

project = u"c3"
copyright = u"2018, Intel"
version = "0.0.1"

master_doc = 'index'
source_suffix = ['.rst', '.md']

