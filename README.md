# Common Cloud Core
Common Cloud Core (C3) is a reference architecture that targets application
developers, system operators and a new role named Stack Developer. 
C3 pulls together a set of tools to simplify the management and use of Hybrid Clouds. 

This repository contains the design and a simple interactive reference architecture of the design.
Which can be found on the [Read the Docs](http://c3.readthedocs.io/en/latest/index.html) document hub.

![image](docs/Architecture.png)

## Design

The design uses [plantuml](http://plantuml.com/) and [rst](http://www.sphinx-doc.org/en/master/usage/restructuredtext/basics.html)
to document the architecture.

Plantuml is a text based language that lets you describe UML diagrams. 
All of the plantuml graphic files are shown in the *.rst files. 
In order to see the graphical representation of the uml files you have to generate *.png files.
To generate the graphic files (*.png) for the plantuml files (*.puml) do the following:
```
# npm run-script design
```

## Implementations

An implementation of the reference architecture is written using [sailsjs](http://sailsjs.org/) a nodejs MVC framework.
