# Common Cloud Core
Common Cloud Core (C3) is a reference architecture that targets application
developers, system operators and a new role named Stack Developer. 
C3 pulls together a set of tools to simplify the managment and use of Hybrid Clouds. 

This repository contains the design and a simple interactive reference architecture of the design.
Which can be found on the [readthedocs](http://c3.readthedocs.io/en/latest/index.html)

An implementation of the reference architecture is written using [sailsjs](http://sailsjs.org/) a nodejs MVC framework.


## Design
The design/spec of C3 is presented in the wiki for the repository and can be accessed [here](https://github.com/CAADE/C3/wiki)

The design uses [plantuml](http://plantuml.com/) and [markdown language](https://guides.github.com/features/mastering-markdown/)
to document the architecture.

Plantuml is a text based language that lets you describe UML diagrams. 
All of the plantuml graphic files are shown in the *.md (markdown language files). 
In order to see the graphical representation of the uml files you have to generate *.png files.
To generate the graphic files (*.png) for the plantuml files (*.puml) do the following:
```
# npm run-script design
```

A PDF and html version of the wiki can be generated using wiki2pdf. There is a npm target defined
in the package.json that sets up the default generation of the pdf and html versions of the wiki.
```
# npm run-script build-doc
```

## Application
TBD
